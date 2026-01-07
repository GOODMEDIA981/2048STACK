
import { AdMob, InterstitialAdOptions, RewardedAdOptions } from '@capacitor-community/admob';

/**
 * ADMOB PRODUCTION CHECKLIST:
 * 1. Replace the IDs below with your REAL "Ad Unit IDs" from the AdMob dashboard.
 * 2. The "App ID" (with the ~) goes in capacitor.config.json and AndroidManifest.xml.
 * 3. The "Ad Unit IDs" (with the /) go here.
 */
class AdService {
  private isInterstitialLoaded: boolean = false;
  private isRewardedLoaded: boolean = false;
  
  // REPLACE THESE WITH YOUR REAL "AD UNIT IDs" (Format: ca-app-pub-XXX/YYY)
  private readonly INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712'; // Replace this
  private readonly REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';     // Replace this

  async initialize(): Promise<void> {
    try {
      await AdMob.initialize();
      console.log('AdMob Initialized Successfully');
      this.prepareInterstitial();
      this.prepareRewarded();
    } catch (e) {
      console.warn('AdMob init failed: Native environment not detected or plugin missing.');
    }
  }

  async prepareInterstitial(): Promise<void> {
    try {
      const options: InterstitialAdOptions = { adId: this.INTERSTITIAL_ID };
      await AdMob.prepareInterstitial(options);
      this.isInterstitialLoaded = true;
    } catch (e) {
      this.isInterstitialLoaded = false;
    }
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.isInterstitialLoaded) return false;
    try {
      await AdMob.showInterstitial();
      this.isInterstitialLoaded = false;
      this.prepareInterstitial();
      return true;
    } catch (e) {
      return false;
    }
  }

  async prepareRewarded(): Promise<void> {
    try {
      const options: RewardedAdOptions = { adId: this.REWARDED_ID };
      await AdMob.prepareRewardVideo(options);
      this.isRewardedLoaded = true;
    } catch (e) {
      this.isRewardedLoaded = false;
    }
  }

  async showRewarded(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        let rewardEarned = false;

        const rewardListener = await AdMob.addListener('rewardedAdReward', () => {
          rewardEarned = true;
        });

        const dismissListener = await AdMob.addListener('rewardedAdDismissed', () => {
          rewardListener.remove();
          dismissListener.remove();
          resolve(rewardEarned);
        });

        await AdMob.showRewardVideo();
        this.isRewardedLoaded = false;
        this.prepareRewarded();
      } catch (e) {
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
