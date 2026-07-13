import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Music, ArrowRight, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'N/A';

  useEffect(() => {
    // Clear cart since the payment was successful
    clearCart();
  }, []);

  return (
    <div className="max-w-md mx-auto py-16 px-4 pb-32">
      <div className="glassmorphic rounded-2xl p-8 border border-brand-border text-center shadow-glow-green/10">
        
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green/10 text-brand-green mb-6">
          <CheckCircle2 className="w-10 h-10 shadow-glow-green" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-brand-green font-semibold text-sm mb-4">Thank you for supporting independent artists</p>
        
        <div className="bg-brand-surfaceCard border border-brand-border rounded-xl p-4 mb-8 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-brand-textMuted">Session ID:</span>
            <span className="text-white font-mono truncate max-w-[200px]" title={sessionId}>
              {sessionId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-textMuted">Status:</span>
            <span className="text-brand-green font-semibold">Paid (Test Mode)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-textMuted">Delivery:</span>
            <span className="text-white">Instant Download / Streaming Access</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => alert('Downloading high-quality WAV files for your purchased tracks...')}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-brand-green hover:bg-brand-green-light text-black font-semibold shadow-glow-green hover:scale-[1.02] transition-all duration-300"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Download High-Quality Tracks</span>
          </button>
          
          <Link
            to="/"
            className="w-full flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-brand-surfaceCard hover:bg-brand-surfaceHover text-white border border-brand-border font-semibold transition-all duration-300"
          >
            <span>Back to Explore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSuccess;
