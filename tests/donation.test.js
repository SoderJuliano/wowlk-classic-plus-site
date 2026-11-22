import { describe, it, expect } from 'vitest'
import {
  detectRegion, methodForRegion, isValidCardNumber, formatCardNumber, parseExpiry, guessBrand, rejectionMessage, tokenizeCard
} from '../src/services/donationService.js'
import { donationUrlFrom } from '../src/config/site.js'

describe('donation region', () => {
  it('Brazil (time zone or pt-BR) always pays with Pix', () => {
    expect(detectRegion({ timeZone: 'America/Sao_Paulo', languages: ['en-US'] })).toBe('BR')
    expect(detectRegion({ timeZone: 'Europe/Lisbon', languages: ['pt-BR'] })).toBe('BR')
    expect(methodForRegion('BR')).toBe('pix')
  })

  it('everyone else pays with card (pt-PT is not Brazil)', () => {
    expect(detectRegion({ timeZone: 'Europe/Lisbon', languages: ['pt-PT', 'en'] })).toBe('INTL')
    expect(detectRegion({ timeZone: 'America/New_York', languages: ['en-US'] })).toBe('INTL')
    expect(methodForRegion('INTL')).toBe('card')
  })
})

describe('card helpers', () => {
  it('Luhn-checks Mercado Pago test cards', () => {
    expect(isValidCardNumber('5031 4332 1540 6351')).toBe(true)
    expect(isValidCardNumber('4235 6477 2802 5682')).toBe(true)
    expect(isValidCardNumber('3753 651535 56885')).toBe(true)
    expect(isValidCardNumber('4235 6477 2802 5683')).toBe(false)
    expect(isValidCardNumber('1234')).toBe(false)
  })

  it('formats numbers as the user types (Amex 4-6-5)', () => {
    expect(formatCardNumber('5031433215406351')).toBe('5031 4332 1540 6351')
    expect(formatCardNumber('375365153556885')).toBe('3753 651535 56885')
  })

  it('parses expiry and rejects past dates', () => {
    const now = new Date(2026, 10, 22)
    expect(parseExpiry('11/30', now)).toEqual({ month: 11, year: 2030 })
    expect(parseExpiry('11 / 2030', now)).toEqual({ month: 11, year: 2030 })
    expect(parseExpiry('1130', now)).toEqual({ month: 11, year: 2030 })
    expect(parseExpiry('10/26', now)).toBeNull()
    expect(parseExpiry('11/26', now)).toEqual({ month: 11, year: 2026 })
    expect(parseExpiry('13/30', now)).toBeNull()
  })

  it('guesses the brand only as a fallback', () => {
    expect(guessBrand('4235')).toBe('visa')
    expect(guessBrand('5031')).toBe('master')
    expect(guessBrand('3753')).toBe('amex')
    expect(guessBrand('9999')).toBeNull()
  })

  it('maps card rejections to player-friendly text', () => {
    expect(rejectionMessage('cc_rejected_insufficient_amount')).toMatch(/funds/)
    expect(rejectionMessage('anything_else')).toMatch(/declined/)
  })

  it('mock gateway never loads the SDK and carries the holder name (APRO/OTHE)', async () => {
    const t = await tokenizeCard({ gateway: 'mock' }, { number: '5031 4332 1540 6351', holder: 'Apro', expiry: '11/30', cvv: '123' })
    expect(t).toEqual({ token: 'mock-APRO', paymentMethodId: 'master', issuerId: null })
    await expect(tokenizeCard({ gateway: 'mock' }, { number: '1111', holder: 'APRO', expiry: '11/30', cvv: '123' })).rejects.toThrow(/card number/)
  })
})

describe('donation API url', () => {
  it('derives /donation/v1 from the login API host', () => {
    expect(donationUrlFrom('https://x.ngrok-free.dev/launcher/v1')).toBe('https://x.ngrok-free.dev/donation/v1')
    expect(donationUrlFrom('http://localhost:5300/launcher/v1/')).toBe('http://localhost:5300/donation/v1')
    expect(donationUrlFrom('https://other.host/api')).toBe('')
    expect(donationUrlFrom('')).toBe('')
  })
})
