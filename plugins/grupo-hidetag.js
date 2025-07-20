// code por Xi_Crew, adaptado y mejorado por ChatGPT
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants }) => {
  if (!text && !m.quoted) {
    return conn.reply(m.chat, '❀ Debes enviar un texto o responder a un mensaje para hacer un tag.', m)
  }

  const users = participants.map(u => conn.decodeJid(u.id))
  const quoted = m.quoted || m
  const mime = (quoted.msg || quoted)?.mimetype || ''
  const isMedia = /image|video|sticker|audio/.test(mime)
  const caption = text || quoted.text || '*¡¡¡Hola!!!*'
  const invisible = String.fromCharCode(8206).repeat(850)

  try {
    if (m.quoted) {
      const quotedMsg = await m.getQuotedObj()
      const mtype = quotedMsg.mtype
      const content = {
        [mtype]: quotedMsg.message[mtype]
      }

      const msg = generateWAMessageFromContent(m.chat, content, {
        userJid: conn.user.id,
        quoted: null
      })

      // Agregamos el texto modificado
      msg.message.extendedTextMessage = {
        text: caption,
        contextInfo: { mentionedJid: users }
      }

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      return
    }

    // Si no hay mensaje citado, pero hay texto
    await conn.sendMessage(m.chat, {
      text: `${invisible}\n${caption}`,
      mentions: users
    }, { quoted: null })

  } catch (e) {
    console.log('[ERROR HIDETAG]', e)

    try {
      if (isMedia) {
        const media = await quoted.download?.()
        let type, msgData

        switch (quoted.mtype) {
          case 'imageMessage':
            msgData = { image: media, caption, mentions: users }
            break
          case 'videoMessage':
            msgData = { video: media, caption, mimetype: 'video/mp4', mentions: users }
            break
          case 'audioMessage':
            msgData = { audio: media, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }
            break
          case 'stickerMessage':
            msgData = { sticker: media }
            break
        }

        await conn.sendMessage(m.chat, msgData, { quoted: null })
      } else {
        await conn.sendMessage(m.chat, {
          text: `${invisible}\n${caption}`,
          mentions: users
        }, { quoted: null })
      }

    } catch (err) {
      console.error('[ERROR FALLBACK]', err)
      conn.reply(m.chat, '⚠️ No se pudo hacer el tag correctamente.', m)
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler