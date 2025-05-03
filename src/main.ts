import { dirname, importx } from "@discordx/importer";
import { PrismaClient } from "@prisma/client";
import type { Guild, Interaction, Message, TextChannel } from "discord.js";
import { ActivityType, IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { config } from "dotenv";

config();

export const prisma = new PrismaClient();
export let logsChannel: TextChannel;
export let guild: Guild;
export const bot = new Client({
  botId: "assistant",

  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
  ],

  silent: process.env.ENVIRONMENT === "production",

  simpleCommand: {
    prefix: "!",
  },

  presence: {
    activities: [
      {
        name: "with Lorenzo",
        type: ActivityType.Playing,
      },
    ],
  },
});

bot.once("ready", async () => {
  await bot.initApplicationCommands();
  console.log("Bot started");
  logsChannel = (await bot.channels.fetch(
    "1088777815777882123"
  )) as TextChannel;
  guild = (await bot.guilds.fetch("1088775598337433662")) as Guild;
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  await importx(
    `${dirname(import.meta.url)}/{events,commands,interactions}/**/*.{ts,js}`
  );

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await bot.login(process.env.BOT_TOKEN);
}

run();
