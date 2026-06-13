require('dotenv').config();
const { Client, GatewayIntentBits, ApplicationCommandOptionType } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

if (!token || !guildId) {
  console.error('Please set DISCORD_TOKEN and GUILD_ID in your environment.');
  process.exit(1);
}

const commands = [
  {
    name: 'say',
    description: 'Send a message as the bot',
    options: [
      {
        name: 'message',
        description: 'Text to send',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(guildId);
    await guild.commands.set(commands);
    console.log('Registered slash commands for guild', guildId);
  } catch (err) {
    console.error('Failed to register commands:', err);
  } finally {
    client.destroy();
  }
});

client.login(token);
