'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CaretLeft } from '@phosphor-icons/react';

export default function ReleaseNotes() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 mb-8"
        >
          <CaretLeft size={20} />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose dark:prose-invert max-w-none"
        >
          <h1>Release Notes</h1>
          
          <div className="mb-12">
            <h2 className="flex items-center gap-3">
              Version 1.0.0
              <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                Latest
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Released: March 20, 2024</p>
            
            <h3>New Features</h3>
            <ul>
              <li>Automatic meeting detection</li>
              <li>Real-time transcription with AI</li>
              <li>Local-first storage with SQLite</li>
              <li>End-to-end encryption</li>
              <li>Dark mode support</li>
            </ul>
            
            <h3>Improvements</h3>
            <ul>
              <li>Enhanced transcription accuracy</li>
              <li>Optimized performance</li>
              <li>Improved UI/UX</li>
            </ul>
            
            <h3>Bug Fixes</h3>
            <ul>
              <li>Fixed audio detection issues</li>
              <li>Resolved storage conflicts</li>
              <li>Improved error handling</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 