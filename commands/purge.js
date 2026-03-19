const isAdmin = require('../lib/isAdmin');

/**
 * Purge command - removes all non-admin members from the group
 */
async function purgeCommand(sock, chatId, message) {
    // Seul le deployeur du bot peut utiliser purge
    const isBotOwner = message.key.fromMe;
    if (!isBotOwner) {
        await sock.sendMessage(chatId, { text: "🚫 Only the bot owner can use this command." }, { quoted: message });
        return;
    }

    try {
        // Récupère les infos du groupe
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants || [];

        // ID du bot pour ne pas se kicker
        const botId = sock.user.id;

        // Liste de tous les membres non-admin et non-bot
        const membersToRemove = participants
            .filter(p => !p.admin && p.id !== botId)
            .map(p => p.id);

        if (!membersToRemove.length) {
            await sock.sendMessage(chatId, { text: "✅ No members to remove, only admins and bot present." }, { quoted: message });
            return;
        }

        // Suppression un par un avec pause
        for (const memberId of membersToRemove) {
            await sock.groupParticipantsUpdate(chatId, [memberId], "remove");
            await new Promise(r => setTimeout(r, 1000)); // pause 1s
        }

        // Mentions des membres supprimés
        const mentions = membersToRemove;
        const usernames = membersToRemove.map(id => `@${id.split('@')[0]}`);

        await sock.sendMessage(chatId, {
            text: `🚷 ${usernames.join(', ')} DEV SHADOW TECH PURGE.`,
            mentions
        });

    } catch (error) {
        console.error('❌ Error during purge:', error);
        await sock.sendMessage(chatId, { text: "⚠️ Failed to purge members." }, { quoted: message });
    }
}

module.exports = purgeCommand;