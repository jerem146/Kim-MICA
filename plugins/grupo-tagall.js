const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix, groupMetadata }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '✨';
  await m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const grupo = groupMetadata?.subject || 'Grupo';
  const invocador = `@${m.sender.split('@')[0]}`;
  const total = participants.length;
  const mensaje = args.join(' ') || '¡Atención a todos!';

  let teks = `*${grupo}*\n\n`;
  teks += `🙋‍♂️ *Invocado por:* ${invocador}\n`;
  teks += `👥 *Total:* ${total} miembros\n\n`;
  teks += `📝 *Anuncio:* ${mensaje}\n\n`;
  teks += `╭  ┄ 𝅄 ۪꒰ \`⡞᪲=͟͟͞${botname} ≼᳞ׄ\` ꒱ ۟ 𝅄 ┄\n`;

  for (const mem of participants) {
    teks += `┊${customEmoji} @${mem.id.split('@')[0]}\n`;
  }

  teks += `╰⸼ ┄ ┄ ┄ ─  ꒰  ׅ୭ *${vs}* ୧ ׅ ꒱  ┄  ─ ┄ ⸼`;

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: [m.sender, ...participants.map(a => a.id)],
  });
};

handler.help = ['todos <mensaje opcional>'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;

export default handler;