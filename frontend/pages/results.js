import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Results() {
  const router = useRouter();

  useEffect(() => {
    // Redirect /results to /roadmap-new for compatibility
    router.replace('/roadmap-new');
  }, [router]);

  return null;
}
