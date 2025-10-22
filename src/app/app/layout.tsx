import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Portfolio Views',
  description: 'Manage your portfolio with interactive views: Bubble Chart, Kanban Board, Process Map, Table, Calendar, and List. Drag-and-drop tasks, export data, and visualize priorities.',
  openGraph: {
    title: 'PPH Dashboard - Portfolio Management Views',
    description: 'Access all 6 visualization modes for your portfolio management',
    url: 'https://pph.vercel.app/app',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
