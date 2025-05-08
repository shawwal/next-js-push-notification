"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getNotificationHistory } from "../utils/notification-service"
import { RefreshCcw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotifications = () => {
    setIsLoading(true)
    try {
      const history = getNotificationHistory()
      setNotifications(history)
    } catch (error) {
      console.error("Failed to fetch notification history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>Your recent notifications</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchNotifications} title="Refresh">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={notification.id || index} className="p-3 rounded-md border bg-muted/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    {notification.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm">{notification.body}</p>
                {notification.url && (
                  <a
                    href={notification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    {notification.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
