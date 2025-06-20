const discordWidgetUrl = "https://discord.com/api/guilds/1316140799280545915/widget.json";
const customApiUrl = "ttps://ex0-bot-production.up.railway.app/api/announcements";

const discordStatsBox = document.getElementById("discord-stats");
const channelList = document.getElementById("channel-list");
const memberList = document.getElementById("member-list");
const announcementBox = document.getElementById("announcement-box");
const randomOnlineBox = document.getElementById("random-online");
const totalMembers = data.members.length;
const botCount = data.members.filter(m => m.username.toLowerCase().includes("bot")).length;
const humanCount = totalMembers - botCount;

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

// 📊 Lade Daten aus Discord Widget API
fetch(discordWidgetUrl)
  .then(res => res.json())
  .then(data => {
    // Stats
    discordStatsBox.innerHTML = `
      <p><strong>Server:</strong> ${data.name}</p>
      <p><strong>Kanäle:</strong> ${data.channels.length}</p>
      <p><strong>Online:</strong> ${data.presence_count}</p>
      <p><strong>Menschen:</strong> ${humanCount}</p>
      <p><strong>Bots:</strong> ${botCount}</p>
      <p><a href="${data.instant_invite}" target="_blank">→ Jetzt beitreten</a></p>
    `;

    // Channel List
    channelList.innerHTML = data.channels
      .sort((a, b) => a.position - b.position)
      .map(channel => `<li># ${channel.name}</li>`)
      .join("");

    // Member List
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

    // 👥 Random Online Auswahl
    const shuffled = [...data.members].sort(() => 0.5 - Math.random()).slice(0, 3);
    randomOnlineBox.innerHTML = shuffled.map(m => `
      <div class="member">
        <img src="${getAvatarURL(m)}" alt="Avatar" />
        <span>
          <span class="status-dot ${getStatusDotClass(m.status)}"></span>
          ${m.username}
        </span>
      </div>
    `).join("");

  })
  .catch(err => {
    console.error("Discord Widget API error:", err);
    discordStatsBox.innerHTML = `<p>❌ Fehler beim Laden der Serverdaten.</p>`;
    memberList.innerHTML = `<p>Keine Daten verfügbar.</p>`;
  });

  // 📢 Ankündigungen vom Bot
  fetch(customApiUrl)
    .then(res => res.json())
    .then(data => {
      console.log("Ankündigungen:", data); // 🪵 Debug-Ausgabe

      if (!data || data.length === 0) {
        announcementBox.innerHTML = `<p>Keine Ankündigungen gefunden.</p>`;
        return;
      }

      announcementBox.innerHTML = data.map(msg => `
        <div class="widget-box">
          <p><img src="${msg.avatar}" width="24" style="border-radius:50%;vertical-align:middle" />
          <strong> ${msg.author}</strong> – <em>${new Date(msg.timestamp).toLocaleString()}</em></p>
          <p>${msg.content}</p>
        </div>
      `).join("");
    })
    .catch(err => {
      console.error("❌ Fehler beim Laden der Ankündigungen:", err);
      announcementBox.innerHTML = `<p>❌ Fehler beim Laden der Ankündigungen.</p>`;
    });
