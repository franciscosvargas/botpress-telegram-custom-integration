import { IntegrationSpecificClient } from "@botpress/sdk";
import { BaseIntegration } from "@botpress/sdk/dist/integration/generic";

export async function createConversation(client: IntegrationSpecificClient<BaseIntegration>, conversationId: string, channel: string = "group") {
  const { conversation } = await client.getOrCreateConversation({
    channel,
    tags: { id: `${conversationId}` },
  });

  return conversation;

}

export async function createUser(client: IntegrationSpecificClient<BaseIntegration>, userId: string) {
  const { user } = await client.getOrCreateUser({
    tags: {
      id: `${userId}`,
    },
  });

  return user;
}
