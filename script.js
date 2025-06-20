// 💬 Live Widget API + 📢 Bot-API Announcement Integration

const discordWidgetUrl = "https://discord.com/api/guilds/1316140799280545915/widget.json";
const customApiUrl = "https://ex0-bot-production.up.railway.app/api/announcements";

const discordStatsBox = document.getElementById("discord-stats");
const channelList = document.getElementById("channel-list");
const memberList = document.getElementById("member-list");
const announcementBox = document.getElementById("announcement-box");

function getStatusDotClass(status) {
  switch (status) {
    case "online": return "status-online";
    case "idle": return "status-idle";
    case "dnd": return "status-dnd";
    default: return "status-offline";
  }
}

function getAvatarURL(user) {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
  const fallbackIndex = parseInt(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
}

// 👉 1. Discord Widget API (Mitglieder, Channels, Präsenz)
fetch(discordWidgetUrl)
  .then(res => res.json())
  .then(data => {
    // Stats
    discordStatsBox.innerHTML = `
      <p><strong>Server Name:</strong> ${data.name}</p>
      <p><strong>Total Channels:</strong> ${data.channels.length}</p>
      <p><strong>Online Members:</strong> ${data.presence_count}</p>
      <p><a href="${data.instant_invite}" target="_blank">Join Server →</a></p>
    `;

    // Channel-Liste
    channelList.innerHTML = data.channels
      .sort((a, b) => a.position - b.position)
      .map(channel => `<li># ${channel.name}</li>`)
      .join("");

    // Online-Mitglieder
    memberList.innerHTML = data.members
      .sort((a, b) => a.username.localeCompare(b.username))
      .map(member => `
        <div class="member">
          <img src="${getAvatarURL(member)}" alt="Avatar" />
          <span>
            <span class="status-dot ${getStatusDotClass(member.status)}"></span>
            ${member.username}#${member.discriminator}
          </span>
        </div>
      `).join("");
  })
  .catch(err => {
    console.error("Discord Widget API error:", err);
    discordStatsBox.innerHTML = `<p>❌ Could not load Discord data.</p>`;
    channelList.innerHTML = `<li>Unavailable</li>`;
    memberList.innerHTML = `<p>Unavailable</p>`;
  });

// 👉 2. Eigene Bot-API (Ankündigungen)
fetch(customApiUrl)
  .then(res => res.json())
  .then(messages => {
    if (!Array.isArray(messages)) throw new Error("Unexpected data");

    announcementBox.innerHTML = messages.map(msg => `
      <div class="announcement" style="margin-bottom:1rem;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${msg.avatar}" width="32" height="32" style="border-radius:50%;" />
          <strong>${msg.author}</strong>
          <small style="color:gray;">${new Date(msg.timestamp).toLocaleString()}</small>
        </div>
        <p style="margin-top: 0.5rem;">${msg.content}</p>
      </div>
    `).join("");
  })
  .catch(err => {
    console.error("Bot API error:", err);
    announcementBox.innerHTML = `<p>⚠️ Could not load announcements</p>`;
  });
