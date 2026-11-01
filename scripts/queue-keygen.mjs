#!/usr/bin/env node
/**
 * Generates the RSA key pair used to encrypt queued payloads.
 *   - Public key  → paste into .env.local as VITE_QUEUE_PUBLIC_KEY (safe to ship in the site)
 *   - Private key → queue-private-key.pem — keep ONLY on the game server (git-ignored)
 */
import { generateKeyPairSync } from 'node:crypto'
import { writeFileSync, existsSync } from 'node:fs'

const out = process.argv[2] ?? 'queue-private-key.pem'
if (existsSync(out)) {
  console.error(`${out} already exists — refusing to overwrite it.`)
  process.exit(1)
}
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 3072,
  publicKeyEncoding: { type: 'spki', format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
})
writeFileSync(out, privateKey, { mode: 0o600 })
console.log(`Private key written to ${out} (move it to the game server, never commit it).\n`)
console.log('Add this line to .env.local:\n')
console.log(`VITE_QUEUE_PUBLIC_KEY=${publicKey.toString('base64')}`)
