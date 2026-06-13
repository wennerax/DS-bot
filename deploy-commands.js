require('dotenv').config();
const { Client, GatewayIntentBits, ApplicationCommandOptionType } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

if (!token || !guildId) {
  console.error('Пожалуйста, укажите DISCORD_TOKEN и GUILD_ID в окружении.');
  process.exit(1);
}

const commands = [
  {
    name: 'say',
    description: 'Отправить сообщение от имени бота',
    options: [
      {
        name: 'message',
        description: 'Текст для отправки',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
  try {
    const guild = await client.guilds.fetch(guildId);
    await guild.commands.set(commands);
    console.log('Зарегистрированы slash-команды для гильдии', guildId);
  } catch (err) {
    console.error('Не удалось зарегистрировать команды:', err);
  } finally {
    client.destroy();
  }
});

client.login(token);