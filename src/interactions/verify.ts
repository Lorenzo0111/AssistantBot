import { ButtonInteraction, MessageFlags } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { prisma } from "../main.js";
import { buildEmbed } from "../utils/embeds.js";

@Discord()
export class VerifyInteractions {
  @ButtonComponent({ id: "verify_accept" })
  async verifyAccept(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const request = await prisma.verificationRequest.findUnique({
      where: {
        message: interaction.message.id,
      },
    });

    if (!request) {
      await interaction.editReply({
        content: "This verification request no longer exists.",
      });
      return;
    }

    await prisma.verificationRequest.delete({
      where: {
        id: request.id,
      },
    });

    const member = await interaction.guild!.members.fetch(request.user);
    await member.roles.add("1088777689273471056"); // Client
    await member.roles.add("1088777691446120499"); // Vehicles

    await interaction.editReply({
      content: "Successfully verified user.",
    });

    await interaction.message.delete();

    member
      .send({
        embeds: [
          buildEmbed(
            `You have been successfully verified as a buyer for the ${request.plugin} plugin.`,
            "Verification"
          ),
        ],
      })
      .catch(() => {});
  }

  @ButtonComponent({ id: "verify_deny" })
  async verifyDeny(interaction: ButtonInteraction) {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const request = await prisma.verificationRequest.findUnique({
      where: {
        message: interaction.message.id,
      },
    });

    if (!request) {
      await interaction.editReply({
        content: "This verification request no longer exists.",
      });
      return;
    }

    await prisma.verificationRequest.delete({
      where: {
        id: request.id,
      },
    });

    const member = await interaction.guild!.members.fetch(request.user);

    await interaction.editReply({
      content: "Successfully denied user.",
    });

    await interaction.message.delete();

    member
      .send({
        embeds: [
          buildEmbed(
            `Your verification request for the ${request.plugin} plugin has been denied.\nIf you believe this is an error please contact a staff member.`,
            "Verification"
          ),
        ],
      })
      .catch(() => {});
  }
}
