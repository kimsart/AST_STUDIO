import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  StudioSessionStatus: a.enum(['ACTIVE', 'PAUSED', 'ENDED']),
  StudioActivityEventType: a.enum([
    'SESSION_STARTED',
    'SESSION_PAUSED',
    'SESSION_RESUMED',
    'SESSION_ENDED',
    'FOCUS_CHANGED',
    'SESSION_MARKED_FOR_REVIEW',
    'TIME_CORRECTED',
  ]),

  Supply: a
    .model({
      name: a.string().required(),
      category: a.string(),
      subcategory: a.string(),
      itemType: a.string(),
      unit: a.string(),
      barcode: a.string(),
      tags: a.string().array(),
      quantityValue: a.float(),
      quantity: a.integer(),
      location: a.string(),
      notes: a.string(),
      imageKey: a.string(),
      imageUrl: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Project: a
    .model({
      title: a.string().required(),
      description: a.string(),
      status: a.string(),
      notes: a.string(),
      coverImageUrl: a.string(),
      imageKeys: a.string().array(),
      supplyIds: a.string().array(),
    })
    .authorization((allow) => [allow.owner()]),

  StudioSession: a
    .model({
      title: a.string(),
      description: a.string(),
      projectId: a.string(),
      status: a.ref('StudioSessionStatus').required(),
      currentFocusLabel: a.string(),
      currentFocusProjectId: a.string(),
      focusStartedAt: a.datetime(),
      startedAt: a.datetime().required(),
      // Updated only by explicit AST actions or user-confirmed session controls.
      lastActivityAt: a.datetime(),
      endedAt: a.datetime(),
      // The future creation service must initialize all counters to 0 and
      // needsTimeReview to false.
      totalActiveSeconds: a.integer(),
      totalPausedSeconds: a.integer(),
      unconfirmedSeconds: a.integer(),
      needsTimeReview: a.boolean(),
      // IANA time zone identifier, for example "America/Los_Angeles".
      timezone: a.string(),
      summary: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  StudioActivityEvent: a
    .model({
      sessionId: a.string().required(),
      eventType: a.ref('StudioActivityEventType').required(),
      eventAt: a.datetime().required(),
      focusLabel: a.string(),
      focusProjectId: a.string(),
      elapsedSeconds: a.integer(),
      note: a.string(),
      // IANA time zone identifier, for example "America/Los_Angeles".
      timezone: a.string(),
    })
    .secondaryIndexes((index) => [
      index('sessionId').sortKeys(['eventAt']),
    ])
    .authorization((allow) => [allow.owner()]),

  ChatMessage: a
    .model({
      body: a.string().required(),
      senderEmail: a.string().required(),
      senderDisplayName: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
