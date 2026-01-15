import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '../components/tts';
import TTSToggle from '../components/TTSToggle';

const Home = () => {
    // Mode: 'idle' | 'camera' | 'sos' | 'feedback'
    const [mode, setMode] = useState('idle');
    const [sosInfo, setSosInfo] = useState({ name: '', phone: '' });
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const navigate = useNavigate();

    // Initial greeting
    useEffect(() => {
        speak("Welcome to Third Eye Home. Select an option.");
    }, []);

    // Polling for object detection (Camera Mode)
    useEffect(() => {
        let interval;
        if (mode === 'camera') {
            speak("Camera started. Object detection active.");
            interval = setInterval(async () => {
                try {
                    const res = await axios.get('http://localhost:5000/current_object');
                    if (res.data.object) {
                        speak(`${res.data.object} ahead`);
                    }
                } catch (e) { }
            }, 3000);
        } else if (mode === 'idle') {
            // check if we just stopped
        }
        return () => clearInterval(interval);
    }, [mode]);

    // SOS Trigger
    const handleSOS = async () => {
        // Toggle Logic: If already active, stop it
        if (mode === 'sos') {
            setMode('idle');
            speak("S O S Cancelled.");
            return;
        }

        const userId = localStorage.getItem('user_id');
        speak("Activating S O S.");

        // Optimistic UI Update: Show screen immediately
        setMode('sos');
        setSosInfo({ name: 'Contacting...', phone: '...' });

        try {
            const res = await axios.post('http://localhost:5000/trigger-sos', { user_id: userId });
            setSosInfo({
                name: res.data.name || 'Guardian',
                phone: res.data.phone || 'Unknown'
            });
            speak(res.data.message);
        } catch (err) {
            speak("Failed to trigger S O S. No contact found.");
            setSosInfo({ name: 'Error', phone: 'No Emergency Contact' });
        }
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');
        try {
            await axios.post('http://localhost:5000/feedback', {
                user_id: userId,
                message: feedbackMsg,
                rating: 5
            });
            speak("Feedback submitted. Thank you.");
            setMode('idle');
            setFeedbackMsg('');
        } catch (err) {
            speak("Error submitting feedback.");
        }
    };

    const handleLogout = () => {
        speak("Logging out.");
        localStorage.removeItem('user_id');
        navigate('/');
    };

    return (
        <div className="h-screen w-screen flex flex-col animate-fade-in relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 flex-none z-50">
                <div>
                    <span className="text-xl font-mono text-cyan-400">THIRD<span className="text-white">EYE</span></span>
                    <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-transparent mt-1 rounded-full"></div>
                </div>
                <div className="flex gap-3">
                    <TTSToggle />
                    <button
                        onClick={handleLogout}
                        className="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded hover:bg-red-400/10 transition-colors uppercase tracking-widest"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area - Split View */}
            <div className="flex-1 flex w-full relative overflow-hidden p-6 gap-6">

                {/* Left Active Stage */}
                <AnimatePresence mode="wait">
                    {mode !== 'idle' && (
                        <motion.div
                            key="active-stage"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex-1 rounded-3xl overflow-hidden relative border border-white/10 glass-panel"
                        >
                            {/* CAMERA VIEW */}
                            {mode === 'camera' && (
                                <div className="w-full h-full bg-black/90 relative flex items-center justify-center">
                                    <img
                                        src="http://localhost:5000/video_feed"
                                        alt="Camera Feed"
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute top-4 left-4 animate-pulse">
                                        <div className="flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                            <span className="text-xs font-bold uppercase text-white">Live AI Vision</span>
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute bottom-10 px-6 py-2 bg-black/60 backdrop-blur text-white/80 rounded-full text-sm font-mono border border-white/20"
                                    >
                                        Analyzing environment...
                                    </motion.div>
                                </div>
                            )}

                            {/* SOS ANIMATION */}
                            {mode === 'sos' && (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/10 relative overflow-hidden">
                                    {/* Ripple Effects */}
                                    <div className="absolute w-[500px] h-[500px] bg-red-500/20 rounded-full animate-ping opacity-20"></div>
                                    <div className="absolute w-[300px] h-[300px] bg-red-500/30 rounded-full animate-ping opacity-40 animation-delay-500"></div>

                                    <div className="z-10 text-center space-y-4">
                                        <div className="text-8xl animate-bounce">🚨</div>
                                        <h2 className="text-4xl font-black text-red-500 uppercase tracking-widest">Calling {sosInfo.name}</h2>
                                        <p className="text-white/60 font-mono text-xl">{sosInfo.phone}</p>
                                        <p className="text-white/40 font-mono text-sm mt-2">Location Sent • Emergency Mode Active</p>
                                        <div className="mt-8 flex gap-4 justify-center">
                                            <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce"></div>
                                            <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FEEDBACK FORM */}
                            {mode === 'feedback' && (
                                <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                                    <div className="w-full max-w-lg space-y-6">
                                        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Share Feedback</h2>
                                        <form onSubmit={submitFeedback} className="flex flex-col gap-4">
                                            <textarea
                                                value={feedbackMsg}
                                                onChange={(e) => setFeedbackMsg(e.target.value)}
                                                placeholder="Tell us about your experience..."
                                                className="input-field h-40 resize-none bg-black/50"
                                                autoFocus
                                            />
                                            <div className="flex gap-4">
                                                <button type="submit" className="flex-1 btn-primary bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Send</button>
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('idle')}
                                                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white/60"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Control Panel (Animated Layout) */}
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`flex flex-col gap-6 transition-all duration-500 ${mode === 'idle'
                        ? 'w-full max-w-2xl mx-auto justify-center'
                        : 'w-80 min-w-[300px] justify-center'
                        }`}
                >
                    {/* START VISION */}
                    <motion.button
                        layout="position"
                        onClick={() => {
                            if (mode === 'camera') {
                                setMode('idle');
                                speak("Camera stopped.");
                            } else {
                                setMode('camera');
                            }
                        }}
                        className={`group relative overflow-hidden rounded-2xl transition-all ${mode === 'camera'
                            ? 'bg-red-500/20 border-2 border-red-500 text-red-100'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                            } ${mode === 'idle' ? 'p-8' : 'p-4'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${mode === 'camera' ? 'bg-red-500' : 'bg-emerald-500/20 text-emerald-400'} shadow-lg transition-colors`}>
                                <span className={mode === 'idle' ? "text-4xl" : "text-2xl"}>{mode === 'camera' ? '⏹️' : '👁️'}</span>
                            </div>
                            <div className="text-left">
                                <h3 className={`font-black uppercase tracking-widest ${mode === 'idle' ? "text-2xl" : "text-lg"}`}>
                                    {mode === 'camera' ? 'Stop Vision' : 'Start Vision'}
                                </h3>
                                {mode === 'idle' && <p className="text-white/40 text-sm font-mono mt-1">Activate AI Object Detection</p>}
                            </div>
                        </div>
                    </motion.button>

                    {/* SOS ALERT */}
                    <motion.button
                        layout="position"
                        onClick={handleSOS}
                        className={`group relative overflow-hidden rounded-2xl transition-all ${mode === 'sos'
                            ? 'bg-red-600 border-2 border-white text-white shadow-[0_0_50px_rgba(220,38,38,0.5)]'
                            : 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 hover:border-red-500 text-red-100'
                            } ${mode === 'idle' ? 'p-8' : 'p-4'}`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`${mode === 'idle' ? "text-5xl" : "text-3xl"} animate-pulse`}>🆘</span>
                            <div className="text-left">
                                <h3 className={`font-black uppercase tracking-widest ${mode === 'idle' ? "text-2xl" : "text-lg"}`}>
                                    SOS Alert
                                </h3>
                                {mode === 'idle' && <p className="text-red-200/60 text-sm font-mono mt-1">Emergency Contact Notification</p>}
                            </div>
                        </div>
                    </motion.button>

                    {/* FEEDBACK */}
                    <motion.button
                        layout="position"
                        onClick={() => setMode(mode === 'feedback' ? 'idle' : 'feedback')}
                        className={`group relative overflow-hidden rounded-2xl transition-all ${mode === 'feedback'
                            ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-100'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                            } ${mode === 'idle' ? 'p-8' : 'p-4'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full bg-blue-500/20 text-blue-400 shadow-lg`}>
                                <span className={mode === 'idle' ? "text-4xl" : "text-2xl"}>🗣️</span>
                            </div>
                            <div className="text-left">
                                <h3 className={`font-black uppercase tracking-widest ${mode === 'idle' ? "text-2xl" : "text-lg"}`}>
                                    Feedback
                                </h3>
                                {mode === 'idle' && <p className="text-white/40 text-sm font-mono mt-1">Help us improve ThirdEye</p>}
                            </div>
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;