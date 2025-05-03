import { default as axios } from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
} from "discord.js";
import { Platform } from "../generated/prisma";
import { logsChannel, prisma } from "../main.js";
import { buildEmbed } from "../utils/embeds.js";

export enum VerificationState {
  SUCCESS,
  AWAITING,
  FAILED,
}

export class VerificationResponse {
  state: VerificationState;
  message?: string;

  constructor(state: VerificationState, message?: string) {
    this.state = state;
    this.message = message;
  }
}

export async function runVerification(
  platform: "spigot",
  id: string,
  plugin: string,
  member: GuildMember
): Promise<VerificationResponse> {
  let response: VerificationResponse;

  const previous = await prisma.verificationRequest.findFirst({
    where: {
      user: member.id,
      platform: Platform.SPIGOT,
      plugin: plugin,
    },
  });

  if (previous) {
    return new VerificationResponse(
      VerificationState.FAILED,
      "You already have a verification request for this plugin. Please wait until it gets approved or denied."
    );
  }

  switch (platform) {
    case "spigot":
      response = await verifySpigot(id, plugin, member);
  }

  switch (response.state) {
    case VerificationState.SUCCESS:
      await member.roles.add("1088777689273471056"); // Client
      await member.roles.add("1088777691446120499"); // Vehicles
      break;
    case VerificationState.AWAITING:
      const message = await logsChannel.send({
        content: "<@724537501058072576>",
        embeds: [
          buildEmbed(
            "A new verification request has been submitted",
            "Verification"
          )
            .setTitle("New verification request")
            .setFields([
              {
                name: "User",
                value: member.toString(),
              },
              {
                name: "Platform",
                value: platform,
              },
              {
                name: "User Profile",
                value: `https://spigotmc.org/members/${id}`,
              },
              {
                name: "Plugin",
                value: plugin,
              },
            ]),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("verify_accept")
              .setLabel("Accept")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("verify_deny")
              .setLabel("Deny")
              .setStyle(ButtonStyle.Danger)
          ),
        ],
      });

      await prisma.verificationRequest.create({
        data: {
          message: message.id,
          user: member.id,
          platform: Platform.SPIGOT,
          plugin: plugin,
          platformId: id,
        },
      });
      break;
  }

  return response;
}

async function verifySpigot(
  id: string,
  plugin: string,
  member: GuildMember
): Promise<VerificationResponse> {
  try {
    const { data } = await axios.get(
      "https://api.spigotmc.org/simple/0.2/index.php?action=getAuthor&id=" +
        id +
        "&cb=" +
        Date.now()
    );
    if (!data.id) {
      return new VerificationResponse(
        VerificationState.FAILED,
        "Please insert your spigot id. You can find it in your spigot profile page: https://i.imgur.com/ctPXhqw.png"
      );
    }

    if (
      !data.identities.discord ||
      (member.id != data.identities.discord &&
        member.user.tag != data.identities.discord &&
        member.user.username != data.identities.discord)
    ) {
      return new VerificationResponse(
        VerificationState.FAILED,
        "Your SpigotMC account is not linked to your discord account. Please link it by setting your discord identity to " +
          member.user.username +
          ".\nYou can do that by editing the field here: https://www.spigotmc.org/account/contact-details\n**Discord field:** " +
          data.identities.discord
      );
    }

    return new VerificationResponse(VerificationState.AWAITING);
  } catch {
    return new VerificationResponse(
      VerificationState.FAILED,
      "An error has occurred while verifying your account. Please make sure you are using your spigot id. You can find it in your spigot profile page: https://i.imgur.com/ctPXhqw.png"
    );
  }
}
