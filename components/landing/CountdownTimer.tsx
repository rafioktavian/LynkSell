'use client';

import { useState, useEffect } from 'react';

interface Props {
  pageId: string;
  accentColor: string;
}

export function CountdownTimer({ pageId, accentColor }: Props) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const storageKey = `ls-timer-${pageId}`;
    let endTimeStr: string | null = null;
    
    try {
      endTimeStr = sessionStorage.getItem(storageKey);
    } catch (e) {
      // Ignore sessionStorage error
    }

    let endTime: number;

    if (!endTimeStr) {
      endTime = Date.now() + 12 * 60 * 60 * 1000;
      try { sessionStorage.setItem(storageKey, endTime.toString()); } catch (e) {}
    } else {
      endTime = parseInt(endTimeStr, 10);
      if (endTime < Date.now()) {
        endTime = Date.now() + 12 * 60 * 60 * 1000;
        try { sessionStorage.setItem(storageKey, endTime.toString()); } catch (e) {}
      }
    }

    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();
      if (difference > 0) {
        return {
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [pageId]);

  if (!timeLeft) {
     return null;
  }

  const formatZero = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 justify-center mb-8">
      {[
        { label: 'JAM', value: formatZero(timeLeft.hours) },
        { label: 'MENIT', value: formatZero(timeLeft.minutes) },
        { label: 'DETIK', value: formatZero(timeLeft.seconds) },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div 
            className="w-16 h-16 flex items-center justify-center rounded-xl bg-white shadow-sm font-heading text-2xl font-extrabold text-accent border border-accent/20"
          >
            {item.value}
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-wider">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
