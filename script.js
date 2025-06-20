const discordWidgetUrl = "https://discord.com/api/guilds/1316140799280545915/widget.json";

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

fetch(discordWidgetUrl)
  .then(res => res.json())
  .then(data => {
    // STATS
    discordStatsBox.innerHTML = `
      <p><strong>Server Name:</strong> ${data.name}</p>
      <p><strong>Total Channels:</strong> ${data.channels.length}</p>
      <p><strong>Online Members:</strong> ${data.presence_count}</p>
      <p><a href="${data.instant_invite}" target="_blank">Join Server →</a></p>
    `;

    // CHANNELS
    channelList.innerHTML = data.channels
      .sort((a, b) => a.position - b.position)
      .map(channel => `<li># ${channel.name}</li>`)
      .join("");

    // MEMBERS
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

// Static Announcement
announcementBox.innerHTML = `
  <p><strong>14/01/2025</strong> 🎉 <em>EX0Sk1tz is Officially Live!</em></p>
  <p>We're thrilled to announce the launch of our new Discord community! Expect exclusive content, a growing squad, and all things gaming.</p>
  <p><a href="https://discord.gg/y76kqnzkBb" target="_blank">Join Now</a></p>
`;
