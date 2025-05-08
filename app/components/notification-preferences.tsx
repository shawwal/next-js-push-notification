"use client"

import type React from "react"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { NotificationCategory, NotificationPreferences } from "../types/notifications"
import { updatePreferences } from "../actions"
import { Bell, BellOff, Newspaper, RefreshCw, Megaphone, ShieldAlert } from "lucide-react"

interface NotificationPreferencesProps {
  initialPreferences: NotificationPreferences
  endpoint: string
  onUpdate: (preferences: NotificationPreferences) => void
}

export function NotificationPreferencesComponent({
  initialPreferences,
  endpoint,
  onUpdate,
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
    news: <Newspaper className="h-5 w-5" />,
    updates: <RefreshCw className="h-5 w-5" />,
    marketing: <Megaphone className="h-5 w-5" />,
    system: <ShieldAlert className="h-5 w-5" />,
  }

  const categoryLabels: Record<NotificationCategory, string> = {
    news: "News & Announcements",
    updates: "Product Updates",
    marketing: "Marketing & Promotions",
    system: "System Alerts",
  }

  const categoryDescriptions: Record<NotificationCategory, string> = {
    news: "Important news and announcements about our service",
    updates: "Updates about new features and improvements",
    marketing: "Special offers, promotions, and marketing messages",
    system: "Critical system alerts and security notifications",
  }

  const handleToggleCategory = (category: NotificationCategory) => {
    setPreferences((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category],
      },
    }))
  }

  const handleToggleAll = (enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      enabled,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setStatus(null)
    try {
      await updatePreferences(endpoint, preferences)
      onUpdate(preferences)
      setStatus("Preferences saved successfully!")
    } catch (error) {
      console.error("Failed to update preferences:", error)
      setStatus("Failed to save preferences. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose which notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {preferences.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
            <Label htmlFor="notifications-enabled" className="text-base font-medium">
              All Notifications
            </Label>
          </div>
          <Switch id="notifications-enabled" checked={preferences.enabled} onCheckedChange={handleToggleAll} />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Notification Categories</h3>
          {Object.entries(preferences.categories).map(([category, enabled]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  {categoryIcons[category as NotificationCategory]}
                  <Label htmlFor={`category-${category}`} className="text-sm font-medium">
                    {categoryLabels[category as NotificationCategory]}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {categoryDescriptions[category as NotificationCategory]}
                </p>
              </div>
              <Switch
                id={`category-${category}`}
                checked={enabled}
                onCheckedChange={() => handleToggleCategory(category as NotificationCategory)}
                disabled={!preferences.enabled}
              />
            </div>
          ))}
        </div>

        {status && (
          <div
            className={`p-3 rounded-md text-sm ${status.includes("Failed") ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" : "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"}`}
          >
            {status}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
