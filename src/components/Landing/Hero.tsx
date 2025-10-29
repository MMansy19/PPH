'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, PieChart, BarChart3, Map } from 'lucide-react'

export function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center safe-area-top safe-area-bottom">
      <div className="container-responsive py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-12">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-balance">
              Personal Process Hub
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto text-balance leading-relaxed">
              Visualize your portfolio with <span className="font-semibold text-purple-600">Bubble Charts</span> • 
              Organize with <span className="font-semibold text-blue-600">Boards</span> • 
              Track with <span className="font-semibold text-pink-600">Maps</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <PieChart className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600 text-base sm:text-lg">Portfolio View</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  15 colored bubbles in quadrants: Big Bets, Line Extensions, LTOs, Other
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600 text-base sm:text-lg">Multiple Views</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Switch between Board, Table, Map, Calendar, and List views instantly
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <Map className="h-10 w-10 sm:h-12 sm:w-12 text-pink-600" />
                </div>
                <CardTitle className="text-pink-600 text-base sm:text-lg">Process Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Visual workflow mapping with drag-and-drop process flows
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 touch-target w-full sm:w-auto">
              <Link href="/app">
                View Portfolio Chart
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/50">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-center">Big Bets (High Value, Low Risk)</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/50">
              <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-center">Line Extensions</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/50">
              <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
              <span className="text-center">LTOs</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/50">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-center">Other (High Risk)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 text-balance">
            No signup required • Export to PNG/SVG/PDF • Mobile responsive
          </p>
        </div>
      </div>
    </div>
  )
}
