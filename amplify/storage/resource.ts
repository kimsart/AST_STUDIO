import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'astStudioImages',
  access: (allow) => ({
    'project-images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'supply-images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});
