//code traído por Xi_Crew, optimizado por ChatGPT
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants }) => {
  if (!m.quoted && !text) return conn.reply(m.chat, `❀ Debes enviar un texto o responder un mensaje para hacer un tag.`, m)

  const users = participants.map(u => conn.decodeJid(u.id))
  const quoted = m.quoted ? m.quoted : m
  const mime = (quoted.msg || quoted)?.mimetype || ''
  const isMedia = /image|video|sticker|audio/.test(mime)
  const caption = text || quoted.text || '*¡¡¡Hola!!!*'
  const invisible = String.fromCharCode(8206).repeat(850)

  try {
    if (m.quoted) {
      const quotedMsg = await m.getQuotedObj()
      const content = {
        [quotedMsg.mtype]: quotedMsg.message[quotedMsg.mtype]
      }

      const msg = generateWAMessageFromContent(m.chat, content, {
        userJid: conn.user.id,
        quoted: null
      })

      msg.message.extendedTextMessage = {
        text: caption,
        contextInfo: { mentionedJid: users }
      }

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } else {
      throw 'No quoted'
    }

  } catch {
    // fallback por si falla la parte anterior
    try {
      if (isMedia) {
        const media = await quoted.download()
        let type, msgData

        if (quoted.mtype === 'imageMessage') {
          type = 'image'
          msgData = { image: media, caption, mentions: users }
        } else if (quoted.mtype === 'videoMessage') {
          type = 'video'
          msgData = { video: media, caption, mimetype: 'video/mp4', mentions: users }
        } else if (quoted.mtype === 'audioMessage') {
          type = 'audio'
          msgData = { audio: media, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }
        } else if (quoted.mtype === 'stickerMessage') {
          type = 'sticker'
          msgData = { sticker: media }
        }

        await conn.sendMessage(m.chat, msgData, { quoted: null })
      } else {
        await conn.sendMessage(m.chat, {
          text: `${invisible}\n${caption}`,
          mentions: users
        }, { quoted: null })
      }
    } catch (e) {
      console.error(e)
      conn.reply(m.chat, `⚠️ Error al enviar el mensaje con etiquetas ocultas.`, m)
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler