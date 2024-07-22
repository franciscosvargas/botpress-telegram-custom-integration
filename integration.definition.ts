import { z, IntegrationDefinition, messages } from "@botpress/sdk";
import { integrationName } from "./package.json";

export default new IntegrationDefinition({
  name: integrationName,
  version: "0.0.2",
  readme: "hub.md",
  icon: "icon.svg",
  actions: {
    helloWorld: {
      title: "Hello World",
      description: "A simple hello world action",
      input: {
        schema: z.object({
          name: z.string().optional(),
        }),
      },
      output: {
        schema: z.object({
          message: z.string(),
        }),
      },
    },
    getUserInfo: {
      title: "Get User Info",
      description: "Get user info from the bot",
      input: {
        schema: z.object({}),
      },
      output: {
        schema: z.object({
          id: z.number(),
          first_name: z.string().optional(),
          last_name: z.string().optional().nullable(),
          username: z.string().optional().nullable(),
          language: z.string().optional().nullable(),
        }),
      },
    },
    createTelegramChatLink: {
      title: "Create Telegram Chat Link",
      description: "Create Telegram Chat Link",
      input: {
        schema: z.object({
          chat_id: z.number(),
          member_limit: z.number().optional().default(1),
          expire_date: z.number().optional(),
        }),
      },
      output: {
        schema: z.object({
          inviteLink: z.string(),
        }),
      },
    },
  },
  configuration: {
    schema: z.object({
      botToken: z.string(),
    }),
  },
  user: {
    tags: {
      id: {},
    },
  },
  channels: {
    group: {
      // messages: messages.defaults,  // use this to support all message types supported in Botpress Studio
      messages: messages.defaults,
      message: {
        tags: {
          id: {}, // Add this line to tag messages
        },
      },
      conversation: {
        tags: {
          id: {}, // Add this line to tag conversations
        },
      },
    },
  },
});
