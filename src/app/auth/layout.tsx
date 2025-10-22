import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Authentication - PPH',
    template: '%s - PPH'
  },
  description: 'Sign in or create an account for Personal Process Hub',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}