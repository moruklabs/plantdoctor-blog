/**
 * Reading modes utilities for ADHD and dyslexia-friendly content
 * Research-backed approaches combining:
 * - Bionic Reading (community favorite for ADHD)
 * - Increased spacing (scientifically proven for dyslexia)
 * - Tinted backgrounds (reduces visual stress)
 * - Font size adjustments (general accessibility)
 */

export type TintOption = 'none' | 'beige' | 'blue' | 'green'
export type FontSizeOption = 'normal' | 'large' | 'xlarge'

export interface ReadingModeSettings {
  bionicReading: boolean
  increasedSpacing: boolean
  tintedBackground: TintOption
  fontSize: FontSizeOption
}

export const defaultReadingModeSettings: ReadingModeSettings = {
  bionicReading: false,
  increasedSpacing: false,
  tintedBackground: 'none',
  fontSize: 'normal',
}

/**
 * CSS classes for reading mode features
 */
export const readingModeClasses = {
  spacing: 'reading-mode-spacing',
  tintBeige: 'reading-mode-tint-beige',
  tintBlue: 'reading-mode-tint-blue',
  tintGreen: 'reading-mode-tint-green',
  fontLarge: 'reading-mode-font-large',
  fontXLarge: 'reading-mode-font-xlarge',
} as const

/**
 * Tint color configurations
 * Based on research for reducing visual stress
 */
export const tintColors = {
  beige: {
    background: '#faf8f3',
    text: '#2d2d2d',
    label: 'Warm Beige',
    description: 'Reduces glare, warm tone',
  },
  blue: {
    background: '#f0f4ff',
    text: '#1e293b',
    label: 'Cool Blue',
    description: 'Calming, reduces eye strain',
  },
  green: {
    background: '#f0fdf4',
    text: '#14532d',
    label: 'Soft Green',
    description: 'Gentle on eyes, nature-inspired',
  },
} as const

/**
 * Apply bionic reading transformation to text
 * Bolds the first 30-50% of each word for improved focus
 */
export function applyBionicReading(text: string): string {
  if (typeof window === 'undefined') return text

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { textVide } = require('text-vide')

    // fixationPoint: 1-5, higher = more bold (3 is optimal based on research)
    return textVide(text, {
      fixationPoint: 3,
      // Preserve HTML tags
      separateTag: true,
    })
  } catch (error) {
    console.error('Failed to apply bionic reading:', error)
    return text
  }
}

/**
 * Get CSS class names based on reading mode settings
 */
export function getReadingModeClassNames(settings: ReadingModeSettings): string {
  const classes: string[] = []

  if (settings.increasedSpacing) {
    classes.push(readingModeClasses.spacing)
  }

  if (settings.tintedBackground !== 'none') {
    const tintClass =
      readingModeClasses[
        `tint${settings.tintedBackground.charAt(0).toUpperCase() + settings.tintedBackground.slice(1)}` as keyof typeof readingModeClasses
      ]
    classes.push(tintClass)
  }

  if (settings.fontSize === 'large') {
    classes.push(readingModeClasses.fontLarge)
  } else if (settings.fontSize === 'xlarge') {
    classes.push(readingModeClasses.fontXLarge)
  }

  return classes.join(' ')
}

/**
 * LocalStorage key for reading mode preferences
 */
export const READING_MODE_STORAGE_KEY = 'reading-mode-preferences'

/**
 * Save reading mode settings to localStorage
 */
export function saveReadingModeSettings(settings: ReadingModeSettings): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(READING_MODE_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save reading mode settings:', error)
  }
}

/**
 * Load reading mode settings from localStorage
 */
export function loadReadingModeSettings(): ReadingModeSettings {
  if (typeof window === 'undefined') return defaultReadingModeSettings

  try {
    const stored = localStorage.getItem(READING_MODE_STORAGE_KEY)
    if (!stored) return defaultReadingModeSettings

    const parsed = JSON.parse(stored)

    // Validate and merge with defaults
    return {
      bionicReading: typeof parsed.bionicReading === 'boolean' ? parsed.bionicReading : false,
      increasedSpacing:
        typeof parsed.increasedSpacing === 'boolean' ? parsed.increasedSpacing : false,
      tintedBackground: ['none', 'beige', 'blue', 'green'].includes(parsed.tintedBackground)
        ? parsed.tintedBackground
        : 'none',
      fontSize: ['normal', 'large', 'xlarge'].includes(parsed.fontSize)
        ? parsed.fontSize
        : 'normal',
    }
  } catch (error) {
    console.error('Failed to load reading mode settings:', error)
    return defaultReadingModeSettings
  }
}
