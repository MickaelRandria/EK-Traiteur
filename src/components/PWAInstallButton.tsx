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
  // La bannière n'apparaît qu'à partir de la 2e visite, pour laisser le catalogue en premier plan
  const [isReturningVisitor] = useState(() => {
    try {
      let visits = Number(localStorage.getItem('ek_visits') || '0');
      if (!sessionStorage.getItem('ek_visit_counted')) {
        visits += 1;
        localStorage.setItem('ek_visits', String(visits));
        sessionStorage.setItem('ek_visit_counted', 'true');
      }
      return visits >= 2;
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

  const guide = showIOSGuide && <InstallGuideModal isIOS={isIOS} onClose={() => setShowIOSGuide(false)} />;

  // Bouton compact (menu)
  if (variant === 'button' || variant === 'badge') {
    return (
      <>
        <button
          id="btn-pwa-install-header"
          type="button"
          onClick={handleInstallClick}
          className={`btn-outline shrink-0 ${className}`}
          title="Installer l'application EK Traiteur sur votre écran d'accueil"
        >
          <Download className="w-4 h-4" strokeWidth={1.3} />
          Installer
        </button>
        {guide}
      </>
    );
  }

  // Bannière (à partir de la 2e visite)
  if (isDismissed || !isReturningVisitor) {
    return <>{guide}</>;
  }

  return (
    <>
      <div
        id="pwa-install-banner"
        className={`mx-6 md:mx-10 mt-2 px-4 py-3 bg-cream rounded-[2px] flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Smartphone className="w-5 h-5 text-sage shrink-0" strokeWidth={1.2} />
          <p className="text-[13px] text-ink-soft truncate">Ena's Kitchen sur votre écran d'accueil</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            id="btn-pwa-install-action"
            type="button"
            onClick={handleInstallClick}
            className="h-9 px-3 text-[12px] tracking-[0.12em] uppercase text-sage flex items-center gap-1.5"
          >
            {installSuccess ? <CheckCircle className="w-4 h-4" strokeWidth={1.3} /> : <Download className="w-4 h-4" strokeWidth={1.3} />}
            {installSuccess ? 'Installée' : 'Installer'}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fermer la notification d'installation"
            className="w-9 h-9 flex items-center justify-center text-muted hover:text-ink"
          >
            <X className="w-4 h-4" strokeWidth={1.3} />
          </button>
        </div>
      </div>
      {guide}
    </>
  );
};

interface GuideModalProps {
  isIOS: boolean;
  onClose: () => void;
}

const InstallGuideModal: React.FC<GuideModalProps> = ({ isIOS, onClose }) => {
  const steps = isIOS
    ? [
        { icon: Share, title: '1. Touchez « Partager »', text: "Dans la barre d'actions en bas de Safari." },
        { icon: PlusSquare, title: "2. « Sur l'écran d'accueil »", text: 'Faites défiler le menu puis confirmez avec « Ajouter ».' },
      ]
    : [
        {
          icon: Smartphone,
          title: 'Menu du navigateur',
          text: "Ouvrez le menu (les 3 points) ou l'icône d'installation dans la barre d'adresse, puis « Installer l'application ».",
        },
      ];

  return (
    <div
      id="modal-pwa-guide"
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Installer l'application"
        className="w-full max-w-sm rounded-[4px] bg-ivory p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex flex-col gap-1">
            <span className="eyebrow">Installation</span>
            <h3 className="font-serif text-[26px] leading-none">Ena's Kitchen sur votre écran</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="icon-btn -mr-2 -mt-1">
            <X className="w-5 h-5" strokeWidth={1.3} />
          </button>
        </div>
        <div className="flex flex-col border-t border-line">
          {steps.map((step) => (
            <div key={step.title} className="flex items-start gap-3 py-4 border-b border-line">
              <step.icon className="w-5 h-5 text-sage shrink-0 mt-0.5" strokeWidth={1.2} />
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-normal">{step.title}</p>
                <p className="text-[13px] text-muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={onClose} className="btn-primary w-full mt-5">
          J'ai compris
        </button>
      </div>
    </div>
  );
};
