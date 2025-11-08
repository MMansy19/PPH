'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UsernameEditor } from '@/components/profile/UsernameEditor'
import { ArrowLeft, Mail, User as UserIcon, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, loading: authLoading } = useRequireAuth('/auth/login')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [loadingUsername, setLoadingUsername] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
  })

  const supabase = createClient()

  // Fetch username from user_profiles table
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.id) return
      
      setLoadingUsername(true)
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle() // Use maybeSingle instead of single to handle missing records

        if (error) {
          console.error('Error fetching username:', error)
        } else if (data?.username) {
          setUsername(data.username)
        }
      } catch (error) {
        console.error('Error fetching username:', error)
      } finally {
        setLoadingUsername(false)
      }
    }

    fetchUsername()
  }, [user?.id, supabase])

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      console.log('User data:', user)
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        bio: user.user_metadata?.bio || '',
      })
    }
  }, [user])

  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      // TODO: Implement profile update with Supabase
      console.log('Updating profile:', formData)
      // This would call your Supabase update function
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      fullName: user?.user_metadata?.full_name || '',
      bio: user?.user_metadata?.bio || '',
    })
    setIsEditing(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-responsive safe-area-inset">
      <div className="container-responsive max-w-5xl">
        {/* Header - Responsive */}
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
          <Button variant="ghost" size="sm" asChild className="mb-3 sm:mb-4 touch-target">
            <Link href="/app" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm sm:text-base">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-responsive-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-responsive text-gray-600 mt-1 sm:mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="spacing-responsive">
          {/* Profile Header Card - Responsive */}
          <Card className="card-responsive animate-scale-in">
            <CardHeader className="p-responsive">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-center text-xl sm:text-2xl lg:text-3xl font-bold shadow-lg flex-shrink-0">
                    {getUserInitials()}
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {user.user_metadata?.full_name || 'User'}
                    </h2>
                    {username && (
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">
                        @{username}
                      </p>
                    )}
                    <p className="text-sm sm:text-base text-gray-600 truncate max-w-xs sm:max-w-none">
                      {user.email}
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    size="sm" 
                    className="w-full sm:w-auto touch-target whitespace-nowrap"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Profile Information Card - Responsive */}
          <Card className="card-responsive animate-scale-in animation-delay-100">
            <CardHeader className="p-responsive">
              <CardTitle className="text-base sm:text-lg md:text-xl">Personal Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Update your personal details here
              </CardDescription>
            </CardHeader>
            <CardContent className="p-responsive space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username Editor - Always available for editing */}
              <div className="space-y-2">
                <UsernameEditor
                  userId={user.id}
                  currentUsername={username || undefined}
                  onUpdate={(newUsername) => {
                    console.log('Username updated to:', newUsername)
                    // Update the local state to show the new username immediately
                    setUsername(newUsername)
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  rows={4}
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Details about your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Member Since</span>
                </div>
                <span className="text-sm text-gray-600">{createdAt}</span>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Last Sign In</span>
                </div>
                <span className="text-sm text-gray-600">{lastSignIn}</span>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Account Status</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
