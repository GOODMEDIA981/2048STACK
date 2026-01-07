
import React from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-blue-950/98 backdrop-blur-xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">Legal Information</h2>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 text-left">
        {/* PRIVACY POLICY SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white border-b border-white/20 pb-2 uppercase tracking-tighter">Privacy Policy</h2>
          
          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">1. Overview</h3>
            <p className="text-white text-sm leading-relaxed">
              2048STACK is an ad-supported game. By using this application, you acknowledge that certain data collection is <strong>required</strong> for the game to function and provide its features.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">2. Required Data Collection</h3>
            <p className="text-white text-sm leading-relaxed mb-3">
              This app uses the <strong>Google AdMob SDK</strong>. Because the game is free and ad-supported, the collection of the following data is <strong>mandatory</strong> and cannot be opted-out of within the app:
            </p>
            <ul className="list-disc pl-5 text-white text-sm space-y-2">
              <li><strong>Device or other IDs:</strong> Your Android Advertising ID is collected to serve ads, measure performance, and prevent fraud. This data is <strong>shared</strong> with third parties (Google).</li>
              <li><strong>App Performance Data:</strong> Crash logs, diagnostics, and performance metrics are collected and shared to ensure game stability and security.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">3. Data Usage & Processing</h3>
            <p className="text-white text-sm leading-relaxed">
              Data is <strong>not processed ephemerally</strong>; it is stored by our partners for advertising and analytics purposes. All data transfers are performed over secure, encrypted connections (HTTPS).
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">4. AI Interaction</h3>
            <p className="text-white text-sm leading-relaxed">
              Basic game metrics (scores) are sent to the <strong>Google Gemini API</strong> to generate real-time reactions. No personally identifiable information is sent to the Gemini service.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">5. Your Rights</h3>
            <p className="text-white text-sm leading-relaxed">
              High scores are stored locally. You can delete this by clearing app data in your device settings. To manage your Advertising ID, visit your Google Account's "Ads" settings.
            </p>
          </section>
        </div>

        {/* TERMS OF SERVICE SECTION */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-xl font-black text-white border-b border-white/20 pb-2 uppercase tracking-tighter">Terms of Service</h2>
          
          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">1. Acceptance</h3>
            <p className="text-white text-sm leading-relaxed">
              Continued use of 2048STACK constitutes acceptance of these terms and the mandatory data collection required by our third-party providers.
            </p>
          </section>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-6 w-full py-4 bg-white text-blue-950 font-black rounded-xl shadow-lg active:scale-95 transition-transform"
      >
        I ACCEPT & PLAY
      </button>
    </div>
  );
};

export default PrivacyPolicyModal;
