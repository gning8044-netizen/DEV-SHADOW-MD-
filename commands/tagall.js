const isAdmin = require('../lib/isAdmin'); // Vérifie admin
const os = require('os');

/* ⏱ Format uptime pour fun / stats */
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${days ? days + "d " : ""}${hours ? hours + "h " : ""}${minutes ? minutes + "m " : ""}${seconds}s`;
}

/* 🌟 Styliser texte */
function queenStyle(text) {
    return text.split('').join(' ');
}

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: '༆Please make DEV SHADOW TECH admin first.༆' }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: 'Only group admins can use the .tagall command.' }, { quoted: message });
            return;
        }

        // 📸 Récupérer la photo de profil du groupe
        let groupProfilePic = await sock.profilePictureUrl(chatId).catch(() => null);
        if (!groupProfilePic) {
            groupProfilePic = "https://files.catbox.moe/tyr7nj.png"; // fallback Queen AI
        }

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;

        if (!participants || participants.length === 0) {
            await sock.sendMessage(chatId, { text: 'No participants found in the group.' });
            return;
        }

        // ⏱ Bot stats pour le fun
        const uptime = formatUptime(process.uptime());
        const platform = `${os.platform()} (${os.arch()})`;

        // Créer message tag
        let messageText = `
╔─༺✿✿༻ 𝕯𝖊𝖛 𝕾𝖍𝖆𝖉𝖔𝖜 𝕿𝖊𝖈𝖍 TAGALL ༺✿✿༻─╗
│ 📢 DEV SHADOW IS BACK, @everyone!
│ 🏷 Group     : ${queenStyle(groupMetadata.subject)}
│ ⏳ Uptime    : ${uptime}
│ 💻 Platform  : ${platform}
╟─────────────────────────────╢
`;

        participants.forEach(participant => {
            messageText += `@${participant.id.split('@')[0]}\n`;
        });

        messageText += '╚─༺✿✿༻ 𝕯𝖊𝖛 𝕾𝖍𝖆𝖉𝖔𝖜 𝕿𝖊𝖈𝖍 ༺✿✿༻─╝';

        // 📸 Envoi avec image + newsletter style
        await sock.sendMessage(chatId, {
            image: { url: groupProfilePic },
            caption: messageText,
            mentions: participants.map(p => p.id),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363421176303484@newsletter',
                    newsletterName: '༺✿✿༻ DEV SHADOW TECH OFFICIAL CHANNEL ༺✿✿༻',
                    serverMessageId: Math.floor(Math.random() * 1000)
                },
                externalAdReply: {
                    title: '༺✿✿༻ DEV SHADOW TECH SYSTEM ༺✿✿༻',
                    body: "Tap to open official channel",
                    thumbnailUrl: groupProfilePic,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: "https://whatsapp.com/channel/0029VbBx6Qr3GJOpmxcy6Y1x"
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in tagall command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to tag all members.' });
    }
}

module.exports = tagAllCommand;