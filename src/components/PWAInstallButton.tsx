import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

interface PWAInstallBannerProps {
  variant?: 'banner' | 'button' | 'badge';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallBannerProps> = ({
  variant = 'banner',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem('ek_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed in standalone mode, do not render
  if (isInstalled) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('ek_pwa_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      // Fallback for browsers that don't emit beforeinstallprompt yet
      setShowIOSGuide(true);
    }
  };

  // Badge / Compact Button variant (e.g., in Header)
  if (variant === 'button' || variant === 'badge') {
    return (
      <>
        <button
          id="btn-pwa-install-header"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181b16] text-[#fae092] border border-[#d4af37]/40 shadow-xs hover:bg-[#252b22] active:scale-95 transition-all text-xs font-semibold ${className}`}
          title="Installer l'application EK Traiteur sur votre écran d'accueil"
        >
          <Download className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Installer</span>
        </button>

        {showIOSGuide && (
          <IOSInstallGuideModal 
            isIOS={isIOS} 
            onClose={() => setShowIOSGuide(false)} 
          />
        )}
      </>
    );
  }

  // Floating or Banner variant (default)
  if (isDismissed) {
    return (
      <>
        {showIOSGuide && (
          <IOSInstallGuideModal 
            isIOS={isIOS} 
            onClose={() => setShowIOSGuide(false)} 
          />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        id="pwa-install-banner"
        className={`mx-4 my-2 p-3 bg-gradient-to-r from-[#171a15] to-[#232a20] rounded-2xl border border-[#d4af37]/30 text-white shadow-lg flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#0f120e] p-1 border border-[#d4af37]/40 flex-shrink-0 flex items-center justify-center">
            <img 
              src="/pwa-192x192.png" 
              alt="EK Traiteur Logo" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              Installer l'application EK Traiteur
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#fae092] font-semibold">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-gray-300 truncate">
              Accès rapide hors-ligne et expérience fluide
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            id="btn-pwa-install-action"
            onClick={handleInstallClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#d4af37] text-[#141613] font-bold text-xs hover:bg-[#fae092] active:scale-95 transition-all shadow-sm"
          >
            {installSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-800" />
                <span>Installé !</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Installer</span>
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Fermer la notification d'installation"
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <IOSInstallGuideModal 
          isIOS={isIOS} 
          onClose={() => setShowIOSGuide(false)} 
        />
      )}
    </>
  );
};

interface GuideModalProps {
  isIOS: boolean;
  onClose: () => void;
}

const IOSInstallGuideModal: React.FC<GuideModalProps> = ({ isIOS, onClose }) => {
  return (
    <div 
      id="modal-pwa-guide"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#1a1e18] text-white p-6 shadow-2xl border border-[#d4af37]/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0f120e] p-1 border border-[#d4af37]/40 flex items-center justify-center">
              <img 
                src="/pwa-192x192.png" 
                alt="EK Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ena's Kitchen sur votre écran</h3>
              <p className="text-xs text-[#d4af37]">Installation simple en 2 étapes</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3.5 my-4 text-xs text-gray-200">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 font-bold">
                <Share className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">1. Touchez Partager</p>
                <p className="text-gray-400 mt-0.5">Dans la barre d'actions en bas de Safari.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 text-[#fae092] flex items-center justify-center flex-shrink-0 font-bold">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">2. « Sur l'écran d'accueil »</p>
                <p className="text-gray-400 mt-0.5">Faites défiler le menu puis confirmez avec « Ajouter ».</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 my-4 text-xs text-gray-200">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 text-[#fae092] flex items-center justify-center flex-shrink-0 font-bold">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Menu du navigateur</p>
                <p className="text-gray-400 mt-0.5">
                  Cliquez sur les 3 points ou l'icône d'installation dans la barre d'adresse, puis choisissez <strong>« Installer l'application »</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-2xl bg-[#d4af37] text-[#141613] font-bold text-xs hover:bg-[#fae092] transition-colors"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};
