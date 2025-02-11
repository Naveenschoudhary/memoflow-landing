'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CaretLeft } from '@phosphor-icons/react';

export default function Privacy() {
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
          <h1>Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: March 20, 2024</p>
          
          <h2>1. Data Collection</h2>
          <p>MemoFlow is designed with privacy-first principles. We collect minimal data necessary for the service to function.</p>
          
          <h2>2. Local Storage</h2>
          <p>All meeting recordings and transcripts are stored locally on your device using SQLite database.</p>
          
          <h2>3. Data Security</h2>
          <ul>
            <li>End-to-end encryption using AES-256</li>
            <li>Local key management</li>
            <li>No cloud storage without explicit consent</li>
          </ul>
          
          <h2>4. Your Rights</h2>
          <p>You have full control over your data, including the right to export or delete it at any time.</p>
          
          <h2>5. Updates</h2>
          <p>We will notify users of any changes to this privacy policy through the application.</p>
        </motion.div>
      </div>
    </main>
  );
} 