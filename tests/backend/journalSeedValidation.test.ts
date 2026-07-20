import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateJournalEntryInput,
  validateSeedInput,
} from '../../amplify/data/journalSeedValidation.ts';

test('JournalEntry requires non-empty body content', () => {
  for (const body of ['', '   ', '\n\t']) {
    const result = validateJournalEntryInput({ body });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.issues[0]?.field, 'body');
  }
});

test('Seed requires non-empty content', () => {
  for (const content of ['', '   ', '\n\t']) {
    const result = validateSeedInput({ content });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.issues[0]?.field, 'content');
  }
});

test('optional fields may be omitted from JournalEntry and Seed inputs', () => {
  const journal = validateJournalEntryInput({ body: 'A quiet shift in the sound.' });
  const seed = validateSeedInput({ content: 'What if this opened sideways?' });

  assert.deepEqual(journal, {
    ok: true,
    value: {
      body: 'A quiet shift in the sound.',
      title: undefined,
      category: undefined,
      tags: undefined,
      authoredAt: undefined,
      projectId: undefined,
    },
  });
  assert.deepEqual(seed, {
    ok: true,
    value: {
      content: 'What if this opened sideways?',
      title: undefined,
      category: undefined,
      tags: undefined,
      status: undefined,
      projectId: undefined,
    },
  });
});

test('Project identifiers are normalized consistently and remain optional', () => {
  const journal = validateJournalEntryInput({
    body: 'Pin this observation.',
    projectId: '  project-ceramics-01  ',
  });
  const seed = validateSeedInput({
    content: 'Return to this question.',
    projectId: '  project-ceramics-01  ',
  });
  const unlinkedJournal = validateJournalEntryInput({ body: 'Unlinked note.', projectId: '   ' });
  const unlinkedSeed = validateSeedInput({ content: 'Unlinked idea.', projectId: '   ' });

  assert.equal(journal.ok && journal.value.projectId, 'project-ceramics-01');
  assert.equal(seed.ok && seed.value.projectId, 'project-ceramics-01');
  assert.equal(unlinkedJournal.ok && unlinkedJournal.value.projectId, undefined);
  assert.equal(unlinkedSeed.ok && unlinkedSeed.value.projectId, undefined);
});

test('artist-defined categories, tags, and statuses are preserved without canonicalization', () => {
  const journal = validateJournalEntryInput({
    body: '  The room tone became part of the work.  ',
    category: '  field-listening / maybe-score  ',
    tags: ['  not-a-painting  ', 'glitch? yes', 'not-a-painting', 'Not-A-Painting'],
    authoredAt: '2026-07-19T21:15:00-07:00',
  });
  const seed = validateSeedInput({
    content: '  Fold the question into the performance.  ',
    category: '  unfinished provocations  ',
    status: '  composting until the next residency  ',
    tags: ['  movement notation  ', '??', 'movement notation'],
  });

  assert.equal(journal.ok, true);
  assert.equal(seed.ok, true);
  if (!journal.ok || !seed.ok) return;
  assert.deepEqual(journal.value, {
    body: 'The room tone became part of the work.',
    title: undefined,
    category: 'field-listening / maybe-score',
    tags: ['not-a-painting', 'glitch? yes', 'Not-A-Painting'],
    authoredAt: '2026-07-20T04:15:00.000Z',
    projectId: undefined,
  });
  assert.deepEqual(seed.value, {
    content: 'Fold the question into the performance.',
    title: undefined,
    category: 'unfinished provocations',
    tags: ['movement notation', '??'],
    status: 'composting until the next residency',
    projectId: undefined,
  });
});

test('JournalEntry rejects an invalid authored date', () => {
  const result = validateJournalEntryInput({
    body: 'A dated observation.',
    authoredAt: 'sometime after lunch',
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.deepEqual(result.issues, [{
      field: 'authoredAt',
      code: 'invalid_datetime',
      message: 'authoredAt must be a valid date-time.',
    }]);
  }
});
