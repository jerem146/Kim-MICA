/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
const handler = async (m, { isOwner, isAdmin, conn, args, participants, usedPrefix }) => {
  if (usedPrefix === 'a' || usedPrefix === 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const mensaje = args.join(' ') || '¡Has sido invocado por los dioses del grupo!';
  const textoExtra = `╰⸼ ┄ ┄ ┄ ─ ꒰ ୭ *${global.vs || 'Versión'}* ୧ ꒱ ┄ ─ ┄ ⸼`;

  const mentions = participants.map(p => p.id);
  let etiquetas = '';
  for (const u of participants) {
    etiquetas += `@${u.id.split('@')[0]} `;
  }

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/5nmy7i.jpg' },
    caption: `*「 CORTANA 2.0 TE HA INVOCADO 」*\n\n${mensaje}\n\n${etiquetas}\n\n${textoExtra}`,
    mentions
  });
};

handler.help = ['invocar *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['invocar', 'todos', 'tagall'];
handler.admin = true;
handler.group = true;

export default handler;