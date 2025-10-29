'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-safari border-b border-gray-200 safe-area-top">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group touch-target">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5 sm:p-2">
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
              </div>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PFH
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">Financial Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target">
              Home
            </Link>
            {user && (
              <>
                <Link href="/app" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target">
                  Dashboard
                </Link>
                <Link href="/app/financial" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target whitespace-nowrap">
                  Financial
                </Link>
              </>
            )}
            <a 
              href="https://mahmoud-mansy.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target"
            >
              About
            </a>
            
            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1.5 touch-target">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <span className="text-sm font-medium hidden xl:inline-block max-w-24 truncate">{getUserDisplayName()}</span>
                    <ChevronDown className="h-4 w-4 hidden xl:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="sm" asChild className="touch-target">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 touch-target whitespace-nowrap" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg touch-target transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-safari">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link 
                    href="/app" 
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/app/financial" 
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Financial Management
                  </Link>
                </>
              )}
              <a 
                href="https://mahmoud-mansy.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors touch-target py-2"
              >
                About
              </a>
              
              {/* Mobile Auth Section */}
              {loading ? (
                <div className="w-full h-12 rounded bg-gray-200 animate-pulse mt-4" />
              ) : user ? (
                <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-base font-medium">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-sm text-gray-600 truncate max-w-48">{user.email}</p>
                    </div>
                  </div>
                  <Link 
                    href="/profile" 
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-3 touch-target py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-3 touch-target py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <Button 
                    variant="outline" 
                    size="default" 
                    onClick={handleSignOut}
                    className="justify-start text-red-600 border-red-200 hover:bg-red-50 touch-target mt-2"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="default" asChild className="touch-target">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button size="default" className="bg-gradient-to-r from-blue-600 to-purple-600 touch-target" asChild>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
