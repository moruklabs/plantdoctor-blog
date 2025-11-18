'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReadingModeSettings, TintOption, FontSizeOption } from '@/lib/reading-modes'
import {
  defaultReadingModeSettings,
  loadReadingModeSettings,
  saveReadingModeSettings,
} from '@/lib/reading-modes'

interface ReadingModeContextValue {
  settings: ReadingModeSettings
  toggleBionicReading: () => void
  toggleIncreasedSpacing: () => void
  setTintedBackground: (tint: TintOption) => void
  setFontSize: (size: FontSizeOption) => void
  resetAllSettings: () => void
  isAnyModeActive: boolean
}

const ReadingModeContext = createContext<ReadingModeContextValue | undefined>(undefined)

export function ReadingModeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReadingModeSettings>(defaultReadingModeSettings)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadedSettings = loadReadingModeSettings()
    setSettings(loadedSettings)
    setMounted(true)
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      saveReadingModeSettings(settings)
    }
  }, [settings, mounted])

  const toggleBionicReading = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      bionicReading: !prev.bionicReading,
    }))
  }, [])

  const toggleIncreasedSpacing = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      increasedSpacing: !prev.increasedSpacing,
    }))
  }, [])

  const setTintedBackground = useCallback((tint: TintOption) => {
    setSettings((prev) => ({
      ...prev,
      tintedBackground: tint,
    }))
  }, [])

  const setFontSize = useCallback((size: FontSizeOption) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: size,
    }))
  }, [])

  const resetAllSettings = useCallback(() => {
    setSettings(defaultReadingModeSettings)
  }, [])

  const isAnyModeActive =
    settings.bionicReading ||
    settings.increasedSpacing ||
    settings.tintedBackground !== 'none' ||
    settings.fontSize !== 'normal'

  const value: ReadingModeContextValue = {
    settings,
    toggleBionicReading,
    toggleIncreasedSpacing,
    setTintedBackground,
    setFontSize,
    resetAllSettings,
    isAnyModeActive,
  }

  return <ReadingModeContext.Provider value={value}>{children}</ReadingModeContext.Provider>
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext)
  if (context === undefined) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider')
  }
  return context
}
