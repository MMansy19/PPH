'use client'
import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                <svg 
                  className="w-6 h-6 text-white" 
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
              <div>
                <h3 className="text-xl font-bold">Personal Process Hub</h3>
                <p className="text-sm text-gray-400">Organize. Visualize. Execute.</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              A powerful portfolio management tool to visualize, track, and optimize your projects with interactive charts, data tables, and process maps.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <a 
                  href="https://mahmoud-mansy.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  Documentation <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Author Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Developed By</h4>
            <div className="space-y-3">
              <a 
                href="https://mahmoud-mansy.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                  MM
                </div>
                <div>
                  <p className="font-medium text-white">Mahmoud Mansy</p>
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
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a 
                  href="https://linkedin.com/in/mahmoud-mansy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a 
                  href="mailto:mahmoud.mansy@example.com" 
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Personal Process Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>by</span>
            <a 
              href="https://mahmoud-mansy.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mahmoud Mansy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
