import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  GuildMember,
  MessageFlags,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { ArgsOf, ButtonComponent, Discord, On } from "discordx";
import { bot } from "../main.js";
import { buildEmbed } from "../utils/embeds.js";

@Discord()
export class ShowcaseHandler {
  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">) {
    if (message.author.bot) return;
    if (message.channelId !== "1297107788413272095") return;

    await message.react("✨");
    await message.startThread({
      name: `${message.author.username}'s Showcase Comments`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      reason: "Showcase comments",
    });

    const messages = await message.channel.messages.fetch({ limit: 10 });
    const botMessage = messages.find((m) => m.author.id === bot.user?.id);
    if (botMessage && botMessage.embeds.length > 0) botMessage.delete();

    await message.channel.send({
      embeds: [
        buildEmbed(
          `Welcome in the **showcase channel**!
Here you can show to the community your amazing creations made with our plugins.

Please respect our server and channel rules or you permissions to write here will be revoked:
- Do not use this channel for support
- If you want to comment a post, use its thread

If you are ready to start, click the button below to get the **write permission**.`,
          "Showcase Channel"
        ).setTitle("✨  Showcase Channel"),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("showcase_role")
            .setEmoji("✨")
            .setLabel("Accept rules")
            .setStyle(ButtonStyle.Success)
        ),
      ],
    });
  }

  @ButtonComponent({ id: "showcase_role" })
  async onShowcaseRoleButton(interaction: ButtonInteraction) {
    if (!(interaction.member instanceof GuildMember)) return;

    if (interaction.member.roles.cache.has("1297106420457541704")) {
      await interaction.reply({
        content:
          "You are banned from the showcase channel. If you think this is a mistake, please contact the staff.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    await interaction.member.roles.add(
      "1297106124327223338", // Showcase Access
      "Showcase access"
    );
    await interaction.reply({
      content: "You now have the permission to write in the showcase channel!",
      flags: [MessageFlags.Ephemeral],
    });
  }
}
