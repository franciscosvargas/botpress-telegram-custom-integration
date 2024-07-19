import { IntegrationContext } from "@botpress/sdk";
import { Client } from "@botpress/client";

interface GetUserInfoProps {
  input: any;
  ctx: IntegrationContext;
}

export default async function getUserInfo({ ctx }: GetUserInfoProps) {
  try {
    const client = new Client({
      botId: ctx.botId,
      integrationId: ctx.integrationId,
    });

    const { user } = await client.getUser({ id: ctx.botUserId });

    if (!user) {
      throw new Error("User not found");
    }

    const channelId = user.tags.id;

    const userSearch = await client.findTableRows({
      table: "Users_Table",
      filter: {
        channelId,
      },
    });

    if (userSearch.rows.length > 0) {
      return userSearch.rows[0];
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}
