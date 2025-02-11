// pages/index.tsx
'use client'
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Robot,
  Clock,
  Database,
  Shield,
  Trash,
  Desktop,
  MicrophoneStage,
  Notepad,
  ArrowRight,
  Globe,
  Lock,
  AppleLogo,
  WindowsLogo,
  Cpu,
  HardDrive,
  FileText,
  Book,
  Code,
  GithubLogo,
  TwitterLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";

//
// Helper: Download Button (OS-specific)
//
const DownloadButton: React.FC<{ os: 'mac' | 'windows' }> = ({ os }) => {
  const handleDownload = () => {
    const downloadUrl = os === 'mac' 
      ? '/Application/mac/memoflow 1.0.0.dmg'
      : '/Application/windows/memoflow 1.0.0.exe';

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = os === 'mac' ? 'memoflow 1.0.0.dmg' : 'memoflow 1.0.0.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={handleDownload}
        className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl shadow-lg 
                  hover:bg-white/20 transition-all duration-300 flex items-center gap-3 border border-white/20"
      >
        <span className="text-lg">
          {os === 'mac' ? (
            <AppleLogo size={24} weight="fill" />
          ) : (
            <WindowsLogo size={24} weight="fill" />
          )}
        </span>
        <span>Download for {os === 'mac' ? 'macOS' : 'Windows'}</span>
        <span className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 
                      text-white text-xs px-2 py-1 rounded-full animate-pulse">
          Beta
        </span>
      </button>
    </div>
  );
};

//
// Hero Section
//
const Hero: React.FC<{ os: 'mac' | 'windows' }> = ({ os }) => (
  <section className="relative flex flex-col items-center justify-center text-center py-32 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 overflow-hidden">
    {/* Background blur elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-4 top-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute -right-4 top-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
    </div>

    <motion.h1
      className="relative text-6xl font-bold text-gray-900 dark:text-white max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      AI Meeting Notes & Transcription
    </motion.h1>
    <motion.h2
      className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      Transform Meetings into Actionable Notes
    </motion.h2>
    <motion.p
      className="mt-6 text-xl text-gray-600 max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      Automatically record, transcribe, and organize your meetings with AI-powered technology. Perfect for teams, developers, and professionals.
    </motion.p>
    <motion.div
      className="mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <DownloadButton os={os} />
    </motion.div>
    <motion.p
      className="mt-4 text-sm text-gray-500 dark:text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    >
      {os === 'mac' ? 'macOS 10.15+' : 'Windows 10+'} • Free during beta
    </motion.p>
    {/* App Preview - Updated sizing */}
    <motion.div
      className="mt-20 w-full max-w-3xl mx-auto relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="relative">
          {/* Mac-style window controls */}
          <div className="absolute top-3 left-3 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <img
            src="/screenshot.png"
            alt="App Interface"
            className="w-full h-auto opacity-90"
          />
        </div>
      </div>
      {/* Floating elements - adjusted position */}
      <motion.div
        className="absolute -right-4 -top-4 bg-blue-500/10 dark:bg-blue-400/10 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20"
        whileHover={{ y: -5 }}
      >
        <Robot size={24} className="text-blue-600 dark:text-blue-400" weight="fill" />
      </motion.div>
    </motion.div>
  </section>
);

//
// Features Section
//
const Features = () => {
  const features = [
    {
      title: "AI-Powered Notes",
      description: "Automatically generate structured notes from your meetings",
      icon: <Robot size={32} weight="fill" className="text-blue-600" />
    },
    {
      title: "Real-time Transcription",
      description: "Get instant transcripts as your meeting progresses",
      icon: <MicrophoneStage size={32} weight="fill" className="text-purple-600" />
    },
    {
      title: "Smart Organization",
      description: "Automatically categorize and tag your meeting notes",
      icon: <Notepad size={32} weight="fill" className="text-green-600" />
    },
    {
      title: "Secure Storage",
      description: "Your data is encrypted and stored safely",
      icon: <Lock size={32} weight="fill" className="text-orange-600" />
    },
    {
      title: "Global Access",
      description: "Access your notes from anywhere, anytime",
      icon: <Globe size={32} weight="fill" className="text-teal-600" />
    },
    {
      title: "Desktop Integration",
      description: "Seamlessly integrates with your workflow",
      icon: <Desktop size={32} weight="fill" className="text-indigo-600" />
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need for better meetings
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features to help you capture, organize, and act on your meeting insights
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

//
// How It Works Section
//
const HowItWorks = () => {
  const steps = [
    {
      title: "Meeting Detection",
      description: "Automatically detects when your meeting starts.",
      illustration: "/icons/meeting-detection.svg",
      accent: "from-yellow-500 to-amber-500",
      delay: 0
    },
    {
      title: "Recording",
      description: "Records the meeting seamlessly.",
      illustration: "/icons/recording.svg",
      accent: "from-red-500 to-rose-500",
      delay: 0.2
    },
    {
      title: "Transcription",
      description: "High-quality transcription powered by OpenAI.",
      illustration: "/icons/transcription.svg",
      accent: "from-blue-500 to-indigo-500",
      delay: 0.4
    },
    {
      title: "Review & Edit",
      description: "Easily review and edit your transcripts.",
      illustration: "/icons/review-edit.svg",
      accent: "from-green-500 to-emerald-500",
      delay: 0.6
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/0 via-gray-50/80 to-gray-50/0 dark:from-gray-900/0 dark:via-gray-900/80 dark:to-gray-900/0 backdrop-blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/20 via-amber-500/20 to-transparent hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-center gap-12 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: step.delay }}
              >
                {/* Step Number */}
                <div className="absolute -left-4 md:left-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center text-white font-bold z-10">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <motion.div
                  className="w-32 h-32 relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.accent} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity`} />

                  {/* Icon Card */}
                  <div className="relative h-full glass p-4 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all">
                    <motion.img
                      src={step.illustration}
                      alt={step.title}
                      className="w-full h-full object-contain"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  className="flex-1 text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {step.description}
                  </p>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -z-10 opacity-20 blur-3xl w-64 h-64 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: step.delay }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

//
// Privacy & Security Section
//
const Privacy = () => (
  <section className="py-32 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg p-12 rounded-2xl shadow-lg border border-white/20 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Left side: Icon and Main Message */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              className="inline-block p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Shield size={48} weight="fill" className="text-yellow-600 dark:text-yellow-500" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Enterprise-grade security
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your data stays on your device. We prioritize privacy with a local-first approach and never send your meeting content to the cloud without explicit permission.
            </p>
          </div>

          {/* Right side: Feature Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Storage */}
              <motion.div
                className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 backdrop-blur-sm"
                whileHover={{ y: -5 }}
              >
                <Database size={32} className="text-yellow-600 dark:text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Local Database</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  All meeting recordings and transcripts are stored locally on your device using SQLite
                </p>
              </motion.div>

              {/* Encryption */}
              <motion.div
                className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 backdrop-blur-sm"
                whileHover={{ y: -5 }}
              >
                <Lock size={32} className="text-yellow-600 dark:text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">End-to-end Encryption</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AES-256 encryption for all stored data with local key management
                </p>
              </motion.div>

              {/* Offline First */}
              <motion.div
                className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 backdrop-blur-sm"
                whileHover={{ y: -5 }}
              >
                <Desktop size={32} className="text-yellow-600 dark:text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Offline First</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Works completely offline. No internet connection required for core features
                </p>
              </motion.div>

              {/* Data Control */}
              <motion.div
                className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 backdrop-blur-sm"
                whileHover={{ y: -5 }}
              >
                <Trash size={32} className="text-yellow-600 dark:text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Full Data Control</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Easily manage, export, or delete your data with built-in tools
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 border border-white/20">
            <Database size={16} />
            <span>SQLite Database</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 border border-white/20">
            <Desktop size={16} />
            <span>Native Desktop App</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 border border-white/20">
            <Shield size={16} />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

//
// Download Section
//
const DownloadSection: React.FC<{ os: 'mac' | 'windows' }> = ({ os }) => (
  <section className="py-20 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 dark:from-yellow-900/30 dark:to-amber-900/30 backdrop-blur-lg">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <motion.div
        className="glass p-12 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to Transform Your Meetings?
        </motion.h2>

        <div className="flex flex-col items-center gap-8 mb-8">
          <DownloadButton os={os} />

          {/* Alternative OS Download */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Using {os === 'mac' ? 'Windows' : 'macOS'}?{' '}
            <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline">
              Download for {os === 'mac' ? 'Windows' : 'macOS'} instead
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* System Requirements */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Cpu size={16} />
              <span>64-bit {os === 'mac' ? 'macOS 10.15+' : 'Windows 10+'}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive size={16} />
              <span>200MB free space</span>
            </div>
          </div>

          {/* Version Info */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Code size={16} />
              <span>Version 1.2.3 Beta</span>
            </div>
            <a href="/release-notes" className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              <FileText size={16} />
              <span>Release Notes</span>
            </a>
            <a href="/docs" className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              <Book size={16} />
              <span>Documentation</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Add this after the DownloadSection component
const Footer = () => (
  <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left side - Developer Info */}
        <div className="flex flex-col items-center md:items-start">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <a
              href="https://naveenschoudhary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500/20 group-hover:border-yellow-500/40 transition-all">
                <img
                  src="https://www.naveenschoudhary.com/assets/images/my1.png"
                  alt="Naveen Singh Choudhary"
                  className="w-full h-full object-cover"
                />
              </div>
            </a>
            <div>
              <a
                href="https://naveenschoudhary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400">
                  Built by Naveen Singh Choudhary
                </h3>
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Software Developer & AI Enthusiast
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right side - Social Links */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="https://github.com/Naveenschoudhary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
          >
            <GithubLogo size={24} weight="fill" />
          </a>
          <a
            href="https://www.linkedin.com/in/naveenschoudhary/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
          >
            <LinkedinLogo size={24} weight="fill" />
          </a>
          <a
            href="https://naveenschoudhary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
          >
            <Globe size={24} weight="fill" />
          </a>
        </motion.div>
      </div>

      {/* Bottom - Copyright */}
      <motion.div
        className="mt-8 pt-8 border-t border-gray-200/20 dark:border-gray-700/20 text-center text-sm text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <p>© 2024 MemoFlow by <a href="https://naveenschoudhary.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Naveen Singh Choudhary</a>. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Privacy Policy</a>
          {' • '}
          <a href="/terms" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">Terms of Service</a>
        </p>
      </motion.div>
    </div>
  </section>
);

// Add this near the top of your page component
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MemoFlow",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": ["macOS", "Windows"],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "description": "AI-powered meeting transcription and note-taking software that automatically records and transcribes meetings in real-time.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  }
};

//
// Main Landing Page Component
//
const Home: React.FC = () => {
  // OS detection hook (for simplicity, only distinguishing Windows vs. macOS)
  const [os, setOs] = useState<'mac' | 'windows'>('mac');

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.platform.indexOf('Win') > -1) {
      setOs('windows');
    } else {
      setOs('mac');
    }
  }, []);

  return (
    <>
      <Head>
        <title>AI Meeting Transcription App</title>
        <meta name="description" content="Automatic meeting recording, transcription, and timesheet integration." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://memoflow.app" />
      </Head>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-system">
        <Hero os={os} />
        <Features />
        <HowItWorks />
        <Privacy />
        <DownloadSection os={os} />
        <Footer />
      </main>
    </>
  );
};

export default Home;
