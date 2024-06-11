import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { archiveThread } from "../handlers/ThreadHandler.js";

@Discord()
export class CloseCommand {
  @Slash({
    description: "Close a thread",
    guilds: ["1088775598337433662"],
    defaultMemberPermissions: "ManageMessages",
  })
  async close(
    @SlashOption({
      name: "reason",
      description: "Reason for closing the thread",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });
    if (await archiveThread(interaction.channel!, reason))
      await interaction.editReply("Thread archived successfully");
    else
      await interaction.editReply(
        "Thread could not be archived. Is it part of a forum?"
      );
  }
}
