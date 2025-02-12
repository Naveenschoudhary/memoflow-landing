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
      // Auto close after success
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Download MemoFlow for {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter your email to receive the download link and stay updated with new features.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Envelope 
                    size={20} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400
                             focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full py-3 rounded-xl font-semibold text-white 
                    ${status === 'success' 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600'
                    } transition-all duration-200 flex items-center justify-center gap-2`}
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
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  By downloading, you agree to our{' '}
                  <a href="/terms" className="text-yellow-600 hover:text-yellow-700">Terms</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-yellow-600 hover:text-yellow-700">Privacy Policy</a>
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignupModal; 