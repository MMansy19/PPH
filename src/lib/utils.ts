import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDuration(str: string): number {
  const match = str.match(/(\d+)w|(\d+)d|(\d+)h/g)
  if (!match) return 0
  return match.reduce((sum, m) => {
    const num = parseInt(m)
    if (m.includes('w')) return sum + num * 7
    if (m.includes('d')) return sum + num
    return sum + num / 24
  }, 0)
}

// PORTFOLIO BUBBLE CHART COLORS (EXACT MATCH)
export const CATEGORY_COLORS = {
  big_bets: '#10B981',      // Green
  line_extensions: '#F59E0B', // Orange  
  ltos: '#3B82F6',          // Blue
  other: '#EF4444'          // Red
} as const

// Export functions
export async function exportToPNG(element: HTMLElement) {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(element, { scale: 2 })
  const link = document.createElement('a')
  link.download = 'pfhub-portfolio.png'
  link.href = canvas.toDataURL()
  link.click()
}

export async function exportToSVG(flowRef: any) {
  if (!flowRef.current) return
  const svg = flowRef.current.getSvg()
  const link = document.createElement('a')
  link.download = 'pfhub-flow.svg'
  link.href = 'data:image/svg+xml;base64,' + btoa(svg.outerHTML)
  link.click()
}
