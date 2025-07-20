let handler = async (m, { conn, args, usedPrefix, command }) => {
  let isEnable = /true|on|enable|(turn)?on/i.test(command)
  let chat = global.db.data.chats[m.chat]

  if (!chat) chat = global.db.data.chats[m.chat] = {}

  chat.antiperunuano = isEnable

  m.reply(`🛡️ El sistema *AntiPerú* fue *${isEnable ? 'activado ✅' : 'desactivado ❌'}* correctamente.`)
}

handler.help = ['antiperunuano on', 'antiperunuano off']
handler.tags = ['group', 'antifake']
handler.command = /^((anti)?perunuano|peruano|antiperuano)\s?(on|off)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler