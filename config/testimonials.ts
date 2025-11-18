export interface Testimonial {
  id: string
  name: string
  age: number
  text: string
  rating: number
  location?: string
  icon?: string
  achievement?: string
  plantType?: string // Type of plant they care for
}

export const TESTIMONIALS_COPY = {
  title: 'Success Stories from Plant Parents',
  lead: `Discover how Plant Doctor has helped thousands of plant enthusiasts save their green friends, diagnose diseases accurately, and build thriving indoor gardens with expert care guidance.`,
} as const

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Emma Chen',
    age: 35,
    text: `I thought I had a black thumb until I discovered Plant Doctor. The AI diagnosis saved my fiddle leaf fig that was dying from root rot - the detection was instant and spot-on. The personalized care schedules ensure I never forget to water again, and my collection has never looked healthier. It's like having a botanist available 24/7.`,
    rating: 5,
    location: 'San Francisco, CA',
    icon: '🌿',
    achievement: 'Saved 12 dying plants',
    plantType: 'Fiddle Leaf Fig',
  },
  {
    id: '2',
    name: 'David Martinez',
    age: 42,
    text: `Plant Doctor turned my hobby into a thriving indoor jungle. The species identification feature helped me understand each plant's unique needs, and the AI caught early signs of spider mites before they spread. The expert treatment recommendations are clear and effective - my monstera has grown 3 feet in just 4 months!`,
    rating: 5,
    location: 'Austin, TX',
    icon: '🪴',
    achievement: '50+ healthy plants',
    plantType: 'Monstera Deliciosa',
  },
  {
    id: '3',
    name: 'Sarah Thompson',
    age: 28,
    text: `As a beginner plant parent, I was overwhelmed by conflicting advice online. Plant Doctor's photo diagnosis eliminated the guesswork - I learned my yellowing pothos had nitrogen deficiency, not overwatering. The app's care guides are science-backed and easy to follow. Now my apartment is a green oasis!`,
    rating: 5,
    location: 'Seattle, WA',
    icon: '🌱',
    achievement: 'Zero plant losses in 6 months',
    plantType: 'Golden Pothos',
  },
  {
    id: '4',
    name: 'Michael Kim',
    age: 39,
    text: `Plant Doctor's pest identification saved my entire succulent collection. The app correctly diagnosed mealybugs when I thought it was just dust, and the treatment protocol worked perfectly. The proactive care tips have prevented problems before they start. My cacti have never been healthier or bloomed more beautifully.`,
    rating: 5,
    location: 'Phoenix, AZ',
    icon: '🌵',
    achievement: 'Pest-free for 8 months',
    plantType: 'Succulent Collection',
  },
  {
    id: '5',
    name: 'Lisa Johnson',
    age: 31,
    text: `The Plant Doctor blog's IPM strategies for fungus gnats were a game-changer. I followed the 4-week BTI protocol from their guide, and my infestation was completely gone. The detailed troubleshooting helped me identify my watering mistakes. Now I confidently care for 30+ houseplants without pest issues.`,
    rating: 5,
    location: 'Portland, OR',
    icon: '🦟',
    achievement: 'Eliminated fungus gnats',
    plantType: 'Mixed Houseplants',
  },
  {
    id: '6',
    name: 'James Rodriguez',
    age: 45,
    text: `After retiring, I wanted to grow orchids but found them intimidating. Plant Doctor's orchid care guides broke everything down into simple steps. The AI diagnosed root rot early when I was overwatering, and the recovery protocol saved my phalaenopsis. Now I have 15 orchids blooming year-round!`,
    rating: 5,
    location: 'Miami, FL',
    icon: '🌺',
    achievement: '15 orchids thriving',
    plantType: 'Phalaenopsis Orchids',
  },
]
