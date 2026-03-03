import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, ArrowRight, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { emailConfig } from '../config/emailConfig';

const OTPForm = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const otpInputs = useRef([]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsLoading(true);
        setError('');
        const code = generateOTP();
        setGeneratedOtp(code);

        try {
            // Note: In a real app, you'd send this via EmailJS
            // To prevent errors if keys are missing, we'll log it and proceed if in "demo" mode
            console.log('Generated OTP:', code);

            if (emailConfig.publicKey !== 'YOUR_PUBLIC_KEY') {
                const templateParams = {
                    to_email: email,
                    otp_code: code,
                };
                await emailjs.send(
                    emailConfig.serviceId,
                    emailConfig.templateId,
                    templateParams,
                    emailConfig.publicKey
                );
            } else {
                console.warn('EmailJS keys missing. Simulating email send for demo.');
                alert(`DEMO MODE: OTP sent to ${email} (Check console for code)`);
            }

            setStep(2);
            setTimer(60);
        } catch (err) {
            setError('Failed to send email. Please check your credentials.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        if (enteredOtp === generatedOtp) {
            setStep(3);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
    };

    return (
        <div className="glass-morphism" style={{ padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '450px' }}>
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ background: 'var(--glass-bg)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <Mail size={32} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>Welcome Back</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Enter your email to receive a verification code</p>
                        </div>

                        <form onSubmit={handleSendOTP}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div style={{ color: 'var(--error)', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <button type="submit" className="glow-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={isLoading}>
                                {isLoading ? <RefreshCcw className="animate-spin" size={20} /> : <>Send Code <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ background: 'var(--glass-bg)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <ShieldCheck size={32} color="var(--accent)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>Two-Step Verification</h2>
                            <p style={{ color: 'var(--text-dim)' }}>We've sent a 6-digit code to <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{email}</span></p>
                        </div>

                        <form onSubmit={handleVerifyOTP}>
                            <div className="otp-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpInputs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        className="otp-input"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                ))}
                            </div>

                            {error && (
                                <div style={{ color: 'var(--error)', fontSize: '0.9rem', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div style={{ textAlign: 'center', margin: '30px 0' }}>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    Didn't receive code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={timer > 0 || isLoading}
                                        style={{ background: 'none', border: 'none', color: timer > 0 ? 'var(--text-dim)' : 'var(--primary)', cursor: timer > 0 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                                    >
                                        Resend {timer > 0 && `(${timer}s)`}
                                    </button>
                                </p>
                            </div>

                            <button type="submit" className="glow-btn" style={{ width: '100%' }}>
                                Verify Now
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ textAlign: 'center' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                            style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '2px solid var(--success)' }}
                        >
                            <CheckCircle2 size={48} color="var(--success)" />
                        </motion.div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verified!</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '40px', fontSize: '1.1rem' }}>Success! Your identity has been confirmed. You are now being redirected.</p>

                        <button
                            onClick={() => setStep(1)}
                            className="glow-btn"
                            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}
                        >
                            Back to Home
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default OTPForm;
