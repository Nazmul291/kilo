import React from "react";
import { X, ShieldCheck, Lock, Cookie, FileText } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "privacy" | "terms";
}

export function LegalModal({ isOpen, onClose, initialTab = "privacy" }: LegalModalProps) {
  const [activeTab, setActiveTab] = React.useState<"privacy" | "terms">(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Legal &amp; Compliance</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "privacy"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "terms"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          {activeTab === "privacy" ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  1. 100% Private Media Processing
                </h4>
                <p className="text-slate-400">
                  Kilo processes all images and media assets exclusively in your device’s local memory (RAM) via HTML5 Canvas and browser APIs. Your files are <strong>never uploaded, stored, or transmitted</strong> to any external server or third-party cloud storage.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Cookie className="w-4 h-4 text-amber-400" />
                  2. Cookies &amp; Google AdSense Advertising
                </h4>
                <p className="text-slate-400">
                  We use Google AdSense to serve advertisements on this website to keep the service free. Google and its advertising partners use cookies to serve ads based on your prior visits to this website or other websites on the Internet:
                </p>
                <ul className="list-disc pl-5 mt-1 text-slate-400 space-y-1">
                  <li>Google's use of advertising cookies enables it and its partners to serve ads based on visits to our site and/or other sites on the Internet.</li>
                  <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Google Ads Settings</a>.</li>
                  <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">aboutads.info</a>.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  3. Local Storage Preferences
                </h4>
                <p className="text-slate-400">
                  We may store your cookie consent choice in your browser’s local storage solely to prevent showing the consent banner repeatedly on return visits. No personal identification data is stored.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  4. Contact Information
                </h4>
                <p className="text-slate-400">
                  If you have questions regarding this privacy policy or our data practices, please contact us at: <a href="mailto:info@nazmulcodes.org" className="text-emerald-400 font-semibold underline">info@nazmulcodes.org</a> or visit <a href="https://www.nazmulcodes.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold underline">nazmulcodes.org</a>.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  1. Acceptance of Terms
                </h4>
                <p className="text-slate-400">
                  By accessing and using Kilo, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you may discontinue use of the service.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  2. Usage &amp; Intellectual Property
                </h4>
                <p className="text-slate-400">
                  You retain full ownership and copyright of all media assets you compress or convert using Kilo. Kilo does not claim any rights, titles, or interest in any images processed through the application.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  3. Disclaimer of Warranties
                </h4>
                <p className="text-slate-400">
                  Kilo is provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. While we strive for optimal image quality and high conversion fidelity, we do not guarantee that the tool will meet every requirement or run uninterrupted.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">
                  4. Limitation of Liability
                </h4>
                <p className="text-slate-400">
                  In no event shall Kilo or its creators be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use this service.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
