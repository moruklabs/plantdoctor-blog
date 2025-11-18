export interface CTAVariant {
  title: string
  description: string
  ctaText: string
  href: string
}

export const CTA_VARIANTS: Record<string, CTAVariant> = {
  // Default fallback
  default: {
    title: 'Ready to Diagnose Your Plant Problems?',
    description:
      'Get instant AI-powered plant disease diagnosis, care schedules, and expert treatment recommendations. Identify plants, recognize breeds, and save your green friends.',
    ctaText: 'Download Plant Doctor App',
    href: 'https://moruk.link/plantdoctor?utm_source=news.plantdoctor.app&utm_medium=referral&utm_campaign=guide-cta',
  },
  // Pests & Diseases
  pests: {
    title: 'Spot Pests Before They Spread?',
    description:
      'Instantly identify pests and diseases with a single photo. Get expert treatment plans to save your plants from fungus gnats, mites, and more.',
    ctaText: 'Diagnose Your Plant Now',
    href: 'https://moruk.link/plantdoctor?utm_source=news.plantdoctor.app&utm_medium=referral&utm_campaign=guide-cta-pest',
  },
  // Pet Safety
  pets: {
    title: 'Is This Plant Safe for Your Pets?',
    description:
      'Check toxicity instantly. Our AI identifies toxic plants and suggests pet-safe alternatives to keep your cats and dogs safe.',
    ctaText: 'Check Plant Toxicity',
    href: 'https://moruk.link/plantdoctor?utm_source=news.plantdoctor.app&utm_medium=referral&utm_campaign=guide-cta-pet',
  },
  // General Care / Identification
  care: {
    title: 'Never Kill Another Houseplant',
    description:
      'Get personalized watering schedules, light recommendations, and care reminders tailored to your specific plants.',
    ctaText: 'Get Your Care Schedule',
    href: 'https://moruk.link/plantdoctor?utm_source=news.plantdoctor.app&utm_medium=referral&utm_campaign=guide-cta-care',
  },
}

export function getCTAVariant(tags: string[] = []): CTAVariant {
  const lowerTags = tags.map((t) => t.toLowerCase())

  // Check for pests/diseases
  if (
    lowerTags.some((t) =>
      [
        'pest',
        'pests',
        'disease',
        'fungus',
        'mite',
        'gnat',
        'infection',
        'rot',
        'mildew',
        'bug',
      ].some((k) => t.includes(k)),
    )
  ) {
    return CTA_VARIANTS.pests
  }

  // Check for pet safety
  if (
    lowerTags.some((t) =>
      ['pet', 'cat', 'dog', 'toxic', 'poison', 'safe'].some((k) => t.includes(k)),
    )
  ) {
    return CTA_VARIANTS.pets
  }

  // Check for general care/identification
  if (
    lowerTags.some((t) =>
      ['care', 'water', 'light', 'soil', 'repot', 'identify', 'breed', 'name'].some((k) =>
        t.includes(k),
      ),
    )
  ) {
    return CTA_VARIANTS.care
  }

  return CTA_VARIANTS.default
}
