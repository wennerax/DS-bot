# NexisWorld Discord Bot

Simple Node.js Discord bot that allows any server user to make the bot send a message using a chat command.

Usage

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with your bot token (see `.env.example`).

3. Start the bot:

```bash
npm start
```

Commands

- `!say <message>` — Bot sends `<message>` to the same channel. Open to any user on the server.

Notes

- Make sure `MESSAGE CONTENT INTENT` is enabled for your bot in the Discord Developer Portal.
- Node.js >=16.9 is required for discord.js v14.
# DS-bot