import * as sdk from "@botpress/sdk";
import * as bp from ".botpress";
import { Telegraf } from "telegraf";
import { CallbackQueryHandler } from "./handlers/CallbackQuery";
import DefaultHandler from "./handlers/default";

import getUserInfo from "./actions/getUserInfo";
import createTelegramChatLink from "./actions/createTelegramChatLink";


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
    getUserInfo,
    createTelegramChatLink,
  },
  channels: {
    group: {
      messages: {
        text: async ({ payload, ctx, conversation, ack }: any) => {
          const client = new Telegraf(ctx.configuration.botToken);

          console.log("Payload =>", payload || "");
          const message = await client.telegram.sendMessage(
            conversation.tags["id"]!,
            payload.text,
            {
              parse_mode: "Markdown",
            }
          );
          await ack({ tags: { id: `${message.message_id}` } });
        },
        choice: async ({ payload, ctx, conversation, ack }: any) => {
          const client = new Telegraf(ctx.configuration.botToken);

          console.log("Options =>", payload.options || "");
          try {
            const message = await client.telegram.sendMessage(
              conversation.tags["id"]!,
              payload.text || "",
              {
                reply_markup: {
                  inline_keyboard: payload.options.map((option: any) => [
                    {
                      text: option.label,
                      callback_data: option.value,
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
    try {
      const data = JSON.parse(req.body || "{}");

      const chatType =
        data?.message?.chat?.type || data?.callback_query?.message?.chat?.type;

      if (chatType != "private") {
        return {
          status: 200,
          body: "Message received",
        };
      }

      if (data?.callback_query) {
        await CallbackQueryHandler({ req, client, ctx });
      } else {
        await DefaultHandler({ req, client, ctx });
      }

      return {
        status: 200,
        body: "Message received",
      };
    } catch (error) {
      console.error("Error handling message:", error);
    }
  },
});
