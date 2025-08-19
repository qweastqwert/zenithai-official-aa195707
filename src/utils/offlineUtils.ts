
export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline = navigator.onLine;
  private listeners: ((isOnline: boolean) => void)[] = [];

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      console.log('📶 Connection restored');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
      console.log('📵 Connection lost - switching to offline mode');
    });
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public onStatusChange(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public async cacheAppResources() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        // Get all the script and style URLs from the current page
        const urls = [
          window.location.href,
          ...Array.from(document.querySelectorAll('script[src]')).map(el => (el as HTMLScriptElement).src),
          ...Array.from(document.querySelectorAll('link[href]')).map(el => (el as HTMLLinkElement).href)
        ].filter(url => url && !url.includes('http') && !url.includes('googleapis'));

        // Send message to service worker to cache these URLs
        navigator.serviceWorker.controller?.postMessage({
          type: 'CACHE_URLS',
          urls
        });

        console.log('📦 Requested caching of app resources');
      } catch (error) {
        console.error('Error caching app resources:', error);
      }
    }
  }

  public isAIFeature(path: string): boolean {
    const aiPaths = ['/mindmate', '/chat'];
    return aiPaths.some(aiPath => path.includes(aiPath));
  }
}

export const offlineManager = OfflineManager.getInstance();
