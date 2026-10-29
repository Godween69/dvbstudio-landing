// scripts/og-image.mjs
// Рисует картинку для превью ссылки (Telegram, VK, соцсети) 1200x630 без внешних библиотек.
// Крупный пиксельный шрифт (только латиница), фон в цветах сайта. PNG собирается встроенным zlib.

import { deflateSync } from 'node:zlib'

const W = 1200
const H = 630

// Шрифт 5x7: каждая буква это 7 строк по 5 клеток ('#' закрашено)
const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '..##.', '..##.'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
}

// Цвет фона: диагональный градиент как в шапке сайта (фиолетовый, синий, чёрный)
function background(x, y) {
  const t = (x + y) / (W + H)
  const stops = [
    [0, [88, 28, 135]],
    [0.55, [30, 58, 138]],
    [1, [3, 7, 18]],
  ]
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i]
    const [b, cb] = stops[i + 1]
    if (t <= b) {
      const k = (t - a) / (b - a)
      return ca.map((v, n) => Math.round(v + (cb[n] - v) * k))
    }
  }
  return stops[stops.length - 1][1]
}

// Холст RGBA
const px = new Uint8Array(W * H * 4)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const [r, g, b] = background(x, y)
    const o = (y * W + x) * 4
    px[o] = r
    px[o + 1] = g
    px[o + 2] = b
    px[o + 3] = 255
  }
}

function fillRect(x0, y0, w, h, color) {
  for (let y = y0; y < y0 + h && y < H; y++) {
    for (let x = x0; x < x0 + w && x < W; x++) {
      const o = (y * W + x) * 4
      const c = typeof color === 'function' ? color(x, y) : color
      px[o] = c[0]
      px[o + 1] = c[1]
      px[o + 2] = c[2]
    }
  }
}

// Выводит строку крупными пикселями; color может быть функцией (x, y)
function drawText(text, x0, y0, scale, color) {
  let x = x0
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[' ']
    glyph.forEach((row, ry) => {
      for (let rx = 0; rx < 5; rx++) {
        if (row[rx] === '#') fillRect(x + rx * scale, y0 + ry * scale, scale, scale, color)
      }
    })
    x += 6 * scale
  }
}

const white = [255, 255, 255]
const grey = [203, 213, 225]
// Градиент от розового к фиолетовому по горизонтали для второй строки
const accent = (x) => {
  const k = Math.min(1, Math.max(0, (x - 120) / 900))
  return [Math.round(244 + (167 - 244) * k), Math.round(114 + (139 - 114) * k), Math.round(182 + (250 - 182) * k)]
}

drawText('DVB STUDIO', 120, 150, 15, white)
fillRect(120, 290, 160, 8, (x) => accent(x))
drawText('FULL-STACK DEVELOPER', 120, 340, 8, (x) => accent(x))
drawText('DVBSTUDIO.RU', 120, 500, 6, grey)

// Кодирование PNG: сигнатура, IHDR, IDAT (сжатые строки с фильтром 0), IEND
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

export function makeOgPng() {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8 // глубина цвета
  ihdr[9] = 6 // RGBA
  const rows = Buffer.alloc((W * 4 + 1) * H)
  for (let y = 0; y < H; y++) {
    rows[y * (W * 4 + 1)] = 0 // фильтр «нет»
    Buffer.from(px.buffer, y * W * 4, W * 4).copy(rows, y * (W * 4 + 1) + 1)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

export const OG_SIZE = { width: W, height: H }
