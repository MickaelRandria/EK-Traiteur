import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2.5 rounded-full bg-ink/95 backdrop-blur-md px-4 py-2 text-xs text-ivory shadow-xl"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9B98F] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9B98F]"></span>
      </span>
      <WifiOff className="w-3.5 h-3.5" strokeWidth={1.4} />
      <span>Hors ligne — la carte reste consultable</span>
    </div>
  );
};
