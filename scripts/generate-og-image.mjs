import { createCanvas } from '@napi-rs/canvas'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const WIDTH = 1200
const HEIGHT = 630

const canvas = createCanvas(WIDTH, HEIGHT)
const ctx = canvas.getContext('2d')

// Base background
ctx.fillStyle = '#0A0A1E'
ctx.fillRect(0, 0, WIDTH, HEIGHT)

// Corner-to-corner brand gradient glow, low opacity
const glow = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
glow.addColorStop(0, 'rgba(0, 217, 255, 0.18)')
glow.addColorStop(1, 'rgba(168, 85, 247, 0.18)')
ctx.fillStyle = glow
ctx.fillRect(0, 0, WIDTH, HEIGHT)

// Scattered particle dots in the corners
function drawDot(x, y, r, color) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

const dots = [
  { x: 60, y: 50, r: 3, color: 'rgba(0, 217, 255, 0.5)' },
  { x: 120, y: 90, r: 2, color: 'rgba(168, 85, 247, 0.4)' },
  { x: 40, y: 160, r: 4, color: 'rgba(0, 217, 255, 0.3)' },
  { x: 1140, y: 60, r: 3, color: 'rgba(168, 85, 247, 0.5)' },
  { x: 1080, y: 110, r: 2, color: 'rgba(0, 217, 255, 0.4)' },
  { x: 1150, y: 170, r: 5, color: 'rgba(168, 85, 247, 0.3)' },
  { x: 70, y: 580, r: 3, color: 'rgba(168, 85, 247, 0.35)' },
  { x: 1130, y: 570, r: 4, color: 'rgba(0, 217, 255, 0.35)' }
]
dots.forEach(d => drawDot(d.x, d.y, d.r, d.color))

// Logo: "ERY" gradient + "MON" boxed in white
const centerX = WIDTH / 2
const logoY = 220

ctx.textBaseline = 'alphabetic'
ctx.font = '900 110px sans-serif'

const eryText = 'ERY'
const monText = 'MON'

const eryWidth = ctx.measureText(eryText).width
const monWidth = ctx.measureText(monText).width
const monPaddingX = 18
const gap = 6

const totalWidth = eryWidth + gap + monWidth + monPaddingX * 2
let cursorX = centerX - totalWidth / 2

// "ERY" with cyan -> violet gradient
const eryGradient = ctx.createLinearGradient(cursorX, 0, cursorX + eryWidth, 0)
eryGradient.addColorStop(0, '#00D9FF')
eryGradient.addColorStop(1, '#A855F7')
ctx.fillStyle = eryGradient
ctx.textAlign = 'left'
ctx.fillText(eryText, cursorX, logoY)

cursorX += eryWidth + gap

// "MON" boxed with white border, white fill text
const boxX = cursorX
const boxY = logoY - 110 * 0.78
const boxWidth = monWidth + monPaddingX * 2
const boxHeight = 110 * 1.05

ctx.save()
ctx.strokeStyle = '#FFFFFF'
ctx.lineWidth = 4
ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
ctx.restore()

ctx.fillStyle = '#FFFFFF'
ctx.fillText(monText, boxX + monPaddingX, logoY)

// Subtitle: "SERVICIOS DIGITALES"
ctx.textAlign = 'center'
ctx.fillStyle = '#00D9FF'
ctx.font = '700 28px sans-serif'

function drawLetterSpaced(text, x, y, spacing) {
  const widths = [...text].map(ch => ctx.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1)
  let startX = x - total / 2
  ctx.textAlign = 'left'
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], startX, y)
    startX += widths[i] + spacing
  }
  ctx.textAlign = 'center'
}

drawLetterSpaced('SERVICIOS DIGITALES', centerX, 300, 6)

// Tagline: two lines, white, centered
ctx.fillStyle = '#FFFFFF'
ctx.font = '700 42px sans-serif'
ctx.textAlign = 'center'

const line1 = 'Desarrollo Web, E-commerce'
const line2 = 'y Software a Medida'

ctx.fillText(line1, centerX, 410)
ctx.fillText(line2, centerX, 465)

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og-image.png')
const buffer = canvas.toBuffer('image/png')
writeFileSync(outPath, buffer)

console.log(`OG image written to ${outPath} (${buffer.length} bytes)`)
