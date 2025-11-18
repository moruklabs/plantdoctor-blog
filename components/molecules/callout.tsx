import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

// Inline SVG icons to replace Lucide React
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  children: ReactNode
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const icons = {
    info: InfoIcon,
    warning: WarningIcon,
    success: SuccessIcon,
    error: ErrorIcon,
  }

  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900',
  }

  const Icon = icons[type]

  return (
    <Card className={`border-l-4 ${styles[type]}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Icon />
          <div className="flex-1">{children}</div>
        </div>
      </CardContent>
    </Card>
  )
}
