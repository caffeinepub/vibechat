import { useEffect, useState, useRef } from 'react';

interface UseSimulatedPlaybackProgressOptions {
  duration: number; // in seconds
  isPlaying: boolean;
  onComplete?: () => void;
}

export function useSimulatedPlaybackProgress({
  duration,
  isPlaying,
  onComplete,
}: UseSimulatedPlaybackProgressOptions) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && progress < 100) {
      // Update every 100ms for smooth progress
      const incrementPerTick = (100 / (duration * 10));
      
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + incrementPerTick;
          if (next >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            onComplete?.();
            return 100;
          }
          return next;
        });
      }, 100);
    } else if (!isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration, progress, onComplete]);

  const reset = () => {
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { progress, reset };
}
