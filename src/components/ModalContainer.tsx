'use client'
import { useSignupModal } from '@/context/SignupModalContext';
import SignupModal from './SignupModal';

const ModalContainer = () => {
    const { isOpen, os, closeModal } = useSignupModal();

    const handleSubmit = async (email: string) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, os }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    return (
        <SignupModal
            isOpen={isOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
            os={os}
        />
    );
};

export default ModalContainer; 