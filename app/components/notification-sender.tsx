"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { sendNotification, getCurrentSubscription } from "../utils/notification-service"
import { Send } from "lucide-react"

export function NotificationSender() {
  const [title, setTitle] = useState("Notification Demo")
  const [message, setMessage] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null)

  const handleSend = async () => {
    if (!message.trim()) {
      setStatus({ message: "Please enter a message", success: false })
      return
    }

    setIsLoading(true)
    setStatus(null)

    try {
      const subscription = getCurrentSubscription()

      if (!subscription) {
        setStatus({
          message: "You need to subscribe to notifications first",
          success: false,
        })
        return
      }

      const success = await sendNotification({
        title,
        body: message,
        url: url || undefined,
      })

      if (success) {
        setStatus({
          message: `Notification sent successfully${subscription.mode === "fallback" ? " (in-page mode)" : ""}!`,
          success: true,
        })
      } else {
        setStatus({
          message: "Failed to send notification. Make sure notifications are enabled in your browser.",
          success: false,
        })
      }
    } catch (error) {
      console.error("Failed to send notification:", error)
      setStatus({
        message: "Failed to send notification. Please check console for details.",
        success: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Test Notification</CardTitle>
        <CardDescription>Create and send a test notification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification Title" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL (optional)</Label>
          <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
          <p className="text-xs text-muted-foreground">The URL to open when the notification is clicked</p>
        </div>

        {status && (
          <div
            className={`p-3 rounded-md text-sm ${status.success ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}
          >
            {status.message}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSend} disabled={isLoading || !message.trim()} className="w-full">
          {isLoading ? "Sending..." : "Send Notification"}
          {!isLoading && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
