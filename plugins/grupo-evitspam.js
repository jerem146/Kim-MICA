// 🔰 Plugin antispam para mensajes y stickers
const spamCache = new Map()

export async function before(m, { conn, isOwner }) {
  if (!m || m.isBaileys || !m.chat || !m.sender) return
  if (isOwner) return // los dueños no son restringidos

  const chat = global.db.data.chats[m.chat]
  if (!chat?.detect) return // si el antispam está desactivado

  const isSticker = m.mtype === 'sticker'
  const isText = m.mtype === 'conversation' || m.mtype === 'extendedTextMessage'
  const msgContent = isText ? m.text : isSticker ? '🧩STICKER' : null

  if (!msgContent) return

  const key = `${m.chat}:${m.sender}`
  const now = Date.now()

  if (!spamCache.has(key)) {
    spamCache.set(key, {
      lastText: msgContent,
      lastTime: now,
      count: 1
    })
  } else {
    const data = spamCache.get(key)

    if (msgContent === data.lastText && (now - data.lastTime) < 5000) {
      data.count++
    } else {
      data.lastText = msgContent
      data.lastTime = now
      data.count = 1
    }

    // ⚠️ Acción al detectar spam
    if (data.count >= 3) {
      await conn.reply(m.chat, `⚠️ @${m.sender.split("@")[0]} evita hacer spam.`, m, {
        mentions: [m.sender]
      })
      data.count = 0 // reinicia el contador
    }

    spamCache.set(key, data)
  }

  // 🧹 Limpia entradas viejas
  for (const [k, v] of spamCache.entries()) {
    if (now - v.lastTime > 10000) {
      spamCache.delete(k)
    }
  }
}