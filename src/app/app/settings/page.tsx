'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/hooks/useAuth'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Bell, Moon, Globe, Lock, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useRequireAuth('/auth/login')
  const { signOut } = useAuth()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyReport: false,
    darkMode: false,
    compactView: false,
    showCompletedTasks: true,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Save settings to database
      console.log('Saving settings:', settings)
      setTimeout(() => {
        setSaving(false)
      }, 1000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      console.log('Delete account requested')
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/app" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application preferences and account settings</p>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-base cursor-pointer">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email updates about your tasks</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taskReminders" className="text-base cursor-pointer">Task Reminders</Label>
                  <p className="text-sm text-gray-500">Get reminders for upcoming deadlines</p>
                </div>
                <Switch
                  id="taskReminders"
                  checked={settings.taskReminders}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, taskReminders: checked })}
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReport" className="text-base cursor-pointer">Weekly Report</Label>
                  <p className="text-sm text-gray-500">Receive weekly summary of your progress</p>
                </div>
                <Switch
                  id="weeklyReport"
                  checked={settings.weeklyReport}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, weeklyReport: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple-600" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="text-base cursor-pointer">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Switch to dark theme (Coming Soon)</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, darkMode: checked })}
                  disabled
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compactView" className="text-base cursor-pointer">Compact View</Label>
                  <p className="text-sm text-gray-500">Show more content in less space</p>
                </div>
                <Switch
                  id="compactView"
                  checked={settings.compactView}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, compactView: checked })}
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showCompletedTasks" className="text-base cursor-pointer">Show Completed Tasks</Label>
                  <p className="text-sm text-gray-500">Display completed tasks in views</p>
                </div>
                <Switch
                  id="showCompletedTasks"
                  checked={settings.showCompletedTasks}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, showCompletedTasks: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-gray-500">Manage your logged-in devices</p>
                </div>
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </div>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-700 mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
