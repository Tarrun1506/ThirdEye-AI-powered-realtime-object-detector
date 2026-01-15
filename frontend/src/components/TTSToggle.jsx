import { useState, useEffect } from 'react';
import { toggleTTS, getTTSStatus } from './tts';

const TTSToggle = () => {
    const [isEnabled, setIsEnabled] = useState(getTTSStatus());

    const handleToggle = () => {
        const newStatus = toggleTTS();
        setIsEnabled(newStatus);
    };

    return (
        <button
            onClick={handleToggle}
            className={`text-xl px-3 py-1 rounded border transition-colors ${isEnabled ? 'text-cyan-400 border-cyan-400/30' : 'text-white/30 border-white/10'}`}
            title={isEnabled ? "Disable Voice" : "Enable Voice"}
        >
            {isEnabled ? '🔊' : '🔇'}
        </button>
    );
};

export default TTSToggle;
