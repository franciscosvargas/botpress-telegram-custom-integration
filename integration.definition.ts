import { z, IntegrationDefinition, messages } from '@botpress/sdk'
import { integrationName } from './package.json'

export default new IntegrationDefinition({
  name: integrationName,
  version: '0.0.2',
  readme: 'hub.md',
  icon: 'icon.svg',
  actions: {
    helloWorld: {
      title: 'Hello World',
      description: 'A simple hello world action',
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
    sendTelegramChoiceMessage: {
      title: 'Send Telegram Choice Message',
      description: 'Send options to the user and process the response',
      input: {
        schema: z.object({
          text: z.string().optional(),
          options: z.array(z.string()).optional(),
        }),
      },
      output: {
        schema: z.object({
          message: z.string(),
        }),
      },
    },
  },
  configuration: {
    schema: z.object({
      botToken: z.string(),
    })
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
  }
  
})
