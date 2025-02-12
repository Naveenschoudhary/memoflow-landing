'use client'
import { useSignupModal } from '@/context/SignupModalContext';
import { AppleLogo, WindowsLogo, Globe } from '@phosphor-icons/react';

const DownloadButton: React.FC<{ os: 'mac' | 'windows' | 'linux' }> = ({ os }) => {
    const { openModal } = useSignupModal();

    return (
        <div className="flex flex-col items-center gap-6 relative z-10">
            {/* Primary Download Button */}
            <div className="relative">
                <button
                    onClick={() => openModal(os)}
                    className="relative z-20 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl shadow-lg 
                    hover:bg-white/20 transition-all duration-300 flex items-center gap-3 border border-white/20 cursor-pointer"
                >
                    <span className="text-lg">
                        {os === 'mac' ? (
                            <AppleLogo size={24} weight="fill" />
                        ) : os === 'windows' ? (
                            <WindowsLogo size={24} weight="fill" />
                        ) : (
                            <Globe size={24} weight="fill" />
                        )}
                    </span>
                    <span>Download for {os === 'mac' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux'}</span>
                    <span className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 
                        text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        Beta
                    </span>
                </button>
            </div>

            {/* Other OS Download Links */}
            <div className="relative z-20 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-2">
                {os !== 'mac' && (
                    <button
                        onClick={() => openModal('mac')}
                        className="relative z-20 flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors p-2 cursor-pointer"
                    >
                        <AppleLogo size={16} weight="fill" />
                        <span>Download for macOS</span>
                    </button>
                )}
                {os !== 'windows' && (
                    <button
                        onClick={() => openModal('windows')}
                        className="relative z-20 flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors p-2 cursor-pointer"
                    >
                        <WindowsLogo size={16} weight="fill" />
                        <span>Download for Windows</span>
                    </button>
                )}
                {os !== 'linux' && (
                    <button
                        onClick={() => openModal('linux')}
                        className="relative z-20 flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors p-2 cursor-pointer"
                    >
                        <Globe size={16} weight="fill" />
                        <span>Download for Linux</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default DownloadButton; 