'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, PieChart, BarChart3, Map, DollarSign, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center safe-area-inset overflow-x-hidden">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto text-center spacing-responsive">
          {/* Hero Text Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-balance leading-tight px-2 sm:px-4">
              Portfolio Financial Hub
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto text-balance leading-relaxed px-4 sm:px-6">
              Visualize your portfolio with <span className="font-semibold text-purple-600">Bubble Charts</span>
              <span className="hidden sm:inline"> • </span>
              <br className="sm:hidden" />
              Organize with <span className="font-semibold text-blue-600">Boards</span>
              <span className="hidden sm:inline"> • </span>
              <br className="sm:hidden" />
              Track with <span className="font-semibold text-pink-600">Maps</span>
              <span className="hidden sm:inline"> • </span>
              <br className="sm:hidden" />
              Manage with <span className="font-semibold text-green-600">Financial Tools</span>
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto px-2 sm:px-4">
            {/* Portfolio View Card */}
            <Card className="card-responsive hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <PieChart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <CardTitle className="text-blue-600 text-sm sm:text-base md:text-lg font-bold">Portfolio View</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-5 md:pb-6">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  15 colored bubbles in quadrants: Big Bets, Line Extensions, LTOs, Other
                </p>
              </CardContent>
            </Card>

            {/* Multiple Views Card */}
            <Card className="card-responsive hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-600 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <CardTitle className="text-purple-600 text-sm sm:text-base md:text-lg font-bold">Multiple Views</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-5 md:pb-6">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Switch between Board, Table, Map, Calendar, and List views instantly
                </p>
              </CardContent>
            </Card>

            {/* Process Mapping Card */}
            <Card className="card-responsive hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 group">
              <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-pink-100 rounded-full group-hover:bg-pink-200 transition-colors">
                    <Map className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-pink-600 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <CardTitle className="text-pink-600 text-sm sm:text-base md:text-lg font-bold">Process Mapping</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-5 md:pb-6">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Visual workflow mapping with drag-and-drop process flows
                </p>
              </CardContent>
            </Card>

            {/* Financial Hub Card */}
            <Card className="card-responsive hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300">
              <CardHeader className="pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="relative p-2 sm:p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-green-600 group-hover:scale-110 transition-transform" />
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1" />
                  </div>
                </div>
                <CardTitle className="text-green-600 text-sm sm:text-base md:text-lg font-bold">Financial Hub</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-5 md:pb-6">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Track income, expenses, budgets, and financial performance with reports
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center px-4 sm:px-6 max-w-2xl mx-auto">
            <Button 
              size="lg" 
              asChild 
              className="text-sm xs:text-base sm:text-lg px-5 xs:px-6 sm:px-8 py-4 sm:py-5 md:py-6 touch-target-lg w-full xs:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/app" className="flex items-center justify-center gap-2">
                <span>View Portfolio Chart</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              asChild 
              variant="outline" 
              className="text-sm xs:text-base sm:text-lg px-5 xs:px-6 sm:px-8 py-4 sm:py-5 md:py-6 touch-target-lg w-full xs:flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
            >
              <Link href="/app/financial" className="flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Financial Dashboard</span>
                <DollarSign className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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
            Portfolio Management • Financial Tracking • Export to PNG/SVG/PDF • Mobile Responsive
          </p>
        </div>
      </div>
    </div>
  )
}
