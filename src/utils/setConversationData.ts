import { IntegrationContext, IntegrationSpecificClient } from "@botpress/sdk";
import { BaseIntegration } from "@botpress/sdk/dist/integration/generic";

import { Client } from "@botpress/client";

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export async function createConversation(client: IntegrationSpecificClient<BaseIntegration>, conversationId: string, channel: string = "group") {
  const { conversation } = await client.getOrCreateConversation({
    channel,
    tags: { id: `${conversationId}` },
  });

  return conversation;

}

export async function createUser(client: IntegrationSpecificClient<BaseIntegration>, User: User, ctx: IntegrationContext) {
  const { user } = await client.getOrCreateUser({
    tags: {
      id: `${User.id}`,
    },
  });

  const botpressClient = new Client({
    botId: ctx.botId,
    integrationId: ctx.integrationId,
  });

  const userSearch = await botpressClient.findTableRows({
    table: 'Users_Table',
    filter: {
      channelId: User.id
    }
  })

  if(userSearch.rows.length > 0) {
    return user;
  }

  // Create a User if is not found

  await botpressClient.createTableRows({
    table: 'Users_Table',
    rows: [
     {
      ...User,
      channelId: User.id
     }
    ]
  })

  return user;
}
