import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Smartphone, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { authOpen, setAuthOpen, loginWithIdentifier, registerCustomer, switchDemoRole, notify } =
    useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [identifier, setIdentifier] = useState('ananya.rao@example.com');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [resetSent, setResetSent] = useState(false);

  if (!authOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      notify('6-digit OTP dispatched (use 482910 to verify).', 'info');
      return;
    }
    if (otpCode.trim().length < 4) {
      notify('Enter the 6-digit OTP code (482910).', 'error');
      return;
    }
    loginWithIdentifier(identifier);
    setAuthOpen(false);
    setOtpSent(false);
    setOtpCode('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) return;
    registerCustomer({
      name: regName,
      email: regEmail,
      phone: regPhone,
      whatsappOptIn,
    });
    setAuthOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Customer Account Authentication"
    >
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6">
        <button
          type="button"
          onClick={() => setAuthOpen(false)}
          aria-label="Close sign in"
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent-gold)] font-semibold">
            Vastra Atelier Account
          </p>
          <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] mt-1">
            {mode === 'login'
              ? 'Patron Sign In'
              : mode === 'register'
              ? 'Create Patron Profile'
              : 'Reset Password'}
          </h2>
        </div>

        <div className="flex gap-2 p-1 bg-[var(--bg-subtle)] rounded-lg text-xs">
          {[
            { id: 'login', label: 'Sign In / OTP' },
            { id: 'register', label: 'New Account' },
            { id: 'reset', label: 'Forgot Password' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setMode(t.id as typeof mode);
                setOtpSent(false);
                setResetSent(false);
              }}
              className={`flex-1 py-1.5 rounded-md font-medium cursor-pointer ${
                mode === t.id
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or +91 98201..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-medium text-[var(--text-secondary)]">6-Digit OTP</label>
                  <span className="text-[var(--accent)] font-medium">Demo OTP: 482910</span>
                </div>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 482910"
                  className="w-full px-3 py-2.5 text-xs bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md tabular-nums"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] text-xs font-semibold rounded-md cursor-pointer"
            >
              {otpSent ? 'Verify OTP & Sign In' : 'Send Verification OTP'}
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
            />
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
            />
            <input
              type="tel"
              required
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              placeholder="Mobile Number (+91 ...)"
              className="w-full px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
            />
            <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
              />
              <span>Send order updates &amp; new weave previews on WhatsApp</span>
            </label>
            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white dark:text-[#141416] font-semibold rounded-md cursor-pointer"
            >
              Create Account
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <div className="space-y-3 text-xs">
            {resetSent ? (
              <p className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded">
                A password reset link and recovery OTP have been dispatched to {identifier}.
              </p>
            ) : (
              <>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Registered Email or Mobile"
                  className="w-full px-3 py-2.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="w-full py-2.5 bg-[var(--text-primary)] text-[var(--bg-surface)] font-semibold rounded-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Send Recovery Link
                </button>
              </>
            )}
          </div>
        )}

        {/* Quick RBAC Role Switcher for Testing Customer / Staff / Admin */}
        <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            Quick Role Access (Customer · Staff · Admin)
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                switchDemoRole('customer');
                setAuthOpen(false);
              }}
              className="py-1.5 px-2 border border-[var(--border-color)] rounded hover:border-[var(--accent)] cursor-pointer"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('staff');
                setAuthOpen(false);
              }}
              className="py-1.5 px-2 border border-[var(--border-color)] rounded hover:border-[var(--accent)] cursor-pointer"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('admin');
                setAuthOpen(false);
              }}
              className="py-1.5 px-2 bg-[var(--text-primary)] text-[var(--bg-surface)] rounded cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
