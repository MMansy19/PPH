'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto safe-area-bottom">
      <div className="container-responsive py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="PFHub Logo" 
                  width={48}
                  height={48}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Portfolio Financial Hub</h3>
                <p className="text-xs sm:text-sm text-gray-400">Organize. Visualize. Execute.</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              A powerful portfolio management and financial tracking tool to visualize, track, and optimize your projects with interactive charts, data tables, and comprehensive financial analytics.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Product</h4>
            <ul className="space-y-0">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm touch-target block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-gray-400 hover:text-white transition-colors text-sm touch-target block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/app/financial" className="text-gray-400 hover:text-white transition-colors text-sm touch-target block">
                  Financial Analytics
                </Link>
              </li>
              <li>
                <Link href="/app/settings" className="text-gray-400 hover:text-white transition-colors text-sm touch-target block">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-0">
              <li>
                <a 
                  href="https://mahmoud-mansy.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 touch-target"
                >
                  Documentation <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/MMansy19/PPH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 touch-target"
                >
                  GitHub Repository <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/MMansy19/PPH#readme" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 touch-target"
                >
                  Getting Started <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/MMansy19/PPH/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 touch-target"
                >
                  Support <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Author Section */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Developed By</h4>
            <div className="space-y-3">
              <a 
                href="https://mahmoud-mansy.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group touch-target"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                  MM
                </div>
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">Mahmoud Mansy</p>
                  <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">
                    Full Stack Developer
                  </p>
                </div>
              </a>
              
              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                <a 
                  href="https://github.com/MMansy19" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors touch-target"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a 
                href="https://www.linkedin.com/in/mahmood-mansy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors touch-target"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a 
                  href="mailto:mahmoud2abdalfattah@gmail.com" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors touch-target"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-4 sm:mt-6 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} Personal Process Hub. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
            <a 
              href="https://github.com/MMansy19/PPH/blob/main/LICENSE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors touch-target"
            >
              Privacy Policy
            </a>
            <a 
              href="https://github.com/MMansy19/PPH/blob/main/LICENSE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors touch-target"
            >
              Terms of Service
            </a>
            <a 
              href="mailto:mahmoud2abdalfattah@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors touch-target"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
