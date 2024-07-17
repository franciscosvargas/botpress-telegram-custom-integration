import { ActionFunctions } from "@botpress/sdk/dist/integration/server";
import { Telegraf, Markup } from "telegraf";
// Add the type argument for ActionFunctions


export async function sendTelegramChoiceMessage(props: any) {

  const bot = new Telegraf(props.ctx.botToken);

  const message = await bot.telegram.sendMessage(
    props.conversation.tags["id"]!,
    props.input.text,
    {
      reply_markup: {
        inline_keyboard: props.options
      },
    }
  );
  
  bot.action(/.*/, (ctx) => {
    const selectedOption = ctx.match[0];
    ctx.reply(`Você selecionou: ${selectedOption}`);
    // Processar a resposta aqui, talvez enviando-a de volta ao Botpress
  });

  bot.launch();
}
