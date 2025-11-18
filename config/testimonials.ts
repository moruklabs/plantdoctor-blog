export interface Testimonial {
  id: string
  name: string
  age: number
  text: string
  rating: number
  platform?: string
  icon?: string
  achievement?: string
  appSlug?: string // Link to app page
}

export const TESTIMONIALS_COPY = {
  title: 'What Our Users Are Saying',
  lead: `Discover how our apps are helping real people improve their wellness, productivity, and daily life. From mindfulness to plant care, see the impact of AI-powered solutions.`,
} as const

export const TESTIMONIALS: Testimonial[] = [
  // Breathe Easy testimonial
  {
    id: '1',
    name: 'Sarah',
    age: 32,
    text: `I've struggled with anxiety for years, trying countless meditation apps that never stuck. Breathe Easy is different - the guided breathing exercises are scientifically grounded and actually work. Within two weeks, my stress levels dropped noticeably. The personalized programs adapt to my needs, and I finally feel in control of my mental wellness.`,
    rating: 5,
    platform: 'iOS',
    icon: '🧘',
    achievement: 'Reduced anxiety 60%',
    appSlug: 'breathe-easy',
  },
  // Minday testimonial
  {
    id: '2',
    name: 'Marcus',
    age: 28,
    text: `As someone with ADHD, most productivity apps overwhelm me with features I'll never use. Minday's minimalist approach is a game-changer. Focusing on just 3 main tasks per day keeps me on track without the stress. The distraction-free interface helps me stay present, and I've accomplished more in the past month than in the previous six.`,
    rating: 5,
    platform: 'Android',
    icon: '✅',
    achievement: '3x productivity boost',
    appSlug: 'minday',
  },
  // Plant Doctor testimonial 1
  {
    id: '3',
    name: 'Emma',
    age: 35,
    text: `I thought I had a black thumb until I found Plant Doctor. The AI disease detection saved my fiddle leaf fig that was dying from root rot - the diagnosis was instant and accurate. The personalized care schedules ensure I never forget to water again, and my plants have never looked healthier. It's like having a botanist in my pocket.`,
    rating: 5,
    platform: 'iOS',
    icon: '🌿',
    achievement: 'Saved 12 dying plants',
    appSlug: 'plant-doctor',
  },
  // Rizzman testimonial
  {
    id: '4',
    name: 'Alex',
    age: 26,
    text: `Dating apps used to stress me out - I'd spend 20 minutes crafting opening lines that got ignored. Rizzman's AI conversation coach completely changed my approach. The suggestions feel authentic and actually match my personality. My response rate jumped from 15% to 70%, and conversations naturally lead to real dates now instead of dying out.`,
    rating: 5,
    platform: 'Web',
    icon: '💬',
    achievement: '70% response rate',
    appSlug: 'rizzman',
  },
  // Text Pro testimonial
  {
    id: '5',
    name: 'Jordan',
    age: 30,
    text: `As a non-native English speaker, professional emails were my biggest challenge at work. Text Pro doesn't just fix grammar - it helps me understand why changes are needed and adapts to my writing style. My emails now sound confident and professional, and I've received compliments from colleagues who noticed the improvement.`,
    rating: 5,
    platform: 'Browser Extension',
    icon: '✍️',
    achievement: 'Perfect professional writing',
    appSlug: 'text-pro',
  },
  // Plant Doctor testimonial 2
  {
    id: '6',
    name: 'David',
    age: 42,
    text: `Plant Doctor turned my hobby into a thriving indoor garden. The species identification feature helped me understand each plant's unique needs, and the AI caught early signs of pests before they became a problem. The expert treatment recommendations are clear and effective - my monstera has grown 3 feet in 4 months!`,
    rating: 5,
    platform: 'Android',
    icon: '🪴',
    achievement: 'Garden thriving',
    appSlug: 'plant-doctor',
  },
]
