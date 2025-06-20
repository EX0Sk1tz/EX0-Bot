const discordWidgetUrl = "https://discord.com/api/guilds/1316140799280545915/widget.json";
const customApiUrl = "https://ex0-bot-production.up.railway.app/api/announcements";
const humanApiUrl = "https://ex0-bot-production.up.railway.app/api/humans";

const discordStatsBox = document.getElementById("discord-stats");
const announcementBox = document.getElementById("announcement-box");
const randomOnlineBox = document.getElementById("random-online");

function getStatusDotClass(status) {
  switch (status) {
    case "online": return "status-online";
    case "idle": return "status-idle";
    case "dnd": return "status-dnd";
    default: return "status-offline";
  }
}

// 📊 Widget.json: Server-Infos (Statistiken)
fetch(discordWidgetUrl)
  .then(res => res.json())
  .then(data => {
    const totalMembers = data.members.length;
    const botCount = data.members.filter(m => m.username.toLowerCase().includes("bot")).length;
    const humanCount = totalMembers - botCount;

    discordStatsBox.innerHTML = `
      <p><strong>Server:</strong> ${data.name}</p>
      <p><strong>Online (geschätzt):</strong> ${humanCount}</p>
    `;
  })
  .catch(err => {
    console.error("Discord Widget API error:", err);
    discordStatsBox.innerHTML = `<p>❌ Fehler beim Laden der Serverdaten.</p>`;
  });

// 👥 Zeige echte Nutzer (via Bot API /api/humans)
fetch(humanApiUrl)
  .then(res => res.json())
  .then(users => {
    if (!users || users.length === 0) {
      randomOnlineBox.innerHTML = `<p>Keine echten Nutzer online.</p>`;
      return;
    }

    const shuffled = users.sort(() => 0.5 - Math.random()).slice(0, 3);

    randomOnlineBox.innerHTML = shuffled.map(m => `
      <div class="member">
        <img src="${m.avatar}" alt="Avatar" />
        <span>
          <span class="status-dot ${getStatusDotClass(m.status)}"></span>
          ${m.username}
        </span>
      </div>
    `).join("");
  })
  .catch(err => {
    console.error("❌ Fehler beim Laden der echten Nutzer:", err);
    randomOnlineBox.innerHTML = `<p>❌ Fehler beim Laden der Online-Nutzer.</p>`;
  });

// 📢 Ankündigung vom Bot (letzte Nachricht)
fetch(customApiUrl)
  .then(res => res.json())
  .then(data => {
    if (!data || data.length === 0) {
      announcementBox.innerHTML = `<p>Keine Ankündigungen gefunden.</p>`;
      return;
    }

    const msg = data[0];

    announcementBox.innerHTML = `
      <div class="widget-box">
        <p>
          <img src="${msg.avatar}" width="24" style="border-radius:50%;vertical-align:middle" />
          <strong>${msg.author}</strong> – 
          <em>${new Date(msg.timestamp).toLocaleString()}</em>
        </p>
        <p>${msg.content}</p>
      </div>
    `;
  })
  .catch(err => {
    console.error("❌ Fehler beim Laden der Ankündigungen:", err);
    announcementBox.innerHTML = `<p>❌ Fehler beim Laden der Ankündigungen.</p>`;
  });
