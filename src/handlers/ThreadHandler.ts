import { Channel, ChannelType } from "discord.js";
import { buildEmbed } from "../utils/embeds.js";

export async function archiveThread(
  channel: Channel,
  reason: string
): Promise<boolean> {
  if (!channel?.isThread() || channel.parent?.type !== ChannelType.GuildForum)
    return false;

  await channel.send({
    embeds: [
      buildEmbed(
        `**This thread has been archived!**
  
  We hope you have had a great experience with our support. The ticket has been closed for the following reason:
  \`\`\`${reason || "No reason provided"}\`\`\`
If you have any further questions, feel free to open a new thread`,
        "Support Center"
      ),
    ],
  });

  await channel.setArchived(true, reason || "Thread closed");
  return true;
}
