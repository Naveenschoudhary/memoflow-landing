import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Check, Envelope } from '@phosphor-icons/react';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
    os: 'mac' | 'windows' | 'linux';
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSubmit, os }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await onSubmit(email);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmail('');
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen px-4 text-center">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={onClose}
                            style={{ willChange: 'opacity' }}
                        />

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ 
                                duration: 0.2,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            className="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform"
                            style={{ willChange: 'transform' }}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={24} weight="bold" />
                            </button>

                            <div className="mt-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Download MemoFlow for {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux'}
                                </h2>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    Enter your email to receive the download link and stay updated with new features.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <div className="relative">
                                        <Envelope 
                                            size={20} 
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email address"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                                                     focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none
                                                     transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'success'}
                                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white 
                                            ${status === 'success' 
                                                ? 'bg-green-500' 
                                                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600'
                                            } transition-all duration-200 flex items-center justify-center gap-2
                                            disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {status === 'loading' && (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        )}
                                        {status === 'success' && <Check size={20} weight="bold" />}
                                        {status === 'loading' ? 'Processing...' : status === 'success' ? 'Success!' : 'Get Download Link'}
                                    </button>

                                    {status === 'error' && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm mt-2 text-center"
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        By downloading, you agree to our{' '}
                                        <a href="/terms" className="text-yellow-600 hover:text-yellow-700 underline">Terms</a>
                                        {' '}and{' '}
                                        <a href="/privacy" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a>
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SignupModal; 