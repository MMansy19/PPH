import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Authentication - PFH',
    template: '%s - PFH'
  },
  description: 'Sign in or create an account for Portfolio Financial Hub',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}