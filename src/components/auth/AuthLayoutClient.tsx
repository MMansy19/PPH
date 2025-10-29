'use client'

import Image from 'next/image'

export function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Animated blobs */}
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative bg-white p-3 rounded-xl shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={64}
                height={64}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        {children}
      </div>
    </div>
  )
}
