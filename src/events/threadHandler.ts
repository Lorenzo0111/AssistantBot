import { ArgsOf, Discord, On } from "discordx";
import { buildEmbed } from "../utils/embeds.js";
import { ForumChannel } from "discord.js";
import { archiveThread } from "../handlers/ThreadHandler.js";

@Discord()
export class ThreadHandler {
  @On({ event: "threadCreate" })
  async onTreadCreate([thread, isNew]: ArgsOf<"threadCreate">) {
    if (!isNew || thread.parentId !== "1088777759389667348") return;

    await thread.join();
    thread.send(`<@&1089171997914824804>`).then((msg) => msg.delete());

    thread.send({
      embeds: [
        buildEmbed(
          `**Welcome <@${thread.ownerId}> in the support center!**
                    
                    We are happy to have you here. While you are waiting for a support member, please give us some additional information for a better understanding of your issue.
                    Here are some questions you can answer:
- What server version are you running? (Provide the output of \`/version\`)
- What plugins are you using?
- Share your server logs (Use a service like [Pastebin](https://pastebin.com/))
Also please **never ping** the support team during the support process, we will reply as soon as possible.`,
          "Support Center"
        ),
      ],
    });
  }

  @On({ event: "guildMemberRemove" })
  async onLeave([member]: ArgsOf<"guildMemberRemove">) {
    const guild = member.guild;
    const forum = guild.channels.cache.get(
      "1088777759389667348"
    ) as ForumChannel;

    if (!forum) return;

    const threads = await forum.threads.fetchActive();
    threads.threads
      .filter((thread) => thread.ownerId === member.id)
      .forEach(async (thread) => {
        await archiveThread(thread, "User left the server");
      });
  }
}
