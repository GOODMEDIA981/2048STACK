
import { AdMob, InterstitialAdOptions, RewardedAdOptions } from '@capacitor-community/admob';

class AdService {
  private isInterstitialLoaded: boolean = false;
  private isRewardedLoaded: boolean = false;
  
  // Google Test IDs
  private interstitialAdId: string = 'ca-app-pub-3940256099942544/1033173712';
  private rewardedAdId: string = 'ca-app-pub-3940256099942544/5224354917';

  async initialize(): Promise<void> {
    try {
      await AdMob.initialize();
      console.log('AdMob Initialized');
      // Pre-load ads immediately after initialization
      this.prepareInterstitial();
      this.prepareRewarded();
    } catch (e) {
      console.log('AdMob initialization skipped (Web/Dev mode)');
    }
  }

  // INTERSTITIAL LOGIC (For Periodic Restarts)
  async prepareInterstitial(): Promise<void> {
    try {
      const options: InterstitialAdOptions = { adId: this.interstitialAdId };
      await AdMob.prepareInterstitial(options);
      this.isInterstitialLoaded = true;
    } catch (e) {
      console.warn('Interstitial prep failed (Native plugin not found)');
      this.isInterstitialLoaded = false;
    }
  }

  async showInterstitial(): Promise<boolean> {
    try {
      await AdMob.showInterstitial();
      this.isInterstitialLoaded = false;
      this.prepareInterstitial(); // Preload next
      return true;
    } catch (e) {
      return false;
    }
  }

  // REWARDED LOGIC (For Continue Button)
  async prepareRewarded(): Promise<void> {
    try {
      const options: RewardedAdOptions = { adId: this.rewardedAdId };
      await AdMob.prepareRewardVideo(options);
      this.isRewardedLoaded = true;
    } catch (e) {
      console.warn('Rewarded prep failed (Native plugin not found)');
      this.isRewardedLoaded = false;
    }
  }

  async showRewarded(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        let rewarded = false;

        // Using string literals for event names to avoid export errors
        const rewardListener = await AdMob.addListener('rewardedAdReward', (reward) => {
          console.log('User earned reward:', reward);
          rewarded = true;
        });

        const dismissListener = await AdMob.addListener('rewardedAdDismissed', () => {
          rewardListener.remove();
          dismissListener.remove();
          resolve(rewarded);
        });

        const failedListener = await AdMob.addListener('rewardedAdFailedToShow', () => {
          rewardListener.remove();
          dismissListener.remove();
          failedListener.remove();
          resolve(false);
        });

        await AdMob.showRewardVideo();
        this.isRewardedLoaded = false;
        this.prepareRewarded(); // Preload next
      } catch (e) {
        // If native fails, return false to trigger web fallback
        resolve(false);
      }
    });
  }

  reset() {
    this.isInterstitialLoaded = false;
    this.isRewardedLoaded = false;
  }
}

export const adService = new AdService();
