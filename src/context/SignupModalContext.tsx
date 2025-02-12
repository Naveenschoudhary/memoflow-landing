'use client'
import React, { createContext, useContext, useState } from 'react';

interface SignupModalContextType {
    isOpen: boolean;
    os: 'mac' | 'windows' | 'linux';
    openModal: (os: 'mac' | 'windows' | 'linux') => void;
    closeModal: () => void;
}

const SignupModalContext = createContext<SignupModalContextType | undefined>(undefined);

export function SignupModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [os, setOs] = useState<'mac' | 'windows' | 'linux'>('mac');

    const openModal = (selectedOs: 'mac' | 'windows' | 'linux') => {
        setOs(selectedOs);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <SignupModalContext.Provider value={{ isOpen, os, openModal, closeModal }}>
            {children}
        </SignupModalContext.Provider>
    );
}

export function useSignupModal() {
    const context = useContext(SignupModalContext);
    if (context === undefined) {
        throw new Error('useSignupModal must be used within a SignupModalProvider');
    }
    return context;
} 