import {
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember,
} from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import {
  VerificationState,
  runVerification,
} from "../handlers/VerificationHandler.js";
import { buildEmbed } from "../utils/embeds.js";

@Discord()
export class VerifyCommands {
  @Slash({
    description: "Verify your purchase",
    guilds: ["1088775598337433662"],
  })
  async verify(
    @SlashChoice({ name: "Spigot", value: "spigot" })
    @SlashOption({
      name: "platform",
      description: "The platform you purchased on",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    platform: "spigot",
    @SlashOption({
      name: "id",
      description: "Your id or username depending on the platform",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    id: string,
    @SlashChoice({
      name: "QualityArmoryVehicles",
      value: "qualityarmoryvehicles",
    })
    @SlashOption({
      name: "plugin",
      description: "The plugin you want to verify the purchase for",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    plugin: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });
    const response = await runVerification(
      platform,
      id,
      plugin,
      interaction.member as GuildMember
    );
    switch (response.state) {
      case VerificationState.SUCCESS:
        await interaction.editReply({
          embeds: [
            buildEmbed(
              "Your verification request has been approved successfully.",
              "Verification"
            ),
          ],
        });
        break;
      case VerificationState.AWAITING:
        await interaction.editReply({
          embeds: [
            buildEmbed(
              "Your verification request has been submitted.\nRemember it can take up to 24 hours.",
              "Verification"
            ),
          ],
        });
        break;
      case VerificationState.FAILED:
        await interaction.editReply({
          embeds: [
            buildEmbed(
              response.message || "Your verification request has been denied.",
              "Verification"
            ),
          ],
        });
        break;
    }
  }
}
