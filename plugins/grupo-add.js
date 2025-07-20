let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let user

  // 🎯 Obtener usuario desde mensaje citado o número
  if (m.quoted) {
    user = m.quoted.sender
  } else if (text) {
    if (text.includes('+')) return conn.reply(m.chat, `${emoji2} Ingrese el número todo junto sin el *+*`, m)
    if (isNaN(text)) return conn.reply(m.chat, `${emoji2} Ingrese sólo números sin símbolos ni espacios.`, m)
    user = text + '@s.whatsapp.net'
  } else {
    return conn.reply(m.chat, `${emoji} Por favor, responda un mensaje o escriba el número al que quiere invitar.`, m)
  }

  let group = m.chat
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

  // 🎯 Verificar si ya está en el grupo
  const groupMetadata = await conn.groupMetadata(group)
  const participants = groupMetadata.participants.map(p => p.id)
  const isInGroup = participants.includes(user)

  if (isInGroup) {
    return conn.reply(m.chat, `${emoji2} El usuario ya está en el grupo.`, m)
  }

  // 🚪 Intentar agregar al grupo
  try {
    await conn.groupParticipantsUpdate(group, [user], 'add')
    conn.reply(m.chat, `${emoji} Se intentó agregar a @${user.split('@')[0]}`, m, { mentions: [user] })
  } catch (e) {
    // 📬 Si no se pudo agregar, enviarle el link por privado
    try {
      await conn.sendMessage(user, {
        text: `${emoji} *INVITACIÓN A GRUPO*\n\nUn usuario te invitó a unirte al grupo *${groupMetadata.subject}*.\n\n🔗 Enlace: ${link}`,
        mentions: [m.sender]
      })
      conn.reply(m.chat, `${emoji} No se pudo agregar, pero se envió el enlace al privado de @${user.split('@')[0]}`, m, { mentions: [user] })
    } catch (err) {
      conn.reply(m.chat, `${emoji2} No se pudo agregar ni enviarle el link a @${user.split('@')[0]}.`, m, { mentions: [user] })
    }
  }
}

handler.help = ['invite *<521xxxxxxxxxx>*']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir']
handler.group = true
handler.admin = false
handler.botAdmin = true

export default handler