import { minikitConfig } from '../minikit.config';

// Base Miniapp SDK utilities
export class BaseMiniappSDK {
  private static instance: BaseMiniappSDK;
  private isInitialized = false;

  static getInstance(): BaseMiniappSDK {
    if (!BaseMiniappSDK.instance) {
      BaseMiniappSDK.instance = new BaseMiniappSDK();
    }
    return BaseMiniappSDK.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Base Miniapp SDK
      if (typeof window !== 'undefined' && (window as any).minikit) {
        await (window as any).minikit.initialize();
        this.isInitialized = true;
        console.log('✅ Base Miniapp SDK initialized');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Base Miniapp SDK:', error);
    }
  }

  // Get current user info
  async getCurrentUser() {
    if (!this.isInitialized) await this.initialize();

    try {
      if (typeof window !== 'undefined' && (window as any).minikit) {
        const user = await (window as any).minikit.getCurrentUser();
        return user;
      }
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
    }
    return null;
  }

  // Send notifications
  async sendNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
    if (!this.isInitialized) await this.initialize();

    try {
      if (typeof window !== 'undefined' && (window as any).minikit) {
        await (window as any).minikit.sendNotification({
          message,
          type
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    }
    return false;
  }

  // Share content
  async shareContent(text: string, url?: string) {
    if (!this.isInitialized) await this.initialize();

    try {
      if (typeof window !== 'undefined' && (window as any).minikit) {
        await (window as any).minikit.share({
          text,
          url: url || window.location.href
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to share content:', error);
    }
    return false;
  }

  // Close miniapp
  async closeMiniapp() {
    if (!this.isInitialized) await this.initialize();

    try {
      if (typeof window !== 'undefined' && (window as any).minikit) {
        await (window as any).minikit.close();
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to close miniapp:', error);
    }
    return false;
  }

  // Check if running in Base miniapp
  isMiniapp(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).minikit;
  }

  // Get miniapp capabilities
  getCapabilities(): string[] {
    if (!this.isMiniapp()) return [];

    try {
      return (window as any).minikit?.capabilities || [];
    } catch (error) {
      console.error('❌ Failed to get capabilities:', error);
      return [];
    }
  }
}

// React hook for Base Miniapp
export function useBaseMiniapp() {
  const sdk = BaseMiniappSDK.getInstance();

  return {
    initialize: () => sdk.initialize(),
    getCurrentUser: () => sdk.getCurrentUser(),
    sendNotification: (message: string, type?: 'info' | 'success' | 'error') =>
      sdk.sendNotification(message, type),
    shareContent: (text: string, url?: string) => sdk.shareContent(text, url),
    closeMiniapp: () => sdk.closeMiniapp(),
    isMiniapp: () => sdk.isMiniapp(),
    getCapabilities: () => sdk.getCapabilities(),
    isInitialized: (sdk as any).isInitialized
  };
}

// Helper functions
export const baseMiniappUtils = {
  // Check if user is authorized
  async isUserAuthorized(): Promise<boolean> {
    const sdk = BaseMiniappSDK.getInstance();
    const user = await sdk.getCurrentUser();
    return !!user?.fid;
  },

  // Get auth headers for API calls
  async getAuthHeaders(): Promise<Record<string, string>> {
    const sdk = BaseMiniappSDK.getInstance();
    const user = await sdk.getCurrentUser();

    if (!user?.fid) {
      throw new Error('User not authenticated');
    }

    return {
      'X-User-FID': user.fid.toString(),
      'X-User-Username': user.username || '',
      'X-User-Display-Name': user.displayName || '',
      'X-App-Version': minikitConfig.miniapp.version
    };
  },

  // Track analytics events
  async trackEvent(eventName: string, properties?: Record<string, any>) {
    const sdk = BaseMiniappSDK.getInstance();
    const user = await sdk.getCurrentUser();

    const eventData = {
      event: eventName,
      user: user?.fid ? {
        fid: user.fid,
        username: user.username,
        displayName: user.displayName
      } : null,
      properties,
      timestamp: new Date().toISOString(),
      app: {
        name: minikitConfig.miniapp.name,
        version: minikitConfig.miniapp.version
      }
    };

    console.log('📊 Analytics Event:', eventData);

    // TODO: Send to analytics service
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData)
    // });
  }
};