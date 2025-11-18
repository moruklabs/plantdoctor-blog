/**
 * Guide-specific structured data generators
 *
 * This module contains custom structured data logic for specific guides.
 * Implements HowTo and FAQ schemas for all 6 major hub guides.
 * TODO(#191): Refactor to dynamically parse HowTo and FAQ content from MDX files
 */

import type { PostFrontmatter } from '@/lib/content/mdx-processor'
import { createStructuredData } from '@/lib/content/content-utils'
import { blogConfig } from '@/config'

/**
 * Generate structured data for Productivity & Wellness Mastery guide
 */
function getProductivityWellnessGuideStructuredData(
  frontmatter: PostFrontmatter,
): Record<string, unknown> {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Master Productivity & Wellness Techniques',
    description:
      'Science-backed techniques for peak performance through breathing, focus optimization, and energy management',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Learn Core Breathing Techniques',
        text: 'Master foundational breathing protocols that regulate your nervous system. Start with the 6-minute morning breath circuit to establish baseline awareness.',
      },
      {
        '@type': 'HowToStep',
        name: 'Implement Energy Management',
        text: 'Combat the 3pm energy crash with strategic micro-breaks and the Coherent Coffee Swap breath technique.',
      },
      {
        '@type': 'HowToStep',
        name: 'Apply Workplace Stress Management',
        text: 'Use 5-minute metta meditation and 3-minute meeting detox techniques to handle difficult interactions.',
      },
      {
        '@type': 'HowToStep',
        name: 'Optimize Your Workspace',
        text: 'Engineer your workspace for sustained attention through monitor positioning, lighting, and breathing zones.',
      },
      {
        '@type': 'HowToStep',
        name: 'Layer Advanced Techniques',
        text: 'Progress to advanced diaphragmatic breathing cadences and coherent breathing optimization once basics are established.',
      },
      {
        '@type': 'HowToStep',
        name: 'Maintain Consistency',
        text: 'Start with your biggest pain point and commit to a 7-day implementation challenge before adding new techniques.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does it take to see productivity improvements?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most people notice improved focus within 3-5 days of consistent breathing practice. Sustained energy improvements typically appear within 2-3 weeks of daily implementation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I combine multiple breathing techniques?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, but start with one technique for a week before layering others. This prevents overwhelm and helps you identify which techniques work best for your physiology.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is breathing training better than caffeine?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Breathing techniques provide sustained energy without the crash associated with caffeine. They also build long-term resilience, whereas caffeine is a temporary fix.',
        },
      },
      {
        '@type': 'Question',
        name: 'What workspace changes have the biggest impact?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monitor positioning at eye level and warm lighting (3000K color temperature) provide the fastest improvements. Add these before reorganizing your entire workspace.',
        },
      },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.meta_desc,
        datePublished: frontmatter.date,
        author: {
          '@type': 'Organization',
          name: blogConfig.site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: blogConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: blogConfig.site.url + '/favicon.svg',
          },
        },
        articleSection: 'Productivity & Wellness',
        keywords: frontmatter.tags.join(', '),
      },
      howToSchema,
      faqSchema,
    ],
  }
}

/**
 * Generate structured data for Pet Care & Nutrition guide
 */
function getPetCareGuideStructuredData(frontmatter: PostFrontmatter): Record<string, unknown> {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Optimize Pet Care & Nutrition',
    description:
      'Complete guide to pet health, nutrition, and training for dogs, cats, and other animals',
    step: [
      {
        '@type': 'HowToStep',
        name: "Assess Your Pet's Current Health",
        text: 'Start with a veterinary checkup to establish baseline health metrics and identify any dietary needs or restrictions.',
      },
      {
        '@type': 'HowToStep',
        name: 'Choose Optimal Nutrition',
        text: 'Select feed based on species, age, and health status. Consider fresh, balanced diets and appropriate supplementation.',
      },
      {
        '@type': 'HowToStep',
        name: 'Establish Training Foundations',
        text: 'Build consistent training routines using evidence-based techniques. Start with basic commands before advancing.',
      },
      {
        '@type': 'HowToStep',
        name: 'Implement Health Monitoring',
        text: 'Track weight, energy levels, coat condition, and behavior changes. Regular monitoring helps catch issues early.',
      },
      {
        '@type': 'HowToStep',
        name: 'Create Environmental Enrichment',
        text: "Provide appropriate toys, space, and stimulation based on your pet's species and personality.",
      },
      {
        '@type': 'HowToStep',
        name: 'Schedule Regular Veterinary Care',
        text: 'Maintain annual checkups, vaccinations, and preventive treatments. Address health concerns promptly.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I know if my pet has the right diet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Healthy pets should have shiny coats, consistent energy, appropriate weight, and normal digestion. Work with your veterinarian to assess if dietary changes would benefit your pet.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often should I train my pet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Short training sessions (5-10 minutes) several times daily work better than long sessions. Consistency matters more than duration.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are signs of nutritional deficiency?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Common signs include dull coat, low energy, digestive issues, and behavioral changes. Have your vet evaluate if you notice these symptoms.',
        },
      },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.meta_desc,
        datePublished: frontmatter.date,
        author: {
          '@type': 'Organization',
          name: blogConfig.site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: blogConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: blogConfig.site.url + '/favicon.svg',
          },
        },
        articleSection: 'Pet Care',
        keywords: frontmatter.tags.join(', '),
      },
      howToSchema,
      faqSchema,
    ],
  }
}

/**
 * Generate structured data for DIY Maintenance & Optimization guide
 */
function getDIYMaintenanceGuideStructuredData(
  frontmatter: PostFrontmatter,
): Record<string, unknown> {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Master DIY Maintenance & Optimization',
    description:
      'Complete guide to car, home, garden, and plant maintenance for optimal performance',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Assess Current Maintenance State',
        text: 'Evaluate your vehicle, home, garden, and plants for current condition. Identify priority maintenance tasks.',
      },
      {
        '@type': 'HowToStep',
        name: 'Establish Maintenance Schedule',
        text: 'Create a preventive maintenance schedule for your assets. Regular maintenance prevents expensive repairs.',
      },
      {
        '@type': 'HowToStep',
        name: 'Learn Essential Techniques',
        text: 'Master basic DIY skills relevant to your assets. Start with simple tasks before advancing to complex ones.',
      },
      {
        '@type': 'HowToStep',
        name: 'Gather Proper Tools',
        text: 'Invest in quality tools appropriate for your maintenance needs. Proper tools make tasks easier and safer.',
      },
      {
        '@type': 'HowToStep',
        name: 'Implement Preventive Care',
        text: 'Follow seasonal maintenance checklists to prevent deterioration and costly repairs.',
      },
      {
        '@type': 'HowToStep',
        name: 'Track Maintenance History',
        text: 'Document all maintenance performed. This helps identify patterns and increases asset value.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How often should I perform vehicle maintenance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Follow your manufacturer's recommended service intervals. Most vehicles need oil changes every 5,000-7,500 miles and comprehensive maintenance annually.",
        },
      },
      {
        '@type': 'Question',
        name: 'What garden maintenance is essential?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Watering, weeding, and seasonal pruning are fundamental. Add composting and soil amendment to maximize plant health.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I do major home repairs myself?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with minor repairs to build skills. Complex electrical, plumbing, and structural work should be done by professionals for safety and warranty reasons.',
        },
      },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.meta_desc,
        datePublished: frontmatter.date,
        author: {
          '@type': 'Organization',
          name: blogConfig.site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: blogConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: blogConfig.site.url + '/favicon.svg',
          },
        },
        articleSection: 'DIY & Maintenance',
        keywords: frontmatter.tags.join(', '),
      },
      howToSchema,
      faqSchema,
    ],
  }
}

/**
 * Generate structured data for AI Tools & Content Creation guide
 */
function getAIToolsGuideStructuredData(frontmatter: PostFrontmatter): Record<string, unknown> {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Master AI Tools & Content Creation',
    description:
      'Complete guide to AI image generation, advanced prompting techniques, and monetizing AI-generated content',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choose Your AI Tools',
        text: 'Select 1-2 text-to-image AI platforms based on your use case. Popular options include Midjourney, DALL-E, and Stable Diffusion.',
      },
      {
        '@type': 'HowToStep',
        name: 'Create Test Images',
        text: 'Generate 10 test images to understand how each tool responds to different prompts and parameters.',
      },
      {
        '@type': 'HowToStep',
        name: 'Master Prompt Engineering',
        text: 'Learn advanced prompting techniques including style descriptors, composition keywords, and quality modifiers.',
      },
      {
        '@type': 'HowToStep',
        name: 'Identify Your Niche',
        text: 'Determine your target market and ideal customer. Choose a specific niche rather than competing in general categories.',
      },
      {
        '@type': 'HowToStep',
        name: 'Create Your First Product',
        text: 'Produce a complete product: image bundle, template pack, or digital asset for sale.',
      },
      {
        '@type': 'HowToStep',
        name: 'Scale Your Business',
        text: 'Implement marketing, customer service, and fulfillment systems to grow from hobby to sustainable income.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is AI-generated content legal to sell?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, content generated by AI tools you have access to is typically yours to use commercially. Always check the specific terms of service for your AI tool.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I write effective AI prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Include specific style descriptors, composition details, lighting conditions, and quality modifiers. Be descriptive but concise—test and iterate on results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What niches are most profitable?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Niches with clear customer pain points like pet portraits, product mockups, and niche-specific templates typically perform well. Choose a niche with existing demand.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much can I earn from AI content?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Income varies widely. Bundle sales range from $10-50, templates $15-100, and digital products $25-200+. Volume and marketing determine total revenue.',
        },
      },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.meta_desc,
        datePublished: frontmatter.date,
        author: {
          '@type': 'Organization',
          name: blogConfig.site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: blogConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: blogConfig.site.url + '/favicon.svg',
          },
        },
        articleSection: 'AI Tools & Content Creation',
        keywords: frontmatter.tags.join(', '),
      },
      howToSchema,
      faqSchema,
    ],
  }
}

/**
 * Generate structured data for Habit Building & Behavior Change guide
 */
function getHabitBuildingGuideStructuredData(
  frontmatter: PostFrontmatter,
): Record<string, unknown> {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Master Habit Building & Behavior Change',
    description:
      'Complete guide to building sustainable micro-habits and achieving lasting behavior change',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Identify Your Target Behavior',
        text: 'Choose one specific behavior you want to build or change. Make it concrete and measurable.',
      },
      {
        '@type': 'HowToStep',
        name: 'Start with Micro-Habits',
        text: 'Break the habit into tiny 2-minute versions. Small wins build momentum and prevent overwhelm.',
      },
      {
        '@type': 'HowToStep',
        name: 'Find Your Motivation Anchor',
        text: 'Link the new habit to an existing daily routine. Attach new behaviors to established habits for consistency.',
      },
      {
        '@type': 'HowToStep',
        name: 'Track Your Progress',
        text: 'Use a simple system (checklist, app, calendar) to track daily completion. Visibility drives consistency.',
      },
      {
        '@type': 'HowToStep',
        name: 'Celebrate Small Wins',
        text: 'Reward yourself after each successful day. Positive reinforcement strengthens neural pathways.',
      },
      {
        '@type': 'HowToStep',
        name: 'Gradually Increase Difficulty',
        text: 'Once the habit sticks (21-66 days), slowly add complexity or duration. Build sustainable progression.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does it take to build a habit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Research shows 21-66 days on average, depending on complexity. Simple habits form faster; complex behaviors take longer.',
        },
      },
      {
        '@type': 'Question',
        name: 'What do I do if I miss a day?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Missing occasionally is normal. Resume immediately the next day. The key is not breaking the streak for more than 2 consecutive days.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I build multiple habits simultaneously?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Avoid building more than 2-3 habits at once. Each habit demands willpower. Sequential habit building is more sustainable.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I overcome motivation dips?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Motivation naturally fluctuates. Rely on your habit anchor (the daily routine) and system (tracking) rather than motivation alone.',
        },
      },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.meta_desc,
        datePublished: frontmatter.date,
        author: {
          '@type': 'Organization',
          name: blogConfig.site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: blogConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: blogConfig.site.url + '/favicon.svg',
          },
        },
        articleSection: 'Habit Building',
        keywords: frontmatter.tags.join(', '),
      },
      howToSchema,
      faqSchema,
    ],
  }
}

/**
 * Generate structured data for Business Templates & Monetization guide
 */
function getBusinessTemplatesGuideStructuredData(
  frontmatter: PostFrontmatter,
): Record<string, unknown> {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Master Business Templates & Monetization',
    description:
      'Complete guide to creating, selling, and scaling business templates, invoices, proposals, and digital products',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choose Your Template Category',
        text: 'Select a business template category with clear demand: invoices, proposals, contracts, or project management templates.',
      },
      {
        '@type': 'HowToStep',
        name: 'Create Your First Template',
        text: 'Build a single, polished template addressing a specific business problem. Make it visually appealing and immediately usable.',
      },
      {
        '@type': 'HowToStep',
        name: 'Identify Your Target Market',
        text: 'Determine which professionals or business types will benefit most. Tailor templates to their specific needs.',
      },
      {
        '@type': 'HowToStep',
        name: 'Set Up Sales Infrastructure',
        text: 'Choose a platform (Gumroad, Etsy, your own website) and implement payment processing.',
      },
      {
        '@type': 'HowToStep',
        name: 'Create Product Bundles',
        text: 'Group related templates together. Bundles increase average order value and customer satisfaction.',
      },
      {
        '@type': 'HowToStep',
        name: 'Scale with Marketing',
        text: 'Use targeted ads, content marketing, and email to reach your audience. Reinvest revenue into growth.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What business templates sell best?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Invoices, proposals, and contracts are consistently popular. Niche-specific templates (real estate, consulting) also perform well when well-executed.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much should I charge for templates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pricing typically ranges $5-30 per template, $15-50 for bundles, and $20-100 for comprehensive template systems. Test different prices.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I sell templates on multiple platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Selling on Gumroad, Etsy, your website, and other platforms diversifies income and reaches different audiences.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many templates do I need for sustainable income?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quality matters more than quantity. 5-10 high-quality, well-marketed templates can generate $1000+/month with proper promotion.',
        },
      },
    ],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: frontmatter.title,
        description: frontmatter.meta_desc,
        datePublished: frontmatter.date,
        author: {
          '@type': 'Organization',
          name: blogConfig.site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: blogConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: blogConfig.site.url + '/favicon.svg',
          },
        },
        articleSection: 'Business & Monetization',
        keywords: frontmatter.tags.join(', '),
      },
      howToSchema,
      faqSchema,
    ],
  }
}

/**
 * Get custom structured data for a specific guide
 *
 * @param frontmatter - Validated frontmatter
 * @param slug - Guide slug
 * @returns Custom structured data with HowTo and FAQ schemas
 */
export function getGuideStructuredData(
  frontmatter: PostFrontmatter,
  slug: string,
): Record<string, unknown> {
  // Custom structured data for specific guides
  switch (slug) {
    case 'productivity-and-wellness-mastery':
      return getProductivityWellnessGuideStructuredData(frontmatter)
    case 'pet-care-and-nutrition-guide':
      return getPetCareGuideStructuredData(frontmatter)
    case 'diy-maintenance-and-optimization':
      return getDIYMaintenanceGuideStructuredData(frontmatter)
    case 'ai-tools-content-creation-mastery':
      return getAIToolsGuideStructuredData(frontmatter)
    case 'habit-building-and-behavior-change':
      return getHabitBuildingGuideStructuredData(frontmatter)
    case 'business-templates-monetization':
      return getBusinessTemplatesGuideStructuredData(frontmatter)
    default:
      // Default Article schema for any other guides
      return createStructuredData(
        {
          directory: 'guides',
          pathPrefix: 'guides',
          schemaType: 'Article',
          schemaExtras: {
            articleSection: 'Guides',
            keywords: frontmatter.tags.join(', '),
          },
        },
        frontmatter,
      )
  }
}
