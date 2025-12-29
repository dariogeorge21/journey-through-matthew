/**
 * Script to generate simple audio files for quiz feedback
 * Run with: node scripts/generateAudio.js
 * 
 * This generates success.mp3 and failure.mp3 files using Web Audio API
 * and saves them as base64 encoded MP3 files
 */

const fs = require("fs");
const path = require("path");

// Create public/audio directory if it doesn't exist
const audioDir = path.join(__dirname, "../public/audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Success sound: Pleasant chime (C major chord)
// This is a simple WAV file encoded as base64
const successWav = Buffer.from([
  // WAV header
  0x52, 0x49, 0x46, 0x46, 0x24, 0xf0, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
  0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
  0x44, 0xac, 0x00, 0x00, 0x10, 0xb1, 0x02, 0x00, 0x04, 0x00, 0x10, 0x00,
  0x64, 0x61, 0x74, 0x61, 0x00, 0xf0, 0x00, 0x00,
  // Audio data (simplified success tone)
  ...Array(61440).fill(0).map((_, i) => {
    const t = i / 44100;
    const freq1 = 523.25; // C5
    const freq2 = 659.25; // E5
    const freq3 = 783.99; // G5
    const sample = Math.sin(2 * Math.PI * freq1 * t) * 0.2 +
                   Math.sin(2 * Math.PI * freq2 * t) * 0.2 +
                   Math.sin(2 * Math.PI * freq3 * t) * 0.2;
    const envelope = Math.exp(-t * 2);
    return Math.floor((sample * envelope * 32767) & 0xffff);
  }).flatMap(n => [n & 0xff, (n >> 8) & 0xff])
]);

// Failure sound: Buzzer tone (low frequency)
const failureWav = Buffer.from([
  // WAV header (same as above)
  0x52, 0x49, 0x46, 0x46, 0x24, 0xf0, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
  0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
  0x44, 0xac, 0x00, 0x00, 0x10, 0xb1, 0x02, 0x00, 0x04, 0x00, 0x10, 0x00,
  0x64, 0x61, 0x74, 0x61, 0x00, 0xf0, 0x00, 0x00,
  // Audio data (simplified failure tone)
  ...Array(61440).fill(0).map((_, i) => {
    const t = i / 44100;
    const freq = 200; // Low frequency buzz
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.3;
    const envelope = Math.exp(-t * 3);
    return Math.floor((sample * envelope * 32767) & 0xffff);
  }).flatMap(n => [n & 0xff, (n >> 8) & 0xff])
]);

// Write files
fs.writeFileSync(path.join(audioDir, "success.wav"), successWav);
fs.writeFileSync(path.join(audioDir, "failure.wav"), failureWav);

console.log("✓ Audio files generated successfully!");
console.log(`  - ${audioDir}/success.wav`);
console.log(`  - ${audioDir}/failure.wav`);

