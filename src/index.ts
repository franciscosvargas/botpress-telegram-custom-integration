import * as sdk from "@botpress/sdk";
import * as bp from ".botpress";
import { Telegraf } from "telegraf";

export default new bp.Integration({
  register: async ({ webhookUrl, ctx }) => {
    const telegraf = new Telegraf(ctx.configuration.botToken);
    try {
      await telegraf.telegram.setWebhook(webhookUrl);
    } catch (error) {
      throw new sdk.RuntimeError(
        "Configuration Error! The Telegram bot token is not set. Please set it in your bot integration configuration."
      );
    }
  },
  unregister: async ({ ctx }) => {
    const telegraf = new Telegraf(ctx.configuration.botToken);
    await telegraf.telegram.deleteWebhook({ drop_pending_updates: true });
  },
  actions: {
    helloWorld: async (props) => {
      /**
       * This is called when a bot calls the action `helloWorld`.
       */
      props.logger.forBot().info("Hello World!"); // this log will be visible by the bots that use this integration

      let { name } = props.input;
      name = name || "World";
      return { message: `Hello "${name}"! Nice to meet you ;)` };
    },
  },
  channels: {
    group: {
      messages: {
        text: async ({ payload, ctx, conversation, ack }: any) => {
          const client = new Telegraf(ctx.configuration.botToken);

          console.log("Payload =>", payload || "");
          const message = await client.telegram.sendMessage(
            conversation.tags["id"]!,
            payload.text
          );
          await ack({ tags: { id: `${message.message_id}` } });
        },
        choice: async ({ payload, ctx, conversation, ack }: any) => {
          const client = new Telegraf(ctx.configuration.botToken);

          console.log("Options =>", payload.options || "");
          try {
            const message = await client.telegram.sendMessage(
              conversation.tags["id"]!,
              payload.text,
              {
                reply_markup: {
                  inline_keyboard: payload.options.map((option: any) => [
                    {
                      text: option.label,
                      callback_data: option.value
                    },
                  ]),
                },
              }
            );
            await ack({ tags: { id: `${message.message_id}` } });
          } catch (error) {
            console.error("Error sending quiz:", error);
          }
        },
      },
    },
  },
  handler: async ({ req, client, ctx }) => {
    const telegram = new Telegraf(ctx.configuration.botToken);
    const data = JSON.parse(req.body || "{}");

    const conversationId = data?.callback_query?.message?.chat?.id || data?.message?.chat?.id;
    const userId = data?.callback_query?.message?.from?.id || data?.message?.from?.id;
    const messageId = data?.callback_query?.message?.message_id ||data?.message?.message_id;

    console.log("Data =>", data);

    if (!conversationId || !userId || !messageId) {
      return {
        status: 400,
        body: "Handler didn't receive a valid message",
      };
    }

    try {
      const { conversation } = await client.getOrCreateConversation({
        channel: "group",
        tags: { id: `${conversationId}` },
      });

      const { user } = await client.getOrCreateUser({
        tags: { id: `${userId}` },
      });

      if(data.callback_query) {

        await client.createMessage({
          tags: { id: `${messageId}` },
          type: "text",
          userId: user.id,
          conversationId: conversation.id,
          payload: { text: data.callback_query.data, }, 
        })

        await telegram.telegram.answerCbQuery(data.callback_query.id);
      }

      await client.createMessage({
        tags: { id: `${messageId}` },
        type: "text",
        userId: user.id,
        conversationId: conversation.id,
        payload: { text: data.message.text },
      });

      return {
        status: 200,
        body: "Message received",
      };
    } catch (error) {
      console.error("Error handling message:", error);
    }
  },
});
