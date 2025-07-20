let handler = async (m, { conn }) => {
  let img = './src/catalogo.jpg'

  let creador = global.creador || '@TheKingDestroy'
  let botname = global.botname || 'MiBot'
  let vs = global.vs || '1.0.0'
  let libreria = global.libreria || 'Baileys'
  let baileys = global.baileys || ''

  // Mostrar dueños con nombre y número
  let dueños = global.owner.map(([num, nombre]) => {
    let name = nombre ? `👤 *${nombre}*` : '👤 *Dueño*'
    return `${name}\n> wa.me/${num}`
  }).join('\n\n')

  let staff = `
ᥫ᭡ *EQUIPO DE AYUDANTES* ❀
✰ *Dueño principal:* ${creador}
✦ *Bot:* ${botname}
⚘ *Versión:* ${vs}
❖ *Librería:* ${libreria} ${baileys}

❍ *Lista de Dueños:*
${dueños}
  `.trim()

  await conn.sendFile(m.chat, img, 'staff.jpg', staff, m)
}

handler.help = ['staff']
handler.tags = ['main']
handler.command = ['colaboradores', 'staff']
handler.register = false

export default handler