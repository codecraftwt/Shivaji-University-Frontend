import React from "react";

export default function Loader({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden" 
    : "flex items-center justify-center w-full min-h-[50vh] bg-white overflow-hidden";

  return (
    <div className={containerClasses}>
      <style>{`
        :root {
          --maroon-dark: #5c1a1a;
          --maroon: #7a1f1f;
          --maroon-deep: #3d1010;
          --gold: #c9a24b;
          --gold-light: #e6cd8a;
          --cream: #f7f1e6;
          --ink: #2b1810;
        }

        .loader-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          z-index: 1;
          font-family: 'Georgia', 'Cambria', serif;
        }

        /* --- Emblem ring --- */
        .emblem-stage {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }

        .ring--outer {
          border: 2px solid rgba(122,31,31,0.12);
        }

        .ring--track {
          border: 3px solid transparent;
          border-top-color: #1E90FF;
          border-right-color: #FF7B12;
          animation: loader-spin 1.6s cubic-bezier(0.65,0.05,0.36,1) infinite;
          filter: drop-shadow(0 0 4px rgba(30,144,255,0.25));
        }

        .ring--dotted {
          inset: 14px;
          border: 1px dashed rgba(255,123,18,0.5);
          animation: loader-spin-rev 9s linear infinite;
        }

        @keyframes loader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loader-spin-rev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .emblem {
          width: 108px;
          height: 108px;
          border-radius: 50%;
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 4px rgba(201,162,75,0.9),
            0 4px 18px rgba(122,31,31,0.18),
            inset 0 0 10px rgba(0,0,0,0.08);
          animation: loader-breathe 2.4s ease-in-out infinite;
          overflow: hidden;
        }

        .emblem img {
          width: 88%;
          height: 88%;
          object-fit: contain;
        }

        @keyframes loader-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.045); }
        }

        /* --- Text --- */
        .loader-text {
          text-align: center;
        }

        .loader-title {
          color: var(--maroon);
          font-size: 15px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .loader-sub {
          margin-top: 8px;
          color: rgba(43,24,16,0.45);
          font-size: 12px;
          letter-spacing: 1.5px;
          font-family: 'Trebuchet MS', sans-serif;
        }

        .loader-sub .dots span {
          display: inline-block;
          animation: loader-blink 1.4s infinite;
        }
        .loader-sub .dots span:nth-child(2) { animation-delay: 0.2s; }
        .loader-sub .dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes loader-blink {
          0%, 80%, 100% { opacity: 0.15; }
          40% { opacity: 1; }
        }

        /* --- Progress hairline --- */
        .hairline {
          width: 220px;
          height: 2px;
          background: rgba(122,31,31,0.1);
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }

        .hairline::after {
          content: "";
          position: absolute;
          top: 0; bottom: 0;
          left: -40%;
          width: 40%;
          background: linear-gradient(90deg, transparent, #1E90FF, transparent);
          animation: loader-sweep 1.6s ease-in-out infinite;
        }

        @keyframes loader-sweep {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ring--track, .ring--dotted, .emblem, .hairline::after, .loader-sub .dots span {
            animation: none !important;
          }
        }
      `}</style>
      
      <div className="loader-wrap">
        <div className="emblem-stage">
          <div className="loader-ring ring--outer"></div>
          <div className="loader-ring ring--track"></div>
          <div className="loader-ring ring--dotted"></div>
          <div className="emblem">
            <img src="data:image/png;base64,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" alt="University Emblem" />
          </div>
        </div>

        <div className="loader-text">
          <div className="loader-title">Shivaji University</div>
          <div className="loader-sub">Loading<span className="dots"><span>.</span><span>.</span><span>.</span></span></div>
        </div>

        <div className="hairline"></div>
      </div>
    </div>
  );
}
