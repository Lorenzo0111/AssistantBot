import { node } from "@elysia/node";
import { Client } from "discord.js";
import { Elysia } from "elysia";

export function startServer(bot: Client) {
  new Elysia({ adapter: node() })
    .get("/health", () => {
      return {
        status: bot.isReady() ? "ok" : "not ready",
        uptime: process.uptime(),
      };
    })
    .listen(3000);
}
