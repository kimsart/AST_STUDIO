export type StudioSessionStatus = 'ACTIVE' | 'PAUSED' | 'ENDED';

export type StudioActivityEventType =
  | 'SESSION_STARTED'
  | 'SESSION_PAUSED'
  | 'SESSION_RESUMED'
  | 'SESSION_ENDED'
  | 'FOCUS_CHANGED'
  | 'SESSION_MARKED_FOR_REVIEW'
  | 'TIME_CORRECTED';

export interface StudioSessionRecord {
  id: string;
  title?: string | null;
  description?: string | null;
  projectId?: string | null;
  status: StudioSessionStatus;
  currentFocusLabel?: string | null;
  currentFocusProjectId?: string | null;
  focusStartedAt?: string | null;
  startedAt: string;
  lastActivityAt?: string | null;
  endedAt?: string | null;
  totalActiveSeconds?: number | null;
  totalPausedSeconds?: number | null;
  unconfirmedSeconds?: number | null;
  needsTimeReview?: boolean | null;
  timezone?: string | null;
  summary?: string | null;
  owner?: string | null;
}

export interface StudioActivityEventRecord {
  id: string;
  sessionId: string;
  eventType: StudioActivityEventType;
  eventAt: string;
  focusLabel?: string | null;
  focusProjectId?: string | null;
  elapsedSeconds?: number | null;
  note?: string | null;
  timezone?: string | null;
  owner?: string | null;
}

export type StudioSessionCreatePayload = Omit<StudioSessionRecord, 'id' | 'owner'>;
export type StudioSessionUpdatePayload = Partial<Omit<StudioSessionRecord, 'id' | 'owner'>> & { id: string };
export type StudioActivityEventCreatePayload = Omit<StudioActivityEventRecord, 'id' | 'owner'>;

export interface StudioSessionStore {
  getSession(id: string): Promise<StudioSessionRecord | null>;
  createSession(input: StudioSessionCreatePayload): Promise<StudioSessionRecord>;
  updateSession(input: StudioSessionUpdatePayload): Promise<StudioSessionRecord>;
  createEvent(input: StudioActivityEventCreatePayload): Promise<StudioActivityEventRecord>;
  listEventsBySessionId(sessionId: string): Promise<StudioActivityEventRecord[]>;
}

export class StudioSessionLifecycleError extends Error {
  constructor(
    message: string,
    readonly code: 'INVALID_INPUT' | 'SESSION_NOT_FOUND' | 'INVALID_TRANSITION',
  ) {
    super(message);
    this.name = 'StudioSessionLifecycleError';
  }
}

export interface StartSessionInput {
  startedAt: string;
  timezone: string;
  title?: string;
  description?: string;
  projectId?: string;
  focusLabel?: string;
  focusProjectId?: string;
}

export interface ConfirmedIntervalInput {
  eventAt: string;
  /** Explicitly user-confirmed time. Never inferred from wall-clock duration. */
  elapsedSeconds?: number;
  /** Provisional time retained for later review. */
  unconfirmedSeconds?: number;
  note?: string;
  timezone?: string;
}

export interface ChangeFocusInput extends ConfirmedIntervalInput {
  focusLabel?: string | null;
  focusProjectId?: string | null;
}

export interface MarkForReviewInput {
  eventAt: string;
  unconfirmedSeconds?: number;
  note?: string;
  timezone?: string;
}

export interface CorrectTimeInput {
  eventAt: string;
  activeSeconds?: number;
  pausedSeconds?: number;
  note?: string;
  timezone?: string;
}

function invalid(message: string): never {
  throw new StudioSessionLifecycleError(message, 'INVALID_INPUT');
}

function requiredId(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) invalid(`${field} is required.`);
  return normalized;
}

function timestamp(value: string, field: string): string {
  const milliseconds = Date.parse(value);
  if (!value || !Number.isFinite(milliseconds)) invalid(`${field} must be a valid ISO timestamp.`);
  return new Date(milliseconds).toISOString();
}

function seconds(value: number | undefined, field: string): number {
  const normalized = value ?? 0;
  if (!Number.isSafeInteger(normalized) || normalized < 0) {
    invalid(`${field} must be a non-negative integer.`);
  }
  return normalized;
}

function ianaTimezone(value: string): string {
  const normalized = value.trim();
  if (!normalized) invalid('timezone must be an IANA time zone identifier.');
  try {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: normalized });
    formatter.format();
    return formatter.resolvedOptions().timeZone;
  } catch {
    invalid('timezone must be an IANA time zone identifier.');
  }
}

function total(value: number | null | undefined): number {
  return Number.isSafeInteger(value) && (value ?? 0) >= 0 ? value ?? 0 : 0;
}

function assertChronological(session: StudioSessionRecord, eventAt: string): void {
  const previous = session.lastActivityAt ?? session.startedAt;
  if (Date.parse(eventAt) < Date.parse(previous)) {
    invalid('eventAt cannot be earlier than the session\'s last explicit activity.');
  }
}

export class StudioSessionService {
  constructor(private readonly store: StudioSessionStore) {}

  async start(input: StartSessionInput): Promise<StudioSessionRecord> {
    const startedAt = timestamp(input.startedAt, 'startedAt');
    const timezone = ianaTimezone(input.timezone);
    const session = await this.store.createSession({
      title: input.title,
      description: input.description,
      projectId: input.projectId,
      status: 'ACTIVE',
      currentFocusLabel: input.focusLabel,
      currentFocusProjectId: input.focusProjectId,
      focusStartedAt: input.focusLabel || input.focusProjectId ? startedAt : undefined,
      startedAt,
      lastActivityAt: startedAt,
      totalActiveSeconds: 0,
      totalPausedSeconds: 0,
      unconfirmedSeconds: 0,
      needsTimeReview: false,
      timezone,
    });
    await this.createEvent(session, 'SESSION_STARTED', startedAt, {
      focusLabel: input.focusLabel,
      focusProjectId: input.focusProjectId,
      timezone,
    });
    return session;
  }

  async pause(sessionId: string, input: ConfirmedIntervalInput): Promise<StudioSessionRecord> {
    const session = await this.session(sessionId);
    this.assertStatus(session, ['ACTIVE'], 'pause');
    return this.transition(session, 'PAUSED', 'SESSION_PAUSED', input);
  }

  async resume(sessionId: string, input: ConfirmedIntervalInput): Promise<StudioSessionRecord> {
    const session = await this.session(sessionId);
    this.assertStatus(session, ['PAUSED'], 'resume');
    return this.transition(session, 'ACTIVE', 'SESSION_RESUMED', input);
  }

  async end(sessionId: string, input: ConfirmedIntervalInput): Promise<StudioSessionRecord> {
    const session = await this.session(sessionId);
    this.assertStatus(session, ['ACTIVE', 'PAUSED'], 'end');
    return this.transition(session, 'ENDED', 'SESSION_ENDED', input);
  }

  async changeFocus(sessionId: string, input: ChangeFocusInput): Promise<StudioSessionRecord> {
    const session = await this.session(sessionId);
    this.assertStatus(session, ['ACTIVE', 'PAUSED'], 'change focus');
    const eventAt = timestamp(input.eventAt, 'eventAt');
    assertChronological(session, eventAt);
    const elapsed = seconds(input.elapsedSeconds, 'elapsedSeconds');
    const provisional = seconds(input.unconfirmedSeconds, 'unconfirmedSeconds');
    const update = this.timingUpdate(session, elapsed, provisional);
    const updated = await this.store.updateSession({
      id: session.id,
      ...update,
      currentFocusLabel: input.focusLabel ?? null,
      currentFocusProjectId: input.focusProjectId ?? null,
      focusStartedAt: session.status === 'ACTIVE' ? eventAt : session.focusStartedAt,
      lastActivityAt: eventAt,
    });
    await this.createEvent(updated, 'FOCUS_CHANGED', eventAt, {
      focusLabel: input.focusLabel,
      focusProjectId: input.focusProjectId,
      elapsedSeconds: elapsed,
      note: input.note,
      timezone: this.eventTimezone(session, input.timezone),
    });
    return updated;
  }

  async markForReview(sessionId: string, input: MarkForReviewInput): Promise<StudioSessionRecord> {
    const session = await this.session(sessionId);
    this.assertStatus(session, ['ACTIVE', 'PAUSED'], 'mark for review');
    const eventAt = timestamp(input.eventAt, 'eventAt');
    assertChronological(session, eventAt);
    const provisional = seconds(input.unconfirmedSeconds, 'unconfirmedSeconds');
    const updated = await this.store.updateSession({
      id: session.id,
      unconfirmedSeconds: total(session.unconfirmedSeconds) + provisional,
      needsTimeReview: true,
      lastActivityAt: eventAt,
    });
    await this.createEvent(updated, 'SESSION_MARKED_FOR_REVIEW', eventAt, {
      elapsedSeconds: provisional,
      note: input.note,
      timezone: this.eventTimezone(session, input.timezone),
    });
    return updated;
  }

  async correctTime(sessionId: string, input: CorrectTimeInput): Promise<StudioSessionRecord> {
    const session = await this.session(sessionId);
    const eventAt = timestamp(input.eventAt, 'eventAt');
    assertChronological(session, eventAt);
    const active = seconds(input.activeSeconds, 'activeSeconds');
    const paused = seconds(input.pausedSeconds, 'pausedSeconds');
    const corrected = active + paused;
    const unresolved = total(session.unconfirmedSeconds);
    if (corrected > unresolved) invalid('Corrected time cannot exceed unconfirmedSeconds.');
    const remaining = unresolved - corrected;
    const updated = await this.store.updateSession({
      id: session.id,
      totalActiveSeconds: total(session.totalActiveSeconds) + active,
      totalPausedSeconds: total(session.totalPausedSeconds) + paused,
      unconfirmedSeconds: remaining,
      needsTimeReview: remaining > 0,
      lastActivityAt: eventAt,
    });
    await this.createEvent(updated, 'TIME_CORRECTED', eventAt, {
      elapsedSeconds: corrected,
      note: input.note,
      timezone: this.eventTimezone(session, input.timezone),
    });
    return updated;
  }

  async listEvents(sessionId: string): Promise<StudioActivityEventRecord[]> {
    const normalizedId = requiredId(sessionId, 'sessionId');
    const events = await this.store.listEventsBySessionId(normalizedId);
    return [...events].sort((left, right) => {
      const chronological = Date.parse(left.eventAt) - Date.parse(right.eventAt);
      return chronological || left.id.localeCompare(right.id);
    });
  }

  private async transition(
    session: StudioSessionRecord,
    nextStatus: StudioSessionStatus,
    eventType: StudioActivityEventType,
    input: ConfirmedIntervalInput,
  ): Promise<StudioSessionRecord> {
    const eventAt = timestamp(input.eventAt, 'eventAt');
    assertChronological(session, eventAt);
    const elapsed = seconds(input.elapsedSeconds, 'elapsedSeconds');
    const provisional = seconds(input.unconfirmedSeconds, 'unconfirmedSeconds');
    const update = this.timingUpdate(session, elapsed, provisional);
    const updated = await this.store.updateSession({
      id: session.id,
      ...update,
      status: nextStatus,
      focusStartedAt: nextStatus === 'ACTIVE' ? eventAt : null,
      lastActivityAt: eventAt,
      endedAt: nextStatus === 'ENDED' ? eventAt : session.endedAt,
    });
    await this.createEvent(updated, eventType, eventAt, {
      elapsedSeconds: elapsed,
      note: input.note,
      timezone: this.eventTimezone(session, input.timezone),
    });
    return updated;
  }

  private timingUpdate(
    session: StudioSessionRecord,
    elapsed: number,
    provisional: number,
  ): Omit<StudioSessionUpdatePayload, 'id'> {
    return {
      totalActiveSeconds: total(session.totalActiveSeconds) + (session.status === 'ACTIVE' ? elapsed : 0),
      totalPausedSeconds: total(session.totalPausedSeconds) + (session.status === 'PAUSED' ? elapsed : 0),
      unconfirmedSeconds: total(session.unconfirmedSeconds) + provisional,
      needsTimeReview: Boolean(session.needsTimeReview) || provisional > 0,
    };
  }

  private async session(sessionId: string): Promise<StudioSessionRecord> {
    const normalizedId = requiredId(sessionId, 'sessionId');
    const session = await this.store.getSession(normalizedId);
    if (!session) {
      throw new StudioSessionLifecycleError(`StudioSession ${normalizedId} was not found.`, 'SESSION_NOT_FOUND');
    }
    return session;
  }

  private assertStatus(
    session: StudioSessionRecord,
    allowed: readonly StudioSessionStatus[],
    action: string,
  ): void {
    if (!allowed.includes(session.status)) {
      throw new StudioSessionLifecycleError(
        `Cannot ${action} a StudioSession with status ${session.status}.`,
        'INVALID_TRANSITION',
      );
    }
  }

  private eventTimezone(session: StudioSessionRecord, override?: string): string {
    return ianaTimezone(override ?? session.timezone ?? '');
  }

  private createEvent(
    session: StudioSessionRecord,
    eventType: StudioActivityEventType,
    eventAt: string,
    fields: Pick<
      StudioActivityEventCreatePayload,
      'focusLabel' | 'focusProjectId' | 'elapsedSeconds' | 'note' | 'timezone'
    >,
  ): Promise<StudioActivityEventRecord> {
    return this.store.createEvent({
      sessionId: session.id,
      eventType,
      eventAt,
      ...fields,
    });
  }
}
