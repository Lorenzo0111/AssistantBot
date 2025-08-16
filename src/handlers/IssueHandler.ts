import { bot, github, prisma } from "../main.js";
import { buildEmbed } from "../utils/embeds.js";

export async function getIssue(
  owner: string,
  repo: string,
  id: number,
  updatedAt?: Date
) {
  const issue = await github.rest.issues.get({
    owner,
    repo,
    issue_number: id,
  });

  if (issue.status !== 200) return { error: "Issue not found" };

  const comments = await github.rest.issues.listComments({
    owner,
    repo,
    issue_number: id,
    since: updatedAt?.toISOString(),
  });

  return {
    issue: issue.data,
    comments: comments.data,
  };
}

export async function checkNow() {
  const links = await prisma.gitHubLink.findMany();

  for (const link of links) {
    const { error, issue, comments } = await getIssue(
      link.owner,
      link.repo,
      link.issue,
      link.updatedAt
    );

    if (error || !issue) continue;

    const channel = await bot.channels.fetch(link.channel);
    if (!channel || !channel.isSendable()) continue;

    if (issue.closed_at !== null) {
      const embed = buildEmbed(
        `The issue [#${issue.number}](${issue.html_url}) has been closed by ${issue.closed_by?.login}`,
        "GitHub Link"
      );

      await channel.send({ embeds: [embed] });

      await prisma.gitHubLink.delete({
        where: { id: link.id },
      });

      continue;
    }

    const lastComment = comments[comments.length - 1];
    if (!lastComment) continue;

    const embed = buildEmbed(
      `The issue [#${issue.number}](${issue.html_url}) has been updated by ${lastComment.user?.login ?? "Unknown"}
      
${(lastComment.body ?? "")
  .split("\n")
  .map((line) => `> ${line}`)
  .join("\n")}`,
      "GitHub Link"
    );

    await channel.send({ embeds: [embed] });

    await prisma.gitHubLink.update({
      where: { id: link.id },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}

export function startChecker() {
  setInterval(checkNow, 5 * 60 * 1000);
}

export async function addMetadata(
  owner: string,
  repo: string,
  number: number,
  metadata: string
) {
  const issue = await github.rest.issues.get({
    owner,
    repo,
    issue_number: number,
  });

  if (issue.status !== 200) return { error: "Issue not found" };

  const response = await github.rest.issues.update({
    owner,
    repo,
    issue_number: number,
    body: issue.data.body + `\n\n${metadata}`,
    labels: [
      ...issue.data.labels
        .map((label) => {
          if (typeof label === "string") return label;
          return label.name;
        })
        .filter((label) => label !== undefined),
      {
        name: "source: discord",
        color: "#5965F2",
      },
    ],
  });

  return response.data;
}
