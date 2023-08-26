import { Colors, EmbedBuilder } from "discord.js";
import { guild } from "../main.js";

export function buildEmbed(
  description: string,
  footer?: string
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setDescription(description)
    .setFooter({
      text: footer || "Lorenzo0111's Assistant",
      iconURL: guild?.iconURL() || undefined,
    });
}
