'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CaretLeft } from '@phosphor-icons/react';

export default function Terms() {
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
          <h1>Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400">Last updated: March 20, 2024</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to MemoFlow. By using our service, you agree to these terms. Please read them carefully.</p>
          
          <h2>2. Use of Service</h2>
          <p>MemoFlow provides AI-powered meeting transcription and note-taking services. The service is provided "as is" during the beta period.</p>
          
          <h2>3. Privacy & Data Security</h2>
          <p>We prioritize your privacy with our local-first approach. Your meeting data stays on your device unless explicitly shared.</p>
          
          <h2>4. User Responsibilities</h2>
          <ul>
            <li>Maintain the security of your account</li>
            <li>Use the service in compliance with laws</li>
            <li>Respect intellectual property rights</li>
          </ul>
          
          <h2>5. Limitations of Liability</h2>
          <p>MemoFlow is not liable for any indirect, incidental, or consequential damages.</p>
          
          <h2>6. Changes to Terms</h2>
          <p>We may update these terms as needed. Continued use of the service constitutes acceptance of changes.</p>
        </motion.div>
      </div>
    </main>
  );
} 