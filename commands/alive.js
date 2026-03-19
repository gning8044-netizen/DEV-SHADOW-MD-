const settings = require("../settings");
const os = require("os");
const axios = require("axios");

/* 🎨 Images aléatoires pour le alive */
const aliveImages = [
    "https://n.uguu.se/FapbFdJY.jpg",
    "https://h.uguu.se/gUTkAVxa.jpg",
    "https://n.uguu.se/PjJncGTk.jpg"
];

/* 🌟 Helper pour image random */
const getRandomImage = () => aliveImages[Math.floor(Math.random() * aliveImages.length)];

/* 📰 Newsletter context pour WhatsApp */
const newsletterContext = (imageUrl) => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363421176303484@newsletter',
        newsletterName: '༺『𝕯𝖊𝖛 𝕾𝖍𝖆𝖉𝖔𝖜 𝕿𝖊𝖈𝖍』༻',
        serverMessageId: Math.floor(Math.random() * 1000)
    },
    externalAdReply: {
        title: "༺✿ 𝕯𝖊𝖛 𝕾𝖍𝖆𝖉𝖔𝖜 𝕿𝖊𝖈𝖍 SYSTEM ✿༻",
        body: "Tap to view our official channel",
        thumbnailUrl: imageUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: "https://whatsapp.com/channel/0029VbBx6Qr3GJOpmxcy6Y1x"
    }
});

/* 🎬 Commande ALIVE PREMIUM - QUEEN AI */
async function aliveCommand(sock, chatId, message, botStats = {}) {
    const randomImage = getRandomImage();

    const totalGroups = botStats.totalGroups || "N/A";
    const totalUsers  = botStats.totalUsers  || "N/A";
    const uptime      = botStats.uptime     || "N/A";

    const aliveMessage = `
╔═━━━『 👑 𝕯𝖊𝖛 𝕾𝖍𝖆𝖉𝖔𝖜 𝕿𝖊𝖈𝖍 SYSTEM 』━━━═╗
┃          Version • ${settings.version} ⚙️
╚═━━──────────────────━━═╝

╭━━〔 ⚡ STATUS 〕━━╮
┃ ✅ Online
┃ 🌍 Mode   : private
┃ 🛡 Features:
┃   • 🏰 Group Management
┃   • ⚔️ Antilink Protection
┃   • 🎮 Fun Commands
┃   • ✨ And more!
╰━━━━━━━━━━━━━━╯

╭━━〔 📊 BOT STATS 〕━━╮
┃ 👥 Groups   : ${totalGroups}
┃ 🧍 Users    : ${totalUsers}
┃ ⏱ Uptime    : ${uptime}
┃ 🖥 Platform  : ${os.platform()} ${os.arch()}
╰━━━━━━━━━━━━━━╯

╭━━〔 🏰 CREÉ PAR 〕━━╮
┃ 👑 𝕯𝖊𝖛 𝕾𝖍𝖆𝖉𝖔𝖜 𝕿𝖊𝖈𝖍
┃ ⚜ Createur de bot au senegal 221🇸🇳
╰━━━━━━━━━━━━━━╯

🌐 Official Channel:
https://whatsapp.com/channel/0029VbBx6Qr3GJOpmxcy6Y1x
`;

    try {
        // 🔥 Télécharger l'image en buffer pour WhatsApp
        const response = await axios.get(randomImage, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: aliveMessage,
            mentions: [message.key?.participant || chatId],
            contextInfo: newsletterContext(randomImage)
        }, { quoted: message });

    } catch (error) {
        console.error('Error sending ALIVE message:', error);
        // Fallback texte si problème
        await sock.sendMessage(chatId, {
            text: aliveMessage,
            mentions: [message.key?.participant || chatId],
            contextInfo: newsletterContext(randomImage)
        }, { quoted: message });
    }
}

module.exports = aliveCommand;