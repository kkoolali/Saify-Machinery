import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Phone, Key, ArrowRight, Loader2, 
    CheckCircle, AlertCircle, RefreshCcw
} from 'lucide-react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../lib/firebase';
import { ConfirmationResult } from 'firebase/auth';

interface PhoneAuthProps {
    onSuccess: (phoneNumber: string) => void;
}

export default function PhoneAuth({ onSuccess }: PhoneAuthProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            setupRecaptcha();
            const appVerifier = (window as any).recaptchaVerifier;
            
            // Format phone number if it doesn't start with +
            let formattedPhone = phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                // Default to India (+91) if no country code provided
                formattedPhone = `+91${formattedPhone}`;
            }

            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(result);
            setStep('otp');
            setTimer(60);
        } catch (err: any) {
            console.error("OTP Send Error:", err);
            setError(err.message || "Failed to send OTP. Please check the number.");
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
                (window as any).recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationResult) return;
        
        setError(null);
        setLoading(true);

        try {
            const result = await confirmationResult.confirm(otp);
            if (result.user) {
                onSuccess(result.user.phoneNumber || phoneNumber);
            }
        } catch (err: any) {
            console.error("OTP Verify Error:", err);
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div id="recaptcha-container"></div>
            
            <AnimatePresence mode="wait">
                {step === 'phone' ? (
                    <motion.div
                        key="phone-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-brand-blue/5 p-6 rounded-3xl border border-brand-blue/10">
                            <h3 className="text-xl font-heading font-black italic text-gray-900 tracking-tight leading-none mb-3">Verification Required</h3>
                            <p className="text-xs text-gray-500 font-medium italic">Bhai, for security and technical verification of your order, please verify your mobile number via OTP.</p>
                        </div>

                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Phone size={12} className="text-brand-orange" /> Mobile Number
                                </label>
                                <div className="relative">
                                    <input 
                                        required
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter 10-digit number"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-black text-lg tracking-widest italic"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 italic">
                                        INDIA (+91)
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button 
                                disabled={loading || phoneNumber.length < 10}
                                type="submit"
                                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-gray-200 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Get Verification Code <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                            <h3 className="text-xl font-heading font-black italic text-green-900 tracking-tight leading-none mb-3">Code Sent!</h3>
                            <p className="text-xs text-green-700 font-medium italic">We've sent a 6-digit code to <span className="font-black underline">{phoneNumber}</span>. Please enter it below to authorize this session.</p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Key size={12} className="text-brand-orange" /> 6-Digit OTP
                                </label>
                                <input 
                                    required
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/5 focus:border-green-500 outline-none transition-all font-black text-3xl tracking-[0.5em] text-center italic"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button 
                                disabled={loading || otp.length !== 6}
                                type="submit"
                                className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20 hover:bg-brand-blue-dark hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Authorize & Continue <CheckCircle size={16} />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-between px-2">
                                <button 
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-[10px] font-black text-gray-400 hover:text-brand-blue uppercase tracking-widest transition-colors"
                                >
                                    Change Number
                                </button>
                                <button 
                                    disabled={timer > 0}
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-[10px] font-black text-brand-orange hover:text-brand-orange-light uppercase tracking-widest transition-colors flex items-center gap-1 disabled:opacity-50"
                                >
                                    <RefreshCcw size={10} className={loading ? 'animate-spin' : ''} />
                                    {timer > 0 ? `Resend In ${timer}s` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
