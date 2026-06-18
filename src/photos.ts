/**
 * photos.ts — registry of the real, openly-licensed reference photos used in the
 * build steps, plus vendor links for the branded (non-photographable) parts.
 *
 * Images live in /public/photos and were pulled from Wikimedia Commons. Each
 * carries its author + license here so we can credit it (see the "Image credits"
 * tab in the Parts & build modal). CC-BY / CC-BY-SA require attribution.
 */

export type PhotoKey =
  | 'load-cell'
  | 'extrusion'
  | 'rod-end'
  | 'hex-keys'
  | 'arduino'
  | 'pitot'
  | 'weights'
  | 'caliper'
  | 'multimeter'
  | 'screws'

export interface Photo {
  src: string
  alt: string
  author: string
  license: string
  source: string
}

export const PHOTOS: Record<PhotoKey, Photo> = {
  'load-cell': {
    src: '/photos/load-cell.jpg',
    alt: 'S-beam load cell (the body shows RED=+EXC, BLACK=−EXC, GREEN=+SIG, WHITE=−SIG)',
    author: 'FUTEK Advanced Sensor Technology, Inc.',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Miniature_S-beam_load_cell.jpg',
  },
  extrusion: {
    src: '/photos/extrusion.jpg',
    alt: 'T-slot aluminium extrusion profiles',
    author: 'Aluprofil szerelő',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Aluprofil_2.jpg',
  },
  'rod-end': {
    src: '/photos/rod-end.jpg',
    alt: 'Rod end bearings (heim joints) — load a cell purely axially',
    author: 'R. Henrik Nilsson',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2000s_rod_end_bearing_M80_or_MB0_111_gr.jpg',
  },
  'hex-keys': {
    src: '/photos/hex-keys.jpg',
    alt: 'Hex (Allen) keys / bits',
    author: 'Jacek Halicki',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2023_Bity_Imbus.jpg',
  },
  arduino: {
    src: '/photos/arduino.jpg',
    alt: 'Arduino Nano (clone) — reads the I²C airspeed sensor over USB',
    author: 'Retired electrician',
    license: 'CC0',
    source: 'https://commons.wikimedia.org/wiki/File:Iskra_Nano_Pro_(Arduino_Nano_clone)_top.jpg',
  },
  pitot: {
    src: '/photos/pitot.jpg',
    alt: 'Pitot tube — measures tunnel airspeed',
    author: 'User:Kolossos',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:ILA-Pitotrohr.jpg',
  },
  weights: {
    src: '/photos/weights.jpg',
    alt: 'Known calibration masses in a case',
    author: 'HelgeRieder',
    license: 'CC0',
    source: 'https://commons.wikimedia.org/wiki/File:Gewichtssatz_einer_Feinwaage.jpg',
  },
  caliper: {
    src: '/photos/caliper.jpg',
    alt: 'Vernier / digital caliper — for accurate layout',
    author: 'ArtMechanic',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Messschieber.jpg',
  },
  multimeter: {
    src: '/photos/multimeter.jpg',
    alt: 'Digital multimeter — identify bridge wires / check continuity',
    author: 'Jacek Halicki',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2017_Cyfrowy_miernik_uniwersalny.jpg',
  },
  screws: {
    src: '/photos/screws.jpg',
    alt: 'Hex-socket cap screws / bolts',
    author: 'R. Henrik Nilsson',
    license: 'CC BY 4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:INBUS_RIPP_Serrated_hex_soc_head_cap_screws_with_flange_by_Bauer_and_Schaurte_Karcher_GmbH_Neuss_Germany.jpg',
  },
}

/** Vendor product pages for the exact branded parts (their own real photos). */
export const VENDORS = {
  dymh103: 'https://www.amazon.com/s?k=DYMH-103+S-type+load+cell',
  phidget1046: 'https://www.phidgets.com/?prodid=1027',
  matek4525: 'https://www.getfpv.com/matek-digital-airspeed-sensor-aspd-4525.html',
} as const

/** Flat list for the credits view. */
export const IMAGE_CREDITS = (Object.keys(PHOTOS) as PhotoKey[]).map((k) => ({ key: k, ...PHOTOS[k] }))
