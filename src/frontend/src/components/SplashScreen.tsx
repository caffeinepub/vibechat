import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDismiss: () => void;
  duration?: number;
}

export function SplashScreen({ onDismiss, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out before dismissing
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration);

    // Complete dismissal after fade animation
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, duration + 500); // 500ms for fade animation

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-4">
        <img
          src="/assets/generated/vibechat-logo.dim_512x512.png"
          alt="Vibechat"
          className="h-32 w-auto object-contain animate-pulse sm:h-40 md:h-48"
        />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
