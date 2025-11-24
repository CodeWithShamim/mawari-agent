'use client';

import { useEffect, useState } from 'react';
import { useBaseMiniapp } from '../lib/base-miniapp';

interface BaseMiniappWrapperProps {
  children: React.ReactNode;
  onUserChange?: (user: any) => void;
  onReady?: () => void;
}

export function BaseMiniappWrapper({
  children,
  onUserChange,
  onReady
}: BaseMiniappWrapperProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMiniapp, setIsMiniapp] = useState(false);

  const {
    initialize,
    getCurrentUser,
    isMiniapp: checkIsMiniapp
  } = useBaseMiniapp();

  useEffect(() => {
    const initMiniapp = async () => {
      try {
        // Check if running in Base miniapp
        const inMiniapp = checkIsMiniapp();
        setIsMiniapp(inMiniapp);

        if (inMiniapp) {
          console.log('🚀 Initializing Base Miniapp...');
          await initialize();

          // Get current user
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            onUserChange?.(currentUser);
          }

          setIsInitialized(true);
          onReady?.();
        } else {
          console.log('🌐 Running in regular browser mode');
          setIsInitialized(true);
          onReady?.();
        }
      } catch (error) {
        console.error('❌ Failed to initialize Base Miniapp:', error);
        setIsInitialized(true);
        onReady?.();
      }
    };

    initMiniapp();
  }, [initialize, getCurrentUser, checkIsMiniapp, onUserChange, onReady]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb73ea] mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`base-miniapp ${isMiniapp ? 'in-miniapp' : 'in-browser'}`}>
      {/* Add Base Miniapp specific styles or components */}
      {children}
    </div>
  );
}

// Component for Base Miniapp specific features
export function BaseMiniappFeatures() {
  const { isMiniapp, getCapabilities, closeMiniapp } = useBaseMiniapp();
  const [capabilities, setCapabilities] = useState<string[]>([]);

  useEffect(() => {
    if (isMiniapp()) {
      setCapabilities(getCapabilities());
    }
  }, [isMiniapp, getCapabilities]);

  if (!isMiniapp()) {
    return null;
  }

  return (
    <div className="miniapp-features">
      <div className="miniapp-header">
        <div className="miniapp-status">
          <span className="status-indicator">🟢</span>
          <span className="status-text">Base Miniapp Active</span>
        </div>

        {capabilities.length > 0 && (
          <div className="capabilities-info">
            <small className="text-gray-400">
              Capabilities: {capabilities.join(', ')}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to get Base Miniapp context
export function useBaseMiniappContext() {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  const handleUserChange = (newUser: any) => {
    setUser(newUser);
  };

  const handleReady = () => {
    setIsReady(true);
  };

  return {
    user,
    isReady,
    handleUserChange,
    handleReady
  };
}