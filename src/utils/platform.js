export function getDeviceType() {
  if (typeof window === 'undefined') return 'web';
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmallViewport = typeof window !== 'undefined' && window.innerWidth < 768;
  return (isMobileUA || isSmallViewport) ? 'mobile' : 'web';
}


