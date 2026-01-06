
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
              2048STACK is committed to protecting your privacy. This policy describes how we handle data when you play our game.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">2. Third-Party Services</h3>
            <p className="text-white text-sm leading-relaxed mb-3">
              We use third-party providers to enhance your experience. These services may collect information used to identify you:
            </p>
            <ul className="list-disc pl-5 text-white text-sm space-y-2">
              <li><strong>Google AdMob:</strong> Used for displaying advertisements. They may collect Advertising IDs to provide personalized ads.</li>
              <li><strong>Google Gemini API:</strong> We send game metrics (score, merge values) to Google's AI models to generate real-time commentary. No personal identity data is sent to the AI.</li>
              <li><strong>Google Play Services:</strong> Core functionality for Android devices.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">3. Data Collection</h3>
            <p className="text-white text-sm leading-relaxed">
              We do not collect personal information like your name or email. We only store game-related data (high scores) locally on your device.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">4. Children's Privacy</h3>
            <p className="text-white text-sm leading-relaxed">
              We do not knowingly collect data from children under the age of 13. If you believe we have inadvertently collected such data, please contact us.
            </p>
          </section>
        </div>

        {/* TERMS OF SERVICE SECTION */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-xl font-black text-white border-b border-white/20 pb-2 uppercase tracking-tighter">Terms of Service</h2>
          
          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">1. Acceptance of Terms</h3>
            <p className="text-white text-sm leading-relaxed">
              By accessing or using 2048STACK, you agree to be bound by these Terms of Service. If you do not agree, do not use the application.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">2. User Conduct</h3>
            <p className="text-white text-sm leading-relaxed">
              Users are prohibited from attempting to reverse engineer, decompile, or otherwise extract the source code of the application. Cheating or exploiting game physics is prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">3. Intellectual Property</h3>
            <p className="text-white text-sm leading-relaxed">
              All visual assets, sounds, and software code are the property of the developer. You are granted a limited, non-exclusive license to play the game for personal entertainment.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">4. Disclaimer of Warranty</h3>
            <p className="text-white text-sm leading-relaxed">
              The game is provided "as is" without warranty of any kind. The developer is not responsible for any data loss or device damage resulting from the use of the app.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">5. Changes to Terms</h3>
            <p className="text-white text-sm leading-relaxed">
              The developer reserves the right to modify these terms at any time. Continued use of the app constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-6 w-full py-4 bg-white text-blue-950 font-black rounded-xl shadow-lg active:scale-95 transition-transform"
      >
        I ACCEPT
      </button>
    </div>
  );
};

export default PrivacyPolicyModal;
