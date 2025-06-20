const statsApiUrl = "https://ex0-bot-production.up.railway.app/api/stats";
const announcementApiUrl = "https://ex0-bot-production.up.railway.app/api/announcements";

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

  // 📢 Ankündigung vom Bot (letzte Nachricht)
  fetch(announcementApiUrl)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        announcementBox.innerHTML = `<p>Keine Ankündigungen gefunden.</p>`;
        return;
      }

      const msg = data[0];

      announcementBox.innerHTML = `
          <p>
            <img src="${msg.avatar}" width="24" style="border-radius:50%;vertical-align:middle" />
            <strong>${msg.author}</strong> – 
            <em>${new Date(msg.timestamp).toLocaleString()}</em>
          </p>
          <p>${msg.content}</p>
      `;
    })
    .catch(err => {
      console.error("❌ Fehler beim Laden der Ankündigungen:", err);
      announcementBox.innerHTML = `<p>❌ Fehler beim Laden der Ankündigungen.</p>`;
    });

  // 📊 Serverstatistik
  function loadLiveStats() {
    fetch(statsApiUrl)
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
          <hr>
          <h3>🎧 Sprachkanäle</h3>
          ${data.voiceChannels.map(vc => `
            <div class="voice-channel">
              <p><strong>🔊 ${vc.name}</strong> (${vc.connected.length}/${vc.userLimit || "∞"})</p>
              ${vc.connected.length === 0 ? `<p class="vc-empty">Niemand verbunden.</p>` : `
                <div class="voice-members">
                  ${vc.connected.map(m => `
                    <div class="vc-user">
                      <img src="${m.avatar}" alt="${m.username}" title="${m.username}#${m.discriminator}" />
                      <span class="status-dot ${getStatusDotClass(m.status)}"></span>
                      <span class="vc-name">${m.username}</span>
                      ${m.muted ? '<span class="vc-flag">🔇</span>' : ''}
                      ${m.deafened ? '<span class="vc-flag">🔕</span>' : ''}
                    </div>
                  `).join("")}
                </div>
              `}
            </div>
          `).join("")}
        `;
      })
      .catch(err => {
        console.error("❌ Fehler beim Laden der Serverstatistik:", err);
        discordStatsBox.innerHTML = `<p>❌ Fehler beim Laden der Serverstatistik.</p>`;
      });
  }

  // ⏱ Initialer Call & Intervall alle 30 Sekunden
  loadLiveStats();
  setInterval(loadLiveStats, 30000);
