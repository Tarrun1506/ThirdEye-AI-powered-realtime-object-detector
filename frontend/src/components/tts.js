
export const getTTSStatus = () => {
    return localStorage.getItem('tts_enabled') !== 'false';
};

export const toggleTTS = () => {
    const currentStatus = getTTSStatus();
    const newStatus = !currentStatus;
    localStorage.setItem('tts_enabled', newStatus);

    // Provide immediate feedback
    if (newStatus) {
        speak("Voice feedback enabled.");
    } else {
        window.speechSynthesis.cancel();
    }

    return newStatus;
};

export const speak = (text) => {
    if (!window.speechSynthesis) return;

    // Check if TTS is enabled (default to true)
    if (localStorage.getItem('tts_enabled') === 'false') return;

    // Cancel previous speech to update immediately
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
};

export const useTTS = () => {
    return { speak, toggleTTS, getTTSStatus };
};
