
import { AdMob, InterstitialAdOptions, RewardedAdOptions } from '@capacitor-community/admob';

/**
 * ADMOB PRODUCTION CHECKLIST:
 * 1. Your App ID (ca-app-pub-7362193729014835~3043920483) is already in capacitor.config.json.
 * 2. You now need "Ad Unit IDs" (which have a "/" instead of a "~") for the variables below.
 * 3. Go to AdMob > Ad Units > Create Ad Unit (Interstitial and Rewarded).
 */
class AdService {
  private isInterstitialLoaded: boolean = false;
  private isRewardedLoaded: boolean = false;
  
  // !!! ACTION REQUIRED: Replace these test IDs with your REAL "Ad Unit IDs" from AdMob !!!
  // These look like ca-app-pub-7362193729014835/XXXXXXXXXX
  private readonly INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712'; // Test Interstitial ID
  private readonly REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';     // Test Rewarded ID

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
