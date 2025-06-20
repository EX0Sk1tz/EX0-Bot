import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const app = express();
app.use(cors());

client.once('ready', () => {
  console.log(`✅ Bot läuft als ${client.user.tag}`);
});

// REST-API Endpoint: Gibt die letzten 5 Nachrichten aus dem Announcement-Channel
app.get('/api/announcements', async (req, res) => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    const messages = await channel.messages.fetch({ limit: 5 });

    const result = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      author: msg.author.username,
      avatar: msg.author.displayAvatarURL({ dynamic: true, size: 64 }),
      timestamp: msg.createdAt
    }));

    res.json(result);
  } catch (err) {
    console.error("Fehler beim Laden der Nachrichten:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Nachrichten" });
  }
});

const PORT = process.env.PORT || 3000;
client.login(process.env.DISCORD_TOKEN).then(() => {
  app.listen(PORT, () => {
    console.log(`🌐 API läuft auf Port ${PORT}`);
  });
});
