import "@std/dotenv/load";
import {
  Client,
  Context,
  deserializeInlineMessageId,
  InlineQueryResultArticle,
  StorageLocalStorage,
} from "@mtkruto/mtkruto";
import translations from "./translations.ts";

const client = new Client({
  storage: new StorageLocalStorage("msgl"),
  apiId: +(Deno.env.get("API_ID") + ""),
  apiHash: Deno.env.get("API_HASH") + "",
});

await client.start({
  botToken: Deno.env.get("BOT_TOKEN") + "",
});

const LIMIT = 1_000_000;

client.use(async (_ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error handling update:", err);
  }
});

client.on("inlineQuery", async (ctx) => {
  const id = crypto.randomUUID();
  const results = Object.entries(translations)
    .map(([k, v]): InlineQueryResultArticle => ({
      type: "article",
      id: id + "_" + k,
      title: v.name,
      messageContent: { type: "text", text: v.initialMessageText },
      replyMarkup: {
        inlineKeyboard: [[{ text: v.buttonText, callbackData: k }]],
      },
    }));
  await ctx.answerInlineQuery(results, { cacheTime: 0 });
});

client.on("chosenInlineResult:inlineMessageId", async (ctx) => {
  const lang = ctx.chosenInlineResult.resultId.split(
    "_",
  )[1] as keyof typeof translations;
  if (!(lang in translations)) {
    return;
  }
  await shared(lang, ctx.chosenInlineResult.inlineMessageId, ctx);
});

client
  .on("callbackQuery:data")
  .on("callbackQuery:inlineMessageId", async (ctx) => {
    const lang = ctx.callbackQuery.data as keyof typeof translations;
    if (!(lang in translations)) {
      return;
    }
    await shared(lang, ctx.callbackQuery.inlineMessageId, ctx);
  });

async function shared(
  lang: keyof typeof translations,
  inlineMessageId: string,
  ctx: Context,
) {
  const { id } = await deserializeInlineMessageId(inlineMessageId);
  const lastMessageId = Number(BigInt(id) & 0xFFFFFFFFn);
  const status = LIMIT - lastMessageId;
  const percentage = Number(((lastMessageId / LIMIT) * 100).toFixed(2));
  let text: string;
  if (status < 0) {
    text = translations[lang].disappeared(Math.abs(status), percentage);
  } else {
    text = translations[lang].remaining(Math.abs(status), percentage);
  }
  await ctx.editInlineMessageText(text);
}
