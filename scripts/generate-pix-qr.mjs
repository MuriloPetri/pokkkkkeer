/**
 * Gerador de QR Code PIX estático (padrão BACEN/EMV)
 * Roda com: node scripts/generate-pix-qr.mjs
 */

import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

// ─── Configurações (espelha lib/pix-config.ts) ─────────────────────────────
const PIX_KEY      = "murilomauriciopetri@gmail.com";
const PIX_RECEIVER = "Poker Trainer";   // máx 25 chars
const PIX_CITY     = "Maraba";          // máx 15 chars
const PIX_AMOUNT   = "6.00";
const OUTPUT_FILE  = "public/qrcode-pix.png";
// ────────────────────────────────────────────────────────────────────────────

// CRC16-CCITT (0x1021, seed 0xFFFF) — padrão PIX
function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id, value) {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

function buildPixPayload() {
  const gui  = tlv("00", "BR.GOV.BCB.PIX");
  const key  = tlv("01", PIX_KEY);
  const mai  = tlv("26", gui + key);
  const txid = tlv("05", "***");
  const add  = tlv("62", txid);

  const body =
    tlv("00", "01")                           +
    mai                                       +
    tlv("52", "0000")                         +
    tlv("53", "986")                          +
    tlv("54", PIX_AMOUNT)                     +
    tlv("58", "BR")                           +
    tlv("59", PIX_RECEIVER.substring(0, 25)) +
    tlv("60", PIX_CITY.substring(0, 15))     +
    add                                       +
    "6304";

  return body + crc16(body);
}

const payload = buildPixPayload();
console.log("Payload PIX:", payload);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath   = path.resolve(__dirname, "..", OUTPUT_FILE);

// Gera PNG direto com qrcode
await QRCode.toFile(outPath, payload, {
  type:                 "png",
  width:                400,
  margin:               2,
  errorCorrectionLevel: "M",
  color: { dark: "#000000", light: "#ffffff" },
});

console.log(`\n✅  QR Code salvo em: ${outPath}`);
