import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { prisma } from "../main.js";
import { buildEmbed } from "../utils/embeds.js";
import { addMetadata } from "../handlers/IssueHandler.js";

@Discord()
export class GitHubLinkCommand {
  @Slash({
    description: "Link a channel to a GitHub issue",
    guilds: ["1088775598337433662"],
    defaultMemberPermissions: "ManageMessages",
  })
  async ghlink(
    @SlashOption({
      name: "owner",
      description: "The owner of the repository",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    owner: string,
    @SlashOption({
      name: "repo",
      description: "The repository to link to",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    repo: string,
    @SlashOption({
      name: "issue",
      description: "The issue to link to",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    issue: number,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    const channel = interaction.channel;
    if (!channel) {
      await interaction.editReply("This command can only be used in a channel");
      return;
    }

    await prisma.gitHubLink.create({
      data: {
        issue,
        owner,
        repo,
        channel: channel.id,
      },
    });

    await addMetadata(
      owner,
      repo,
      issue,
      `This issue is linked to a discord ticket. Click [here](${channel.url}) to view it.`
    );

    await interaction.editReply({
      embeds: [
        buildEmbed(
          `**Issue ${issue} has been linked to this channel!**

  You will now get notifications for this issue in this channel.`,
          "GitHub Link"
        ),
      ],
    });
  }
}
