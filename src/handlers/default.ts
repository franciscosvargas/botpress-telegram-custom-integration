import { IntegrationImplementationProps } from "@botpress/sdk/dist/integration";
import { Telegraf } from "telegraf";
import { checkHandlerInfo } from "src/utils/checkHandlerInfo";

import { createConversation, createUser } from "src/utils/setConversationData";

const DefaultHandler: IntegrationImplementationProps['handler'] = async (props) => {
  const { req, client, ctx } = props;

  const data = JSON.parse(req.body || "{}");
  console.log("Data =>", data);

  const conversationId = data?.message?.chat?.id;
  const userId = data?.message?.from?.id;
  const messageId = data?.message?.message_id;

  checkHandlerInfo({ conversationId, userId, messageId });

  const conversation = await createConversation(client, conversationId);
  
  const user = await createUser(client, {
    id: `${userId}`,
    first_name: data?.message?.from?.first_name,
    last_name: data?.message?.from?.last_name,
    username: data?.message?.from?.username,
    language: data?.message?.from?.language_code,
  }, ctx);

  await client.createMessage({
    tags: { id: `${messageId}` },
    type: "text",
    userId: user.id,
    conversationId: conversation.id,
    payload: { text: data.message.text },
  });
}

export default DefaultHandler;