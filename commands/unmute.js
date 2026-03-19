async function unmuteCommand(sock, chatId) {
    await sock.groupSettingUpdate(chatId, 'not_announcement'); // Unmute the group
    await sock.sendMessage(chatId, { text: 'Dev shadow tech has been unmuted✅.' });
}

module.exports = unmuteCommand;
