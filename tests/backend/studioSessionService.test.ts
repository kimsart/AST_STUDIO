import assert from 'node:assert/strict';
import test from 'node:test';

import {
  StudioSessionLifecycleError,
  StudioSessionService,
  type StudioActivityEventCreatePayload,
  type StudioActivityEventRecord,
  type StudioSessionCreatePayload,
  type StudioSessionRecord,
  type StudioSessionStore,
  type StudioSessionUpdatePayload,
} from '../../amplify/data/studioSessionService.ts';

class MemoryStudioSessionStore implements StudioSessionStore {
  readonly sessions = new Map<string, StudioSessionRecord>();
  readonly events: StudioActivityEventRecord[] = [];
  readonly sessionCreates: StudioSessionCreatePayload[] = [];
  readonly eventCreates: StudioActivityEventCreatePayload[] = [];
  reverseEventResults = false;

  async getSession(id: string): Promise<StudioSessionRecord | null> {
    return this.sessions.get(id) ?? null;
  }

  async createSession(input: StudioSessionCreatePayload): Promise<StudioSessionRecord> {
    this.sessionCreates.push({ ...input });
    const session = { id: `session-${this.sessions.size + 1}`, ...input };
    this.sessions.set(session.id, session);
    return session;
  }

  async updateSession(input: StudioSessionUpdatePayload): Promise<StudioSessionRecord> {
    const current = this.sessions.get(input.id);
    if (!current) throw new Error('Missing test session.');
    const updated = { ...current, ...input };
    this.sessions.set(updated.id, updated);
    return updated;
  }

  async createEvent(input: StudioActivityEventCreatePayload): Promise<StudioActivityEventRecord> {
    this.eventCreates.push({ ...input });
    const event = { id: `event-${this.events.length + 1}`, ...input };
    this.events.push(event);
    return event;
  }

  async listEventsBySessionId(sessionId: string): Promise<StudioActivityEventRecord[]> {
    const events = this.events.filter((event) => event.sessionId === sessionId);
    return this.reverseEventResults ? events.reverse() : events;
  }
}

const startAt = '2026-07-18T17:00:00.000Z';

function setup() {
  const store = new MemoryStudioSessionStore();
  return { store, service: new StudioSessionService(store) };
}

async function started(service: StudioSessionService): Promise<StudioSessionRecord> {
  return service.start({
    startedAt: startAt,
    timezone: 'America/Los_Angeles',
    focusLabel: 'Glazing',
    focusProjectId: 'project-1',
  });
}

async function lifecycleError(action: () => Promise<unknown>): Promise<StudioSessionLifecycleError> {
  try {
    await action();
  } catch (error) {
    assert.ok(error instanceof StudioSessionLifecycleError);
    return error;
  }
  throw new Error('Expected StudioSessionLifecycleError.');
}

test('start initializes privacy-safe defaults and creates an owner-scoped start event payload', async () => {
  const { store, service } = setup();
  const session = await service.start({
    startedAt: startAt,
    timezone: 'America/Los_Angeles',
    owner: 'caller-selected-owner',
  } as never);

  assert.equal(session.status, 'ACTIVE');
  assert.equal(session.startedAt, startAt);
  assert.equal(session.lastActivityAt, startAt);
  assert.equal(session.totalActiveSeconds, 0);
  assert.equal(session.totalPausedSeconds, 0);
  assert.equal(session.unconfirmedSeconds, 0);
  assert.equal(session.needsTimeReview, false);
  assert.equal(Object.hasOwn(store.sessionCreates[0], 'owner'), false);
  assert.equal(Object.hasOwn(store.eventCreates[0], 'owner'), false);
  assert.deepEqual(store.events[0], {
    id: 'event-1',
    sessionId: session.id,
    eventType: 'SESSION_STARTED',
    eventAt: startAt,
    focusLabel: undefined,
    focusProjectId: undefined,
    timezone: 'America/Los_Angeles',
  });
});

test('pause, resume, and end accept only explicit elapsed time and calculate active and paused totals', async () => {
  const { store, service } = setup();
  const session = await started(service);

  const paused = await service.pause(session.id, {
    eventAt: '2026-07-18T17:30:00.000Z',
    elapsedSeconds: 1_500,
  });
  assert.equal(paused.status, 'PAUSED');
  assert.equal(paused.totalActiveSeconds, 1_500);
  assert.equal(paused.focusStartedAt, null);

  const resumed = await service.resume(session.id, {
    eventAt: '2026-07-18T17:40:00.000Z',
    elapsedSeconds: 600,
  });
  assert.equal(resumed.status, 'ACTIVE');
  assert.equal(resumed.totalPausedSeconds, 600);

  const ended = await service.end(session.id, {
    eventAt: '2026-07-18T18:00:00.000Z',
    elapsedSeconds: 1_200,
  });
  assert.equal(ended.status, 'ENDED');
  assert.equal(ended.totalActiveSeconds, 2_700);
  assert.equal(ended.totalPausedSeconds, 600);
  assert.equal(ended.endedAt, '2026-07-18T18:00:00.000Z');
  assert.deepEqual(store.events.map((event) => event.eventType), [
    'SESSION_STARTED',
    'SESSION_PAUSED',
    'SESSION_RESUMED',
    'SESSION_ENDED',
  ]);
});

test('an open timer is not treated as proof of continuous work', async () => {
  const { service } = setup();
  const session = await started(service);
  const paused = await service.pause(session.id, {
    eventAt: '2026-07-18T23:00:00.000Z',
  });
  assert.equal(paused.totalActiveSeconds, 0);
  assert.equal(paused.unconfirmedSeconds, 0);
});

test('invalid transitions and backward explicit activity timestamps are rejected', async () => {
  const { service } = setup();
  const session = await started(service);

  assert.equal((await lifecycleError(() => service.resume(session.id, {
    eventAt: '2026-07-18T17:01:00.000Z',
  }))).code, 'INVALID_TRANSITION');

  await service.pause(session.id, { eventAt: '2026-07-18T17:10:00.000Z' });
  assert.equal((await lifecycleError(() => service.pause(session.id, {
    eventAt: '2026-07-18T17:11:00.000Z',
  }))).code, 'INVALID_TRANSITION');

  assert.equal((await lifecycleError(() => service.resume(session.id, {
    eventAt: '2026-07-18T17:09:00.000Z',
  }))).code, 'INVALID_INPUT');

  await service.end(session.id, { eventAt: '2026-07-18T17:20:00.000Z' });
  assert.equal((await lifecycleError(() => service.end(session.id, {
    eventAt: '2026-07-18T17:21:00.000Z',
  }))).code, 'INVALID_TRANSITION');
  assert.equal((await lifecycleError(() => service.markForReview(session.id, {
    eventAt: '2026-07-18T17:21:00.000Z',
  }))).code, 'INVALID_TRANSITION');
});

test('uncertain time is retained for review and explicitly corrected into confirmed totals', async () => {
  const { store, service } = setup();
  const session = await started(service);
  const paused = await service.pause(session.id, {
    eventAt: '2026-07-18T17:30:00.000Z',
    elapsedSeconds: 1_200,
    unconfirmedSeconds: 300,
  });
  assert.equal(paused.totalActiveSeconds, 1_200);
  assert.equal(paused.unconfirmedSeconds, 300);
  assert.equal(paused.needsTimeReview, true);

  const marked = await service.markForReview(session.id, {
    eventAt: '2026-07-18T17:31:00.000Z',
    unconfirmedSeconds: 120,
    note: 'Confirm cleanup time',
  });
  assert.equal(marked.unconfirmedSeconds, 420);
  assert.equal(marked.needsTimeReview, true);

  const partlyCorrected = await service.correctTime(session.id, {
    eventAt: '2026-07-18T17:32:00.000Z',
    activeSeconds: 240,
    pausedSeconds: 60,
  });
  assert.equal(partlyCorrected.totalActiveSeconds, 1_440);
  assert.equal(partlyCorrected.totalPausedSeconds, 60);
  assert.equal(partlyCorrected.unconfirmedSeconds, 120);
  assert.equal(partlyCorrected.needsTimeReview, true);

  const corrected = await service.correctTime(session.id, {
    eventAt: '2026-07-18T17:33:00.000Z',
    activeSeconds: 120,
    note: 'User confirmed quiet work',
  });
  assert.equal(corrected.totalActiveSeconds, 1_560);
  assert.equal(corrected.unconfirmedSeconds, 0);
  assert.equal(corrected.needsTimeReview, false);
  assert.equal(store.events.at(-1)?.eventType, 'TIME_CORRECTED');
  assert.equal(store.events.at(-1)?.elapsedSeconds, 120);
});

test('focus changes create explicit events without discarding quiet work', async () => {
  const { store, service } = setup();
  const session = await started(service);
  const changed = await service.changeFocus(session.id, {
    eventAt: '2026-07-18T17:20:00.000Z',
    focusLabel: 'Kiln notes',
    focusProjectId: 'project-2',
    elapsedSeconds: 900,
    unconfirmedSeconds: 300,
  });

  assert.equal(changed.currentFocusLabel, 'Kiln notes');
  assert.equal(changed.currentFocusProjectId, 'project-2');
  assert.equal(changed.focusStartedAt, '2026-07-18T17:20:00.000Z');
  assert.equal(changed.totalActiveSeconds, 900);
  assert.equal(changed.unconfirmedSeconds, 300);
  assert.equal(changed.needsTimeReview, true);
  assert.deepEqual(store.events.at(-1), {
    id: 'event-2',
    sessionId: session.id,
    eventType: 'FOCUS_CHANGED',
    eventAt: '2026-07-18T17:20:00.000Z',
    focusLabel: 'Kiln notes',
    focusProjectId: 'project-2',
    elapsedSeconds: 900,
    note: undefined,
    timezone: 'America/Los_Angeles',
  });
});

test('changing focus while paused preserves the last active focus start', async () => {
  const { store, service } = setup();
  store.sessions.set('paused-session', {
    id: 'paused-session',
    status: 'PAUSED',
    startedAt: startAt,
    lastActivityAt: '2026-07-18T17:20:00.000Z',
    focusStartedAt: startAt,
    timezone: 'America/Los_Angeles',
  });

  const changed = await service.changeFocus('paused-session', {
    eventAt: '2026-07-18T17:25:00.000Z',
    focusLabel: 'Plan next firing',
  });

  assert.equal(changed.status, 'PAUSED');
  assert.equal(changed.currentFocusLabel, 'Plan next firing');
  assert.equal(changed.focusStartedAt, startAt);
});

test('events are returned in chronological eventAt order', async () => {
  const { store, service } = setup();
  const session = await started(service);
  await service.pause(session.id, { eventAt: '2026-07-18T17:30:00.000Z' });
  await service.resume(session.id, { eventAt: '2026-07-18T17:40:00.000Z' });
  store.reverseEventResults = true;

  assert.deepEqual((await service.listEvents(session.id)).map((event) => event.eventAt), [
    '2026-07-18T17:00:00.000Z',
    '2026-07-18T17:30:00.000Z',
    '2026-07-18T17:40:00.000Z',
  ]);
});

test('timezone values and time corrections are validated', async () => {
  const { service } = setup();
  assert.equal((await lifecycleError(() => service.start({
    startedAt: startAt,
    timezone: 'Not/AZone',
  }))).code, 'INVALID_INPUT');

  const session = await started(service);
  await service.markForReview(session.id, {
    eventAt: '2026-07-18T17:10:00.000Z',
    unconfirmedSeconds: 60,
  });
  assert.equal((await lifecycleError(() => service.correctTime(session.id, {
    eventAt: '2026-07-18T17:11:00.000Z',
    activeSeconds: 61,
  }))).code, 'INVALID_INPUT');
});
