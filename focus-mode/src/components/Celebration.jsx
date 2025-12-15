import React, { useEffect, useMemo } from 'react';

export default function Celebration({ message = 'Huyeyi well done', onClose = () => {}, imageSrc = '/confetti.png' }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(), 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  // generate confetti pieces once per mount
  const pieces = useMemo(() => {
    const cols = ['#FF6B6B', '#FFD166', '#6BCB77', '#4D96FF', '#A76CFF'];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.round(10 + Math.random() * 80),
      delay: Math.round(Math.random() * 400),
      color: cols[i % cols.length],
      rotate: Math.round(Math.random() * 360),
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      <div className="relative pointer-events-auto max-w-lg w-full mx-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl text-center overflow-hidden">
          <div className="flex items-center justify-center mb-4">
            <div className="ribbon mr-4" aria-hidden="true" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{message}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Great job — keep your momentum!</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center">
            <img src={imageSrc} alt="celebrate" className="celebration-img w-40 h-40 object-contain" />
          </div>
        </div>
      </div>

      {/* confetti pieces */}
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}%`, background: p.color, transform: `rotate(${p.rotate}deg)`, animationDelay: `${p.delay}ms` }}
        />
      ))}

      <style>{`
        .ribbon {
          width: 84px;
          height: 84px;
          background: linear-gradient(135deg,#FFD166 0%,#F0932B 100%);
          border-radius: 8px;
          transform: translateY(-220px) rotate(-10deg);
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          animation: dropRibbon 700ms cubic-bezier(.2,.9,.3,1) forwards;
        }
        .ribbon::after, .ribbon::before {
          content: '';
          position: absolute;
          bottom: -14px;
          width: 26px;
          height: 26px;
          background: linear-gradient(135deg,#FFD166 0%,#F0932B 100%);
          transform: rotate(45deg);
          border-radius: 2px;
        }
        .ribbon::before { left: 8px; }
        .ribbon::after { right: 8px; }

        @keyframes dropRibbon {
          0% { transform: translateY(-220px) rotate(-20deg); opacity: 0 }
          60% { transform: translateY(8px) rotate(-6deg); opacity: 1 }
          80% { transform: translateY(-6px) rotate(-2deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .celebration-img { animation: popScale 600ms cubic-bezier(.2,.9,.3,1), floatUp 3200ms ease-in-out both; }
        @keyframes popScale { 0% { transform: scale(0.2); opacity: 0 } 60% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1); } }
        @keyframes floatUp { 0% { transform: translateY(0) } 100% { transform: translateY(-12px) } }

        .confetti-piece {
          position: fixed;
          top: 30%;
          width: 10px;
          height: 18px;
          border-radius: 2px;
          opacity: 0.95;
          transform-origin: center;
          animation: confettiFall 1500ms cubic-bezier(.2,.6,.2,1) forwards;
        }

        @keyframes confettiFall {
          0% { transform: translateY(-40vh) scale(1) rotate(0deg); opacity: 1 }
          60% { transform: translateY(0vh) rotate(180deg); }
          100% { transform: translateY(30vh) rotate(360deg); opacity: 0 }
        }
      `}</style>
    </div>
  );
}
