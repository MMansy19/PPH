'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, PieChart, BarChart3, Map } from 'lucide-react'

export function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Personal Process Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Visualize your portfolio with <span className="font-semibold text-purple-600">Bubble Charts</span> • 
            Organize with <span className="font-semibold text-blue-600">Boards</span> • 
            Track with <span className="font-semibold text-pink-600">Maps</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-2">
                <PieChart className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-blue-600">Portfolio View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                15 colored bubbles in quadrants: Big Bets, Line Extensions, LTOs, Other
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-2">
                <BarChart3 className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-purple-600">Multiple Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Switch between Board, Table, Map, Calendar, and List views instantly
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-2">
                <Map className="h-12 w-12 text-pink-600" />
              </div>
              <CardTitle className="text-pink-600">Process Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Visual workflow mapping with drag-and-drop process flows
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/app">
              View Portfolio Chart
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Big Bets (High Value, Low Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Line Extensions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>LTOs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Other (High Risk)</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          No signup required • Export to PNG/SVG/PDF • Mobile responsive
        </p>
      </div>
    </div>
  )
}
