import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Authentication - PFHub',
    template: '%s - PFHub'
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