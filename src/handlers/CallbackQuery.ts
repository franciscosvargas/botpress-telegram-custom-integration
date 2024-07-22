import { IntegrationImplementationProps } from "@botpress/sdk/dist/integration";
import { Telegraf } from "telegraf";
import { checkHandlerInfo } from "src/utils/checkHandlerInfo";

import { createConversation, createUser } from "src/utils/setConversationData";

export const CallbackQueryHandler: IntegrationImplementationProps['handler'] = async (props) => {
  const { req, client, ctx } = props;
  const telegram = new Telegraf(ctx.configuration.botToken);

  const data = JSON.parse(req.body || "{}");
  console.log("Data =>", data);

  const conversationId = data?.callback_query?.message?.chat?.id;
  const userId = data?.callback_query?.message?.from?.id;
  const messageId = data?.callback_query?.message?.message_id;

  checkHandlerInfo({ conversationId, userId, messageId });

  const conversation = await createConversation(client, conversationId);
  const user = await createUser(client, {
    id: `${userId}`,
    first_name: data?.callback_query?.message?.from?.first_name,
    last_name: data?.callback_query?.message?.from?.last_name,
    username: data?.callback_query?.message?.from?.username,
    language: data?.callback_query?.message?.from?.language_code,
  }, ctx);

  await telegram.telegram.editMessageReplyMarkup(
    conversationId,
    messageId,
    "",
    {
      inline_keyboard: [
        [
          {
            text: data.callback_query.data + ` ✔️`,
            callback_data: data.callback_query.data,
          },
        ],
      ],
    }
  );

  await client.createMessage({
    tags: { id: `${messageId}` },
    type: "text",
    userId: user.id,
    conversationId: conversation.id,
    payload: { text: data.callback_query.data },
  });

  return;
}