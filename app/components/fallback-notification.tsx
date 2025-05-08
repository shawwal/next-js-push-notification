"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import {
  addNotificationListener,
  removeNotificationListener,
  type NotificationPayload,
} from "../utils/notification-service"

export function FallbackNotification() {
  const [notifications, setNotifications] = useState<(NotificationPayload & { visible: boolean })[]>([])

  useEffect(() => {
    const handleNotification = (notification: NotificationPayload) => {
      // Add the notification to our state with a visible flag
      setNotifications((prev) => [
        { ...notification, visible: true },
        ...prev.slice(0, 4), // Keep only the last 5 notifications
      ])

      // Auto-hide the notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, visible: false } : n)))
      }, 5000)
    }

    // Register the listener
    addNotificationListener(handleNotification)

    // Clean up
    return () => {
      removeNotificationListener(handleNotification)
    }
  }, [])

  // Remove notifications that are no longer visible after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.visible))
    }, 500) // Delay to allow for animation

    return () => clearTimeout(timer)
  }, [notifications])

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map(
        (notification) =>
          notification.visible && (
            <div
              key={notification.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-right"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <button
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, visible: false } : n)),
                    )
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.body}</p>
              {notification.url && (
                <a
                  href={notification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-2 block"
                >
                  View details
                </a>
              )}
            </div>
          ),
      )}
    </div>
  )
}
