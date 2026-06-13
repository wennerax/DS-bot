require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`Вошёл как ${client.user.tag}`);
});

// Keep the old text-based command (prefix `!`) as a fallback
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'say' || command === 's') {
    const text = args.join(' ');
    if (!text) return message.reply('Пожалуйста, укажите сообщение для отправки.');
    try {
      // Try to delete the user's invoking message immediately (requires Manage Messages permission)
      message.delete().catch(() => {});
      await message.channel.send(text);
    } catch (err) {
      console.error('Не удалось отправить сообщение:', err);
      message.reply('Не удалось отправить сообщение.');
    }
  }
});

// Slash command handling
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'say') {
    const text = interaction.options.getString('message');
    if (!text) return interaction.reply({ content: 'Укажите сообщение.', ephemeral: true });

    try {
      // Send the message as the bot immediately
      await interaction.channel.send(text);
      // Reply to the interaction only with an ephemeral confirmation (so nothing public remains)
      await interaction.reply({ content: 'Сообщение отправлено.', ephemeral: true });
    } catch (err) {
      console.error('Ошибка при отправке через слэш-команду:', err);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content: 'Не удалось отправить сообщение.' });
      } else {
        await interaction.reply({ content: 'Не удалось отправить сообщение.', ephemeral: true });
      }
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Отсутствует DISCORD_TOKEN в окружении. Посмотрите в .env.example');
  process.exit(1);
}

client.login(token);