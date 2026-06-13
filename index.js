require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

// Security: read token early and avoid accidental leakage in logs
const TOKEN = process.env.DISCORD_TOKEN;

function redactToken(value) {
  if (!value || !TOKEN) return value;
  try {
    return String(value).split(TOKEN).join('[REDACTED_DISCORD_TOKEN]');
  } catch {
    return value;
  }
}

const _origLog = console.log.bind(console);
const _origError = console.error.bind(console);
console.log = (...args) => _origLog(...args.map(redactToken));
console.error = (...args) => _origError(...args.map(redactToken));

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // attempt graceful shutdown
  try { if (global.botClient) global.botClient.destroy?.(); } catch {}
  setTimeout(() => process.exit(1), 1000);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  try { if (global.botClient) global.botClient.destroy?.(); } catch {}
  setTimeout(() => process.exit(1), 1000);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// make client available to global handlers for graceful shutdown
global.botClient = client;

const PREFIX = '/';

client.once('clientReady', () => {
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
    // Allow only server administrators
    if (!message.member || !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('У вас нет прав для использования этой команды. Только администраторы.').then(m => setTimeout(() => m.delete().catch(() => {}), 5000)).catch(() => {});
    }
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

    // Allow only server administrators
    if (!interaction.memberPermissions || !interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'У вас нет прав для использования этой команды. Только администраторы.', ephemeral: true });
    }

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

const token = TOKEN;
if (!token) {
  console.error('Отсутствует DISCORD_TOKEN в окружении. Посмотрите в .env.example');
  process.exit(1);
}

// Do not log the token or attach it anywhere; use the TOKEN variable only for login
client.login(token).catch(err => {
  console.error('Failed to login:', err);
  process.exit(1);
});