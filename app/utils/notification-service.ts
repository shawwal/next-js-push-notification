// This is a simulated notification service with fallback for denied permissions

export interface NotificationSubscription {
  id: string
  timestamp: number
  mode: "native" | "fallback"
}

export interface NotificationPayload {
  id?: string
  title: string
  body: string
  icon?: string
  url?: string
  timestamp?: number
}

// Simulate subscription storage
let activeSubscription: NotificationSubscription | null = null
const notificationHistory: NotificationPayload[] = []

// Event listeners for in-page notifications
const notificationListeners: ((notification: NotificationPayload) => void)[] = []

// Check if browser notifications are supported
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window
}

// Get current notification permission
export function getNotificationPermission(): NotificationPermissionState {
  if (!isNotificationSupported()) {
    return "unsupported"
  }
  return Notification.permission as NotificationPermissionState
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) {
    return "unsupported"
  }

  try {
    return (await Notification.requestPermission()) as NotificationPermissionState
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return "denied"
  }
}

// Subscribe to notifications (with fallback mode)
export async function subscribeToNotifications(forceFallback = false): Promise<NotificationSubscription | null> {
  // If notifications aren't supported, use fallback mode
  if (!isNotificationSupported() || forceFallback) {
    activeSubscription = {
      id: generateId(),
      timestamp: Date.now(),
      mode: "fallback",
    }
    return activeSubscription
  }

  // Try to get permission for native notifications
  const permission = await requestNotificationPermission()

  if (permission === "granted") {
    // Create a native subscription
    activeSubscription = {
      id: generateId(),
      timestamp: Date.now(),
      mode: "native",
    }
  } else {
    // Fall back to in-page notifications
    activeSubscription = {
      id: generateId(),
      timestamp: Date.now(),
      mode: "fallback",
    }
  }

  return activeSubscription
}

// Unsubscribe from notifications
export async function unsubscribeFromNotifications(): Promise<boolean> {
  activeSubscription = null
  return true
}

// Get current subscription
export function getCurrentSubscription(): NotificationSubscription | null {
  return activeSubscription
}

// Add a listener for in-page notifications
export function addNotificationListener(listener: (notification: NotificationPayload) => void): void {
  notificationListeners.push(listener)
}

// Remove a notification listener
export function removeNotificationListener(listener: (notification: NotificationPayload) => void): void {
  const index = notificationListeners.indexOf(listener)
  if (index !== -1) {
    notificationListeners.splice(index, 1)
  }
}

// Send a notification
export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  if (!activeSubscription) {
    return false
  }

  try {
    // Add to history
    const notificationData = {
      ...payload,
      id: payload.id || generateId(),
      timestamp: payload.timestamp || Date.now(),
    }

    notificationHistory.unshift(notificationData)

    // Keep only the last 50 notifications
    if (notificationHistory.length > 50) {
      notificationHistory.splice(50)
    }

    // If using native notifications and permission is granted
    if (activeSubscription.mode === "native" && Notification.permission === "granted") {
      // Show the notification
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/icon.png",
      })

      // Handle notification click
      notification.onclick = () => {
        if (payload.url) {
          window.open(payload.url, "_blank")
        }
        notification.close()
      }
    }

    // Always notify listeners (for fallback mode)
    notificationListeners.forEach((listener) => {
      listener(notificationData)
    })

    return true
  } catch (error) {
    console.error("Error sending notification:", error)
    return false
  }
}

// Get notification history
export function getNotificationHistory(): NotificationPayload[] {
  return [...notificationHistory]
}

// Helper function to generate a random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Extended permission type
export type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported"
