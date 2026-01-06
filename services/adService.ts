
import { AdMob, InterstitialAdOptions } from '@capacitor-community/admob';

class AdService {
  private isLoaded: boolean = false;
  /**
   * This is a Google-provided Test ID for Interstitial ads.
   * IMPORTANT: Replace with your real Ad Unit ID from the AdMob console before publishing.
   */
  private adId: string = 'ca-app-pub-3940256099942544/1033173712';

  /**
   * Initializes the AdMob SDK. 
   * Should be called once at app startup.
   */
  async initialize(): Promise<void> {
    try {
      // AdMob.initialize() only runs if the Capacitor AdMob plugin is available (Native apps).
      await AdMob.initialize();
      console.log('AdMob Initialized');
    } catch (e) {
      console.log('AdMob initialization skipped: likely running in browser or environment without plugin.');
    }
  }

  /**
   * Prepares (pre-loads) an interstitial ad from the network.
   */
  async prepareAd(): Promise<void> {
    try {
      const options: InterstitialAdOptions = {
        adId: this.adId,
      };
      await AdMob.prepareInterstitial(options);
      this.isLoaded = true;
      console.log('Native Ad Prepared Successfully');
    } catch (e) {
      console.warn('Native ad preparation failed, falling back to simulation:', e);
      /**
       * Web Fallback: If not in a native environment, we simulate the loading process
       * so the web-based AdInterstitial.tsx component can still function correctly.
       */
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isLoaded = true;
          resolve();
        }, 800);
      });
    }
  }

  /**
   * Shows the prepared interstitial ad.
   * In a native environment, this triggers the native Google AdMob overlay.
   * Returns true if a native ad was shown, false if we should fall back to the web simulation.
   */
  async showInterstitial(): Promise<boolean> {
    if (!this.isLoaded) return false;

    try {
      // This call will fail if not running on a real device with the AdMob plugin.
      await AdMob.showInterstitial();
      this.isLoaded = false;
      // Pre-load the next one immediately for a smooth experience later
      this.prepareAd();
      return true;
    } catch (e) {
      // Fail silently and return false so App.tsx knows to use the fallback component.
      return false;
    }
  }

  get canShowAd(): boolean {
    return this.isLoaded;
  }

  reset() {
    this.isLoaded = false;
  }
}

export const adService = new AdService();
