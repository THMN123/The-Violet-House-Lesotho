import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';

interface SecretPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctPasscode?: string;
  onSuccess: () => void;
}

export const SecretPasscodeModal: React.FC<SecretPasscodeModalProps> = ({
  isOpen,
  onClose,
  correctPasscode = '1234',
  onSuccess,
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(false);
      setShake(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric characters
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError(false);

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto verify when all 4 digits are entered
    if (digit && index === 3 && newPin.every((d) => d !== '')) {
      verifyPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'Enter') {
      verifyPin(pin.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (!pasted) return;

    const newPin = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newPin[i] = pasted[i];
    }
    setPin(newPin);
    if (pasted.length === 4) {
      verifyPin(pasted);
    } else {
      inputRefs[Math.min(pasted.length, 3)].current?.focus();
    }
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === correctPasscode) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: shake ? [-10, 10, -8, 8, -4, 4, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-700/60 p-8 shadow-2xl z-10 text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 shadow-[0_0_25px_rgba(138,43,226,0.3)]">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-serif tracking-wider font-light uppercase text-zinc-100">
                Security Gateway
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Enter your 4-digit administration PIN
              </p>
            </div>

            {/* PIN Inputs */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-14 h-16 text-center text-2xl font-mono font-bold rounded-2xl bg-zinc-800/80 border transition-all duration-200 focus:outline-none ${
                    error
                      ? 'border-red-500/80 text-red-400 bg-red-950/20'
                      : digit
                      ? 'border-violet-500 text-violet-200 bg-violet-950/20'
                      : 'border-zinc-700 focus:border-violet-400 text-white'
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-red-400 text-xs font-medium mb-6 bg-red-950/30 border border-red-500/20 rounded-xl py-2 px-3"
              >
                <ShieldAlert size={14} />
                <span>Incorrect PIN. Please try again.</span>
              </motion.div>
            )}

            {/* Submit / Info */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => verifyPin(pin.join(''))}
                disabled={pin.some((d) => d === '')}
                className="w-full py-3.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 text-white shadow-lg shadow-violet-900/30 transition-all cursor-pointer"
              >
                <span>Authorize Access</span>
                <ArrowRight size={16} />
              </button>
              
              <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1 pt-1">
                <span className="flex items-center gap-1">
                  <KeyRound size={12} /> Default PIN: 1234
                </span>
                <span>Encrypted Session</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
