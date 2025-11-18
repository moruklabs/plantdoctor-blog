// Mock lucide-react icons for Jest tests
const React = require('react')

// Create a generic icon component that can be used for all lucide icons
const createMockIcon = (displayName) => {
  const MockIcon = (props) => {
    return React.createElement('svg', {
      'data-testid': `lucide-${displayName}`,
      ...props,
    })
  }
  MockIcon.displayName = displayName
  return MockIcon
}

// Export commonly used icons
module.exports = {
  Menu: createMockIcon('Menu'),
  X: createMockIcon('X'),
  Sun: createMockIcon('Sun'),
  Moon: createMockIcon('Moon'),
  ChevronDown: createMockIcon('ChevronDown'),
  ChevronUp: createMockIcon('ChevronUp'),
  ChevronLeft: createMockIcon('ChevronLeft'),
  ChevronRight: createMockIcon('ChevronRight'),
  Mail: createMockIcon('Mail'),
  Phone: createMockIcon('Phone'),
  MapPin: createMockIcon('MapPin'),
  Calendar: createMockIcon('Calendar'),
  Clock: createMockIcon('Clock'),
  User: createMockIcon('User'),
  Users: createMockIcon('Users'),
  Heart: createMockIcon('Heart'),
  Star: createMockIcon('Star'),
  Check: createMockIcon('Check'),
  AlertCircle: createMockIcon('AlertCircle'),
  Info: createMockIcon('Info'),
  Search: createMockIcon('Search'),
  Settings: createMockIcon('Settings'),
  Share: createMockIcon('Share'),
  Share2: createMockIcon('Share2'),
  Facebook: createMockIcon('Facebook'),
  Twitter: createMockIcon('Twitter'),
  Linkedin: createMockIcon('Linkedin'),
  Instagram: createMockIcon('Instagram'),
  Github: createMockIcon('Github'),
  ExternalLink: createMockIcon('ExternalLink'),
  ArrowRight: createMockIcon('ArrowRight'),
  ArrowLeft: createMockIcon('ArrowLeft'),
  Download: createMockIcon('Download'),
  Upload: createMockIcon('Upload'),
  Plus: createMockIcon('Plus'),
  Minus: createMockIcon('Minus'),
  Trash: createMockIcon('Trash'),
  Edit: createMockIcon('Edit'),
  Copy: createMockIcon('Copy'),
  Eye: createMockIcon('Eye'),
  EyeOff: createMockIcon('EyeOff'),
  Lock: createMockIcon('Lock'),
  Unlock: createMockIcon('Unlock'),
  Loader: createMockIcon('Loader'),
  Loader2: createMockIcon('Loader2'),
}
