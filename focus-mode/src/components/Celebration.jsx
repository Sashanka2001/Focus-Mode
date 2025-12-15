import React, { useEffect } from 'react';

export default function Celebration({ message = 'Huyeyi well done', onClose = () => {} }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      <div className="relative pointer-events-auto max-w-lg w-full mx-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="ribbon mr-4" aria-hidden="true" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{message}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Great job — keep your momentum!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`\n        .ribbon {\n          width: 84px;\n          height: 84px;\n          background: linear-gradient(135deg,#FFD166 0%,#F0932B 100%);\n          border-radius: 8px;\n          transform: translateY(-220px) rotate(-10deg);\n          box-shadow: 0 6px 18px rgba(0,0,0,0.25);\n          animation: dropRibbon 700ms cubic-bezier(.2,.9,.3,1) forwards;\n        }\n        .ribbon::after, .ribbon::before {\n          content: '';\n          position: absolute;\n          bottom: -14px;\n          width: 26px;\n          height: 26px;\n          background: linear-gradient(135deg,#FFD166 0%,#F0932B 100%);\n          transform: rotate(45deg);\n          border-radius: 2px;\n        }\n        .ribbon::before { left: 8px; }\n        .ribbon::after { right: 8px; }\n\n        @keyframes dropRibbon {\n          0% { transform: translateY(-220px) rotate(-20deg); opacity: 0 }\n          60% { transform: translateY(8px) rotate(-6deg); opacity: 1 }\n          80% { transform: translateY(-6px) rotate(-2deg); }\n          100% { transform: translateY(0) rotate(0deg); }\n        }\n      `}</style>
    </div>
  );
}
