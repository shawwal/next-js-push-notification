"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff, History, Send, AlertTriangle } from "lucide-react"
import { NotificationHistory } from "./components/notification-history"
import { NotificationSender } from "./components/notification-sender"
import { FallbackNotification } from "./components/fallback-notification"
import {
  isNotificationSupported,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  getCurrentSubscription,
  getNotificationPermission,
  type NotificationSubscription,
  type NotificationPermissionState,
} from "./utils/notification-service"
import InstallPWAButton from "@/components/install-pwa-button"

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<NotificationSubscription | null>(null)
  const [permission, setPermission] = useState<NotificationPermissionState>("default")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    // Check if notifications are supported
    const supported = isNotificationSupported()
    setIsSupported(supported)

    if (supported) {
      // Get current permission
      setPermission(getNotificationPermission())

      // Check for existing subscription
      const currentSubscription = getCurrentSubscription()
      setSubscription(currentSubscription)
    }
  }, [])

  async function handleSubscribe(forceFallback = false) {
    setIsLoading(true)
    setStatus(null)
    try {
      const newSubscription = await subscribeToNotifications(forceFallback)
      setSubscription(newSubscription)

      if (newSubscription?.mode === "fallback") {
        setStatus("Using in-page notifications (browser notifications denied)")
      } else {
        setStatus("Successfully subscribed to notifications!")
      }

      // Update permission state
      if (isNotificationSupported()) {
        setPermission(getNotificationPermission())
      }
    } catch (error) {
      console.error("Failed to subscribe:", error)
      setStatus(`Failed to subscribe: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUnsubscribe() {
    setIsLoading(true)
    setStatus(null)
    try {
      await unsubscribeFromNotifications()
      setSubscription(null)
      setStatus("Successfully unsubscribed from notifications!")
    } catch (error) {
      console.error("Failed to unsubscribe:", error)
      setStatus("Failed to unsubscribe. Please check console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Receive updates about important events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
            <p className="text-muted-foreground">Notifications are not supported in this browser.</p>
          </div>
          <InstallPWAButton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Demo</CardTitle>
        <CardDescription>Receive updates about important events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === "denied" && !subscription && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Notification permission denied</p>
              <p className="text-xs mt-1">You've blocked notifications in your browser. You can either:</p>
              <ul className="text-xs list-disc list-inside mt-1">
                <li>Change permission settings in your browser</li>
                <li>
                  <button
                    onClick={() => handleSubscribe(true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Use in-page notifications instead
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        {subscription ? (
          <>
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-md">
              <Bell className="h-5 w-5" />
              <div>
                <p>You are subscribed to notifications</p>
                {subscription.mode === "fallback" && <p className="text-xs mt-1">Using in-page notification mode</p>}
              </div>
            </div>

            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="send">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="send" className="mt-4">
                <NotificationSender />
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <NotificationHistory />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            <p className="text-muted-foreground">You are not subscribed to notifications</p>
          </div>
        )}

        {status && <div className="p-3 bg-muted/30 rounded-md text-sm">{status}</div>}
      </CardContent>
      <CardFooter>
        {subscription ? (
          <Button variant="outline" onClick={handleUnsubscribe} disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Unsubscribe from Notifications"}
            {!isLoading && <BellOff className="ml-2 h-4 w-4" />}
          </Button>
        ) : (
          <Button onClick={() => handleSubscribe(false)} disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Subscribe to Notifications"}
            {!isLoading && <Bell className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(
    typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
  )
  const [isStandalone, setIsStandalone] = useState(
    typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches,
  )

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  if (!isIOS) {
    return null // Only show for iOS devices
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Install App</CardTitle>
        <CardDescription>Add this app to your home screen for the best experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-md">
          <p className="text-sm">
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon" className="mx-1">
              ⎋
            </span>
            and then "Add to Home Screen"
            <span role="img" aria-label="plus icon" className="mx-1">
              ➕
            </span>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Notifications Demo</h1>
      <PushNotificationManager />
      <InstallPrompt />
      <FallbackNotification />
    </div>
  )
}
