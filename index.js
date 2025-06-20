import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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
app.use(morgan('combined'));

client.once('ready', () => {
  console.log(`✅ Bot läuft als ${client.user.tag}`);
});

app.get('/api/announcements', async (req, res) => {
  try {
    console.log(`[API] GET /api/announcements from ${req.ip}`);
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
    console.error("❌ Fehler beim Abrufen der Nachrichten:", err);
    res.status(500).json({ error: "Interner Fehler beim Lesen der Nachrichten" });
  }
});

const PORT = process.env.PORT || 3000;
client.login(process.env.DISCORD_TOKEN).then(() => {
  app.listen(PORT, () => {
    console.log(`🌐 API läuft auf Port ${PORT}`);
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    await guild.members.fetch(); // Alle Member laden

    const allMembers = guild.members.cache;
    const humans = allMembers.filter(m => !m.user.bot);
    const onlineHumans = humans.filter(m => m.presence && m.presence.status !== 'offline');

    const owner = await guild.fetchOwner();

    res.json({
      name: guild.name,
      owner: {
        username: owner.user.username,
        discriminator: owner.user.discriminator,
        avatar: owner.user.displayAvatarURL({ dynamic: true, size: 64 })
      },
      createdAt: guild.createdAt,
      totalMembers: allMembers.size,
      onlineHumans: onlineHumans.size
    });

  } catch (err) {
    console.error("❌ Fehler bei /api/stats:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Serverstatistik" });
  }
});
