import { featureToggles, isFeatureEnabled, type FeatureToggles } from '@/lib/feature-toggles'

describe('featureToggles', () => {
  describe('structure and completeness', () => {
    it('should have all required top-level features', () => {
      expect(featureToggles).toHaveProperty('guides')
      expect(featureToggles).toHaveProperty('tips')
      expect(featureToggles).toHaveProperty('testimonials')
    })

    it('should have guides feature', () => {
      expect(featureToggles.guides).toHaveProperty('enabled')
      expect(typeof featureToggles.guides.enabled).toBe('boolean')
    })

    it('should have blog feature', () => {
      expect(featureToggles.tips).toHaveProperty('enabled')
      expect(typeof featureToggles.tips.enabled).toBe('boolean')
    })

    it('should have testimonials feature', () => {
      expect(featureToggles.testimonials).toHaveProperty('enabled')
      expect(typeof featureToggles.testimonials.enabled).toBe('boolean')
    })
  })

  describe('default values', () => {
    it('should have core features enabled by default', () => {
      expect(featureToggles.guides.enabled).toBe(true)
      expect(featureToggles.tips.enabled).toBe(true)
      expect(featureToggles.testimonials.enabled).toBe(true)
    })
  })
})

describe('isFeatureEnabled', () => {
  describe('top-level features', () => {
    it('should return true for enabled top-level features', () => {
      expect(isFeatureEnabled('guides')).toBe(true)
      expect(isFeatureEnabled('tips')).toBe(true)
    })

    it('should return false when top-level feature is disabled', () => {
      const originalValue = featureToggles.guides.enabled
      featureToggles.guides.enabled = false

      expect(isFeatureEnabled('guides')).toBe(false)

      // Restore original value
      featureToggles.guides.enabled = originalValue
    })
  })

  describe('invalid paths', () => {
    it('should return false for non-existent feature paths', () => {
      expect(isFeatureEnabled('nonExistentFeature')).toBe(false)
      expect(isFeatureEnabled('guides.nonExistentProperty')).toBe(false)
    })

    it('should return false for empty path', () => {
      expect(isFeatureEnabled('')).toBe(false)
    })
  })
})

describe('TypeScript type safety', () => {
  it('should export proper TypeScript types', () => {
    // This test ensures TypeScript compilation succeeds with proper types
    const toggles: FeatureToggles = featureToggles
    expect(toggles).toBeDefined()
  })
})
