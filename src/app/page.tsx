'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.push('/landing');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="text-center">
        <div className="cyber-loading mb-4" />
        <div className="neon-text font-mono text-lg">
          INITIALIZING NEURAL NETWORK
        </div>
      </div>
    </div>
  );
}
