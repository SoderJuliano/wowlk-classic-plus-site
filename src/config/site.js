/**
 * Single source of truth for every project-level setting.
 * Components must read from here — never hard-code these values elsewhere.
 * Any value can be overridden at build time through VITE_* env vars (see .env.example).
 */
const env = import.meta.env ?? {}
const pick = (key, fallback) => {
  const v = env[key]
  return v === undefined || v === '' ? fallback : v
}

/** Release states shared by downloads, launcher and features. */
export const RELEASE = Object.freeze({
  AVAILABLE: 'available',
  EARLY_ACCESS: 'early-access',
  COMING_SOON: 'coming-soon'
})

/** Development stage of a feature/technology. Displayed as a badge. */
export const STAGE = Object.freeze({
  LIVE: 'live', //           implemented and tested on the realm
  IN_DEVELOPMENT: 'in-development',
  EXPERIMENTAL: 'experimental',
  PLANNED: 'planned'
})

export const STAGE_LABEL = Object.freeze({
  [STAGE.LIVE]: 'Live',
  [STAGE.IN_DEVELOPMENT]: 'In development',
  [STAGE.EXPERIMENTAL]: 'Experimental',
  [STAGE.PLANNED]: 'Planned'
})

export const RELEASE_LABEL = Object.freeze({
  [RELEASE.AVAILABLE]: 'Available',
  [RELEASE.EARLY_ACCESS]: 'Early Access',
  [RELEASE.COMING_SOON]: 'Coming Soon'
})

export const site = Object.freeze({
  name: 'WoW Classic Plus LK',
  shortName: 'Classic Plus LK',
  slug: 'wow-classic-plus-lk',
  tagline: 'The Classic Experience, Evolved.',
  url: pick('VITE_SITE_URL', typeof window !== 'undefined' ? window.location.origin : ''),

  game: {
    expansion: 'Wrath of the Lich King',
    version: '3.3.5a',
    build: 12340,
    core: 'AzerothCore',
    pricing: 'Free to play — no Pay to Win'
  },

  realm: {
    name: pick('VITE_REALM_NAME', 'Classic Plus LK'),
    /** Address players put in realmlist.wtf. Empty = hidden ("shared soon"). */
    realmlist: pick('VITE_REALMLIST', ''),
    /** Measured latency shown on the site, in ms. Empty = hidden. */
    latencyMs: Number(pick('VITE_REALM_LATENCY_MS', '')) || null,
    region: pick('VITE_REALM_REGION', 'Global'),
    /** online | offline | maintenance — used when no live status endpoint is configured. */
    status: pick('VITE_REALM_STATUS', 'offline'),
    /** Optional JSON endpoint: { online, playersOnline, totalAccounts }. */
    statusUrl: pick('VITE_STATUS_URL', ''),
    statusRefreshMs: 60_000
  },

  links: {
    support: pick('VITE_SUPPORT_URL', '')
  },

  /** Official gameplay videos (YouTube IDs). Loaded only when the visitor clicks play. */
  videos: {
    druidAbilities: {
      id: 'awz4VzT1_ik',
      title: 'Reworked starting abilities — Druid',
      caption: '32-bit client (ready) — Redesigned early abilities and dynamic starter kit for Druids.'
    },
    rogueShadowClone: {
      id: 'MePhLwvG7MY',
      title: 'New Rogue ability — Shadow Clone',
      caption: '32-bit client (ready) — Rogue summons deceptive shadow duplicates in combat.'
    },
    blacksmithing: {
      id: 'k6f-qLByiLw',
      title: 'Blacksmithing mechanics & reworked vendor items',
      caption: '32-bit client (ready) — Blacksmiths can now recycle armor, plus reworked items on a vendor.'
    },
    newClasses: {
      id: '-jgutEQ9jNo',
      title: 'New classes for each race',
      caption: '32-bit client — the new race and class combinations, in game.'
    },
    petMounts: {
      id: 'eP7LzMSIzUw',
      title: 'Companion pets as mounts & Hunter immersion',
      caption: '32-bit client (ready) — Hunters can ride their tamed companion pets, including the boar ground mount and owl flying mount with synchronized wingbeat animations.'
    },
    nativeLinux: {
      id: 'S2MQICTyLmI',
      title: 'Native Linux 64-bit client — early build',
      caption: 'First, work-in-progress build of the 64-bit client running natively on Linux with ray tracing and FSR enabled.'
    }
  },

  downloads: {
    client32: {
      id: 'client32',
      title: 'WoW Classic Plus LK — 32-bit',
      subtitle: 'Traditional client',
      status: pick('VITE_DOWNLOAD_32_STATUS', RELEASE.AVAILABLE),
      url: pick('VITE_DOWNLOAD_32_URL', ''),
      platforms: ['windows', 'linux']
    },
    client64: {
      id: 'client64',
      title: 'WoW Classic Plus LK — 64-bit',
      subtitle: 'Next-generation client',
      status: pick('VITE_DOWNLOAD_64_STATUS', RELEASE.COMING_SOON),
      url: pick('VITE_DOWNLOAD_64_URL', ''),
      platforms: ['windows', 'linux']
    }
  },

  /** The launcher installs the game (36 GB) and keeps it updated. */
  launcher: {
    status: pick('VITE_LAUNCHER_STATUS', RELEASE.AVAILABLE),
    version: '0.1.24',
    windowsUrl: pick('VITE_LAUNCHER_WINDOWS_URL', 'https://pub-aca87790200a4237af40519010e23d8c.r2.dev/OLK-Plus-Launcher-Setup-0.1.24.exe'),
    linuxUrl: pick('VITE_LAUNCHER_LINUX_URL', 'https://pub-aca87790200a4237af40519010e23d8c.r2.dev/OLK-Plus-Launcher-0.1.24.AppImage')
  },

  /** Upscaling technologies for the 64-bit client. Update the stage as work progresses. */
  upscaling: [
    { id: 'rt', vendor: 'Rendering', name: 'Ray Tracing', stage: STAGE.EXPERIMENTAL, note: 'Running in the early Linux build' },
    { id: 'fsr1', vendor: 'AMD', name: 'FSR 1', stage: STAGE.PLANNED },
    { id: 'fsr3', vendor: 'AMD', name: 'FSR 3', stage: STAGE.PLANNED },
    { id: 'fsr41', vendor: 'AMD', name: 'FSR 4.1', stage: STAGE.PLANNED },
    { id: 'dlss5', vendor: 'NVIDIA', name: 'DLSS 5', stage: STAGE.PLANNED }
  ],

  /** Platforms for the 64-bit client. */
  platforms64: [
    { id: 'windows', name: 'Windows', line: 'Native 64-bit client.', stage: STAGE.IN_DEVELOPMENT },
    {
      id: 'linux',
      name: 'Linux',
      line: 'Natively compiled for Linux.',
      stage: STAGE.IN_DEVELOPMENT,
      highlight: true
    },
    { id: 'apple', name: 'macOS', line: 'Planned for the future.', stage: STAGE.PLANNED }
  ],

  /** Abra API — queue (notifications) + transactional e-mail. */
  abra: {
    baseUrl: pick('VITE_ABRA_API_URL', 'https://abra-api.top'),
    // Keys come ONLY from .env (never committed). Note: Vite inlines them into the dist bundle.
    registrationKey: pick('VITE_QUEUE_REGISTRATION_KEY', ''),
    eventsKey: pick('VITE_QUEUE_EVENTS_KEY', ''),
    publicKey: pick('VITE_QUEUE_PUBLIC_KEY', '')
  },

  auth: {
    /** Pikachu login API, e.g. https://host/launcher/v1. Empty = the login page says it is unavailable. */
    apiUrl: pick('VITE_AUTH_API_URL', ''),
    termsVersion: '2026-10-31'
  }
})

export default site
