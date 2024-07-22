import { IntegrationContext } from "@botpress/sdk";
import axios from "axios";

interface GetUserInfoProps {
  input: any;
  ctx: IntegrationContext;
}

export default async function createTelegramChatLink({ ctx, input }: GetUserInfoProps) {
  try {
   
    const { chat_id, member_limit = 1 } = input;

    const response = await axios.post(`https://api.telegram.org/bot${ctx.configuration.botToken}/exportChatInviteLink`, {
      chat_id,
      member_limit
    })

    return {
      inviteLink: response.data.result
    }
  } catch (error) {
    console.log(error)
    throw new Error("Error creating Telegram Chat Link");
  }
}
