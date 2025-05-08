// components/install-pwa-button.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

let deferredPrompt: any; // you can make a better type later

export default function InstallPWAButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    deferredPrompt = null;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={handleInstallClick}
    >
      Install App
    </Button>
  );
}
