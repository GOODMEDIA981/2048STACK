
export type AdEvent = 'onAdLoaded' | 'onAdDismissed' | 'onAdFailed' | 'onAdStarted';

class AdService {
  private isLoaded: boolean = false;

  async prepareAd(): Promise<void> {
    // Simulate network latency for loading an ad
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isLoaded = true;
        resolve();
      }, 800);
    });
  }

  get canShowAd(): boolean {
    return this.isLoaded;
  }

  reset() {
    this.isLoaded = false;
  }
}

export const adService = new AdService();
