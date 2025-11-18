'use client'

import { useState } from 'react'
import { Eye, X, Zap, AlignJustify, Palette, Type } from 'lucide-react'
import { useReadingMode } from '@/contexts/reading-mode-context'
import { tintColors } from '@/lib/reading-modes'
import type { TintOption, FontSizeOption } from '@/lib/reading-modes'

export function ReadingModeToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    settings,
    toggleBionicReading,
    toggleIncreasedSpacing,
    setTintedBackground,
    setFontSize,
    resetAllSettings,
    isAnyModeActive,
  } = useReadingMode()

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${
            isAnyModeActive
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }
        `}
        aria-label={isOpen ? 'Close focus mode settings' : 'Open focus mode settings'}
        aria-expanded={isOpen}
      >
        <Eye className="w-4 h-4" />
        <span className="hidden sm:inline">Focus Mode</span>
        {isAnyModeActive && (
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-label="Active" />
        )}
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-4"
            role="dialog"
            aria-label="Focus mode settings"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Focus Mode</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Bionic Reading */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.bionicReading}
                    onChange={toggleBionicReading}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Bionic Reading</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <b>Bol</b>ds <b>fir</b>st <b>pa</b>rt <b>o</b>f <b>wor</b>ds <b>fo</b>r{' '}
                      <b>faste</b>r <b>readin</b>g
                    </p>
                  </div>
                </label>
              </div>

              {/* Increased Spacing */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.increasedSpacing}
                    onChange={toggleIncreasedSpacing}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlignJustify className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Extra Spacing</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-0.5 rounded-full">
                        Proven
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Wider letters & lines (30% easier reading)
                    </p>
                  </div>
                </label>
              </div>

              {/* Tinted Background */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">Background Tint</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* None */}
                  <button
                    onClick={() => setTintedBackground('none')}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-left
                      ${
                        settings.tintedBackground === 'none'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="text-sm font-medium">None</div>
                    <div className="text-xs text-muted-foreground">Default</div>
                  </button>

                  {/* Beige */}
                  <TintButton
                    tint="beige"
                    label={tintColors.beige.label}
                    description={tintColors.beige.description}
                    isActive={settings.tintedBackground === 'beige'}
                    onClick={() => setTintedBackground('beige')}
                    bgColor="#faf8f3"
                  />

                  {/* Blue */}
                  <TintButton
                    tint="blue"
                    label={tintColors.blue.label}
                    description={tintColors.blue.description}
                    isActive={settings.tintedBackground === 'blue'}
                    onClick={() => setTintedBackground('blue')}
                    bgColor="#f0f4ff"
                  />

                  {/* Green */}
                  <TintButton
                    tint="green"
                    label={tintColors.green.label}
                    description={tintColors.green.description}
                    isActive={settings.tintedBackground === 'green'}
                    onClick={() => setTintedBackground('green')}
                    bgColor="#f0fdf4"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-sm">Text Size</span>
                </div>
                <div className="flex gap-2">
                  <FontSizeButton
                    size="normal"
                    label="Normal"
                    isActive={settings.fontSize === 'normal'}
                    onClick={() => setFontSize('normal')}
                  />
                  <FontSizeButton
                    size="large"
                    label="Large"
                    isActive={settings.fontSize === 'large'}
                    onClick={() => setFontSize('large')}
                  />
                  <FontSizeButton
                    size="xlarge"
                    label="X-Large"
                    isActive={settings.fontSize === 'xlarge'}
                    onClick={() => setFontSize('xlarge')}
                  />
                </div>
              </div>

              {/* Reset Button */}
              {isAnyModeActive && (
                <div className="pt-3 border-t border-border">
                  <button
                    onClick={resetAllSettings}
                    className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Reset All Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Helper Components

interface TintButtonProps {
  tint: TintOption
  label: string
  description: string
  isActive: boolean
  onClick: () => void
  bgColor: string
}

function TintButton({ label, description, isActive, onClick, bgColor }: TintButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-lg border-2 transition-all text-left
        ${isActive ? 'border-primary' : 'border-border hover:border-primary/50'}
      `}
    >
      <div
        className="w-full h-8 rounded mb-2 border border-border/50"
        style={{ backgroundColor: bgColor }}
      />
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </button>
  )
}

interface FontSizeButtonProps {
  size: FontSizeOption
  label: string
  isActive: boolean
  onClick: () => void
}

function FontSizeButton({ label, isActive, onClick }: FontSizeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium
        ${
          isActive
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-border hover:border-primary/50'
        }
      `}
    >
      {label}
    </button>
  )
}
