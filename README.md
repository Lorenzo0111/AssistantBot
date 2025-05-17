# ![Lorenzo's Assistant](media/banner.png)

<div align="center">

[![GitHub License](https://img.shields.io/github/license/Lorenzo0111/AssistantBot)](LICENSE)
[![Discord](https://img.shields.io/discord/1088775598337433662)](https://discord.gg/HT47UQXBqG)

</div>


A powerful Discord bot for community management, plugin purchase verification, GitHub integration, and support automation.

## ✨ Features

- **Purchase Verification System**

  - Users can verify their plugin purchases via the `/verify` command.
  - The bot checks the user's Spigot account and Discord identity, and assigns roles upon successful verification.
  - Staff can approve or deny requests via interactive buttons.

- **GitHub Issue Channel Linking**

  - Staff can link a Discord channel to a specific GitHub issue using the `/ghlink` command.
  - The bot posts updates in the channel when the issue receives new comments or is closed.

- **Thread Management for Support**

  - When a new thread is created in the support forum, the bot welcomes the user and provides instructions for effective support.
  - If a user leaves the server, any open support threads they own are automatically archived.
  - Staff can close threads with the `/close` command, optionally providing a reason.

- **Showcase Channel Automation**

  - In the showcase channel, the bot reacts to new messages, starts a thread for comments, and posts channel rules.
  - Users must accept the rules via a button to gain write access.
  - Users banned from the showcase channel are prevented from regaining access.

- **Automated GitHub Issue Monitoring**
  - The bot periodically checks all linked GitHub issues and posts updates or closure notifications in the appropriate channels.

## 🏗 Development

```sh
pnpm install
pnpm run dev
```

For auto-reload during development:

```sh
pnpm run watch
```

## 💻 Production

```sh
pnpm install --production
pnpm run build
pnpm run start
```

## 🐋 Docker

To start your application:

```sh
docker-compose up -d
```

To shut down your application:

```sh
docker-compose down
```

To view your application's logs:

```sh
docker-compose logs
```
