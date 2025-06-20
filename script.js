const discordWidgetUrl = "https://discord.com/api/guilds/1316140799280545915/widget.json";
const customApiUrl = "https://ex0-bot-production.up.railway.app/api/announcements";

const discordStatsBox = document.getElementById("discord-stats");
const announcementBox = document.getElementById("announcement-box");

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
      <p><strong>Online:</strong> ${humanCount}</p>
    `;
  })
  .catch(err => {
    console.error("Discord Widget API error:", err);
    discordStatsBox.innerHTML = `<p>❌ Fehler beim Laden der Serverdaten.</p>`;
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

  fetch("https://ex0-bot-production.up.railway.app/api/stats")
    .then(res => res.json())
    .then(data => {
      discordStatsBox.innerHTML = `
        <p><strong>Owner:</strong>
          <img src="${data.owner.avatar}" alt="Owner Avatar" width="24" style="vertical-align:middle;border-radius:50%;" />
          ${data.owner.username}#${data.owner.discriminator}
        </p>
        <p><strong>Server:</strong> ${data.name}</p>
        <p><strong>Online:</strong> ${data.onlineHumans}</p>
        <p><strong>Erstellt:</strong> ${new Date(data.createdAt).toLocaleDateString()}</p>
      `;
    })
    .catch(err => {
      console.error("❌ Fehler beim Laden der Serverstatistik:", err);
      discordStatsBox.innerHTML = `<p>❌ Fehler beim Laden der Serverstatistik.</p>`;
    });
