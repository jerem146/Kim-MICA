let handler = async (m, { conn }) => {
  const chat = global.db.data.chats[m.id] || {}
  if (!chat.antiperunuano) return

  if (!m.action || m.action !== 'add') return
  if (!m.participants || !Array.isArray(m.participants)) return

  for (let user of m.participants) {
    if (user.startsWith('51') && m.id.endsWith('@g.us')) {
      try {
        await conn.groupParticipantsUpdate(m.id, [user], 'remove')
        await conn.sendMessage(m.id, {
          text: `🚫 *Usuario @${user.split('@')[0]} eliminado automáticamente por tener número peruano.*`,
          mentions: [user]
        })
      } catch (e) {
        console.error(`Error eliminando a ${user}:`, e)
      }
    }
  }
}

handler.group = true
handler.event = 'group-participants.update'
export default handler