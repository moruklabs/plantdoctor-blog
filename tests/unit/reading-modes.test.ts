import {
  applyBionicReading,
  defaultReadingModeSettings,
  getReadingModeClassNames,
  loadReadingModeSettings,
  READING_MODE_STORAGE_KEY,
  readingModeClasses,
  saveReadingModeSettings,
  tintColors,
  type ReadingModeSettings,
} from '@/lib/reading-modes'

describe('Reading Modes', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('Default Settings', () => {
    it('should have correct default settings', () => {
      expect(defaultReadingModeSettings).toEqual({
        bionicReading: false,
        increasedSpacing: false,
        tintedBackground: 'none',
        fontSize: 'normal',
      })
    })
  })

  describe('Reading Mode Classes', () => {
    it('should define all required CSS classes', () => {
      expect(readingModeClasses).toEqual({
        spacing: 'reading-mode-spacing',
        tintBeige: 'reading-mode-tint-beige',
        tintBlue: 'reading-mode-tint-blue',
        tintGreen: 'reading-mode-tint-green',
        fontLarge: 'reading-mode-font-large',
        fontXLarge: 'reading-mode-font-xlarge',
      })
    })
  })

  describe('Tint Colors', () => {
    it('should define beige tint color configuration', () => {
      expect(tintColors.beige).toEqual({
        background: '#faf8f3',
        text: '#2d2d2d',
        label: 'Warm Beige',
        description: 'Reduces glare, warm tone',
      })
    })

    it('should define blue tint color configuration', () => {
      expect(tintColors.blue).toEqual({
        background: '#f0f4ff',
        text: '#1e293b',
        label: 'Cool Blue',
        description: 'Calming, reduces eye strain',
      })
    })

    it('should define green tint color configuration', () => {
      expect(tintColors.green).toEqual({
        background: '#f0fdf4',
        text: '#14532d',
        label: 'Soft Green',
        description: 'Gentle on eyes, nature-inspired',
      })
    })
  })

  describe('getReadingModeClassNames', () => {
    it('should return empty string for default settings', () => {
      const classes = getReadingModeClassNames(defaultReadingModeSettings)
      expect(classes).toBe('')
    })

    it('should return spacing class when increased spacing is enabled', () => {
      const classes = getReadingModeClassNames({
        ...defaultReadingModeSettings,
        increasedSpacing: true,
      })
      expect(classes).toBe('reading-mode-spacing')
    })

    it('should return beige tint class when beige tint is selected', () => {
      const classes = getReadingModeClassNames({
        ...defaultReadingModeSettings,
        tintedBackground: 'beige',
      })
      expect(classes).toBe('reading-mode-tint-beige')
    })

    it('should return blue tint class when blue tint is selected', () => {
      const classes = getReadingModeClassNames({
        ...defaultReadingModeSettings,
        tintedBackground: 'blue',
      })
      expect(classes).toBe('reading-mode-tint-blue')
    })

    it('should return green tint class when green tint is selected', () => {
      const classes = getReadingModeClassNames({
        ...defaultReadingModeSettings,
        tintedBackground: 'green',
      })
      expect(classes).toBe('reading-mode-tint-green')
    })

    it('should return large font class when large font is selected', () => {
      const classes = getReadingModeClassNames({
        ...defaultReadingModeSettings,
        fontSize: 'large',
      })
      expect(classes).toBe('reading-mode-font-large')
    })

    it('should return xlarge font class when xlarge font is selected', () => {
      const classes = getReadingModeClassNames({
        ...defaultReadingModeSettings,
        fontSize: 'xlarge',
      })
      expect(classes).toBe('reading-mode-font-xlarge')
    })

    it('should combine multiple classes correctly', () => {
      const classes = getReadingModeClassNames({
        bionicReading: false,
        increasedSpacing: true,
        tintedBackground: 'beige',
        fontSize: 'large',
      })
      expect(classes).toBe('reading-mode-spacing reading-mode-tint-beige reading-mode-font-large')
    })

    it('should handle all features enabled', () => {
      const classes = getReadingModeClassNames({
        bionicReading: true,
        increasedSpacing: true,
        tintedBackground: 'blue',
        fontSize: 'xlarge',
      })
      expect(classes).toBe('reading-mode-spacing reading-mode-tint-blue reading-mode-font-xlarge')
    })
  })

  describe('saveReadingModeSettings', () => {
    it('should save settings to localStorage', () => {
      const settings: ReadingModeSettings = {
        bionicReading: true,
        increasedSpacing: true,
        tintedBackground: 'beige',
        fontSize: 'large',
      }

      saveReadingModeSettings(settings)

      const stored = localStorage.getItem(READING_MODE_STORAGE_KEY)
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toEqual(settings)
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem')
      mockSetItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      saveReadingModeSettings(defaultReadingModeSettings)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save reading mode settings:',
        expect.any(Error),
      )

      mockSetItem.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('loadReadingModeSettings', () => {
    it('should return default settings when nothing is stored', () => {
      const settings = loadReadingModeSettings()
      expect(settings).toEqual(defaultReadingModeSettings)
    })

    it('should load settings from localStorage', () => {
      const settings: ReadingModeSettings = {
        bionicReading: true,
        increasedSpacing: true,
        tintedBackground: 'blue',
        fontSize: 'xlarge',
      }

      localStorage.setItem(READING_MODE_STORAGE_KEY, JSON.stringify(settings))

      const loaded = loadReadingModeSettings()
      expect(loaded).toEqual(settings)
    })

    it('should validate boolean fields', () => {
      localStorage.setItem(
        READING_MODE_STORAGE_KEY,
        JSON.stringify({
          bionicReading: 'invalid',
          increasedSpacing: 1,
          tintedBackground: 'blue',
          fontSize: 'large',
        }),
      )

      const loaded = loadReadingModeSettings()
      expect(loaded.bionicReading).toBe(false)
      expect(loaded.increasedSpacing).toBe(false)
    })

    it('should validate tintedBackground field', () => {
      localStorage.setItem(
        READING_MODE_STORAGE_KEY,
        JSON.stringify({
          bionicReading: false,
          increasedSpacing: false,
          tintedBackground: 'invalid',
          fontSize: 'normal',
        }),
      )

      const loaded = loadReadingModeSettings()
      expect(loaded.tintedBackground).toBe('none')
    })

    it('should validate fontSize field', () => {
      localStorage.setItem(
        READING_MODE_STORAGE_KEY,
        JSON.stringify({
          bionicReading: false,
          increasedSpacing: false,
          tintedBackground: 'none',
          fontSize: 'invalid',
        }),
      )

      const loaded = loadReadingModeSettings()
      expect(loaded.fontSize).toBe('normal')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockGetItem = jest.spyOn(Storage.prototype, 'getItem')
      mockGetItem.mockImplementation(() => {
        throw new Error('Storage unavailable')
      })

      const settings = loadReadingModeSettings()
      expect(settings).toEqual(defaultReadingModeSettings)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load reading mode settings:',
        expect.any(Error),
      )

      mockGetItem.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should handle invalid JSON gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      localStorage.setItem(READING_MODE_STORAGE_KEY, 'invalid json')

      const settings = loadReadingModeSettings()
      expect(settings).toEqual(defaultReadingModeSettings)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('applyBionicReading', () => {
    it('should transform text with bionic reading', () => {
      const text = 'Hello world'
      const result = applyBionicReading(text)

      // Should apply bionic reading transformation (bolds part of words)
      expect(result).toContain('Hel')
      expect(result).toContain('wor')
    })

    it('should handle errors gracefully and return original text', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const text = 'Hello world'

      // Mock require to throw error
      jest.mock('text-vide', () => {
        throw new Error('Module not found')
      })

      const result = applyBionicReading(text)

      // Should return original text on error
      expect(result).toBe(text)

      consoleSpy.mockRestore()
    })
  })
})
