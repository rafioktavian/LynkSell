'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PAGE ERROR BUBBLED:", error);
  }, [error]);

  return (
    <div style={{ padding: '40px', color: 'red', background: 'white' }}>
      <h1>Something went wrong!</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
