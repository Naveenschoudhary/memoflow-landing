'use client'
import { motion } from 'framer-motion';
import { WarningCircle, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-[2px] rounded-2xl">
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="flex flex-col items-center text-center">
              <WarningCircle 
                size={64} 
                className="text-amber-500 mb-6" 
                weight="duotone"
              />
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Download Link Expired
              </h1>
              
              <p className="text-gray-400 mb-8">
                This download link has expired for security reasons. Please request a new download link to continue.
              </p>

              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 
                  text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-amber-600 
                  transition-all duration-300"
              >
                Request New Link
                <ArrowRight size={20} weight="bold" />
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                Download links expire after 10 minutes for security purposes.
                Need help? Contact <a href="mailto:support@memoflow.app" className="text-amber-500 hover:text-amber-400">support@memoflow.app</a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 