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

- `!say <message>` — Bot sends `<message>` to the same channel. Restricted to administrators.

Notes

- Make sure `MESSAGE CONTENT INTENT` is enabled for your bot in the Discord Developer Portal.
- Node.js >=16.9 is required for discord.js v14.

Security

- Never commit your `.env` file or bot token to version control. `.env` is included in `.gitignore`.
- Store the token in environment variables or a secrets manager (GitHub Secrets, Azure Key Vault, etc.).
- Limit bot permissions when inviting: only grant permissions the bot actually needs (send messages, manage messages if you want deletion).
- Rotate your bot token immediately if it is ever exposed.
- Do not add admin-only management commands that evaluate arbitrary input (no `eval` or remote code execution).
- Keep `discord.js` and other dependencies updated to receive security fixes.

If you want, I can add a pre-commit hook to scan for tokens or configure CI secret usage instructions.