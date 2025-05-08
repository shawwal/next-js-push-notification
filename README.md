# Next.js Notification System

A flexible notification system for Next.js applications with fallback support for environments where browser permissions are restricted.

![Notification Demo](https://github.com/shawwal/next-js-push-notification/raw/main/public/demo.png)

## Features

- 🔔 Browser notifications with Web Notifications API
- 🔄 Fallback in-page notifications when browser permissions are denied
- 📱 Mobile-friendly design
- 🌓 Dark mode support
- 📋 Notification history tracking
- 🔗 Support for clickable notifications with custom URLs
- ⚡ Built with Next.js and TypeScript

## Demo

Check out the [link live demo](https://next-push-notification.shawwals.com/) or [alternate link live demo](https://next-js-push-notification-sigma.vercel.app/) to see the notification system in action.

## Installation

To get started with the notification system, follow these steps:

```bash
# Clone the repository
git clone https://github.com/shawwal/next-js-push-notification.git

# Navigate to the project directory
cd next-js-push-notification

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Basic Implementation

Here's a basic example of how to integrate the notification system into your Next.js application:

```tsx
import { NotificationProvider } from '@/components/notification-provider';
import { useNotifications } from '@/hooks/use-notifications';

// Wrap your app with the provider
function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

// Use the hook in your components
function MyComponent() {
  const { sendNotification, subscribe, unsubscribe } = useNotifications();

  const handleSendNotification = () => {
    sendNotification({
      title: 'Hello World',
      body: 'This is a test notification',
      url: '/dashboard',
    });
  };

  return (
    <div>
      <button onClick={() => subscribe()}>Subscribe to Notifications</button>
      <button onClick={() => unsubscribe()}>Unsubscribe</button>
      <button onClick={handleSendNotification}>Send Test Notification</button>
    </div>
  );
}
```

### API Reference

The following functions and types are available for interacting with the notification system:

#### Notification Service

```typescript
/**
 * Subscribe to notifications.
 * @param forceFallback - Optional flag to force fallback mode.
 * @returns A promise resolving to a NotificationSubscription object or null.
 */
subscribeToNotifications(forceFallback?: boolean): Promise<NotificationSubscription | null>

/**
 * Unsubscribe from notifications.
 * @returns A promise resolving to a boolean indicating success.
 */
unsubscribeFromNotifications(): Promise<boolean>

/**
 * Send a notification.
 * @param payload - The notification payload.
 * @returns A promise resolving to a boolean indicating success.
 */
sendNotification(payload: NotificationPayload): Promise<boolean>

/**
 * Get notification history.
 * @returns An array of NotificationPayload objects.
 */
getNotificationHistory(): NotificationPayload[]

/**
 * Check if notifications are supported by the browser.
 * @returns A boolean indicating support.
 */
isNotificationSupported(): boolean

/**
 * Get the current notification permission state.
 * @returns The current notification permission state.
 */
getNotificationPermission(): NotificationPermissionState
```

#### Types

```typescript
interface NotificationPayload {
  id?: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  timestamp?: number;
}

interface NotificationSubscription {
  id: string;
  timestamp: number;
  mode: "native" | "fallback";
}

type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported";
```

## Configuration

You can customize the notification system by modifying the following files:

- `utils/notification-service.ts` - Core notification functionality
- `components/fallback-notification.tsx` - In-page notification appearance
- `components/notification-sender.tsx` - Notification form UI

## Browser Support

- Chrome 42+
- Firefox 44+
- Safari 16.4+ (macOS 13+)
- Edge 17+
- Opera 39+

Mobile browsers have varying levels of support for notifications. The fallback mode ensures notifications work even on unsupported browsers.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
