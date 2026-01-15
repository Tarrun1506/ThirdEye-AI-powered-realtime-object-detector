import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { speak } from '../components/tts';
import TTSToggle from '../components/TTSToggle';

const Home = () => {
    const [cameraActive, setCameraActive] = useState(false);
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        speak("Welcome to Third Eye Home. Select an option.");
    }, []);

    // Polling for object detection when camera is active
    useEffect(() => {
        let interval;
        if (cameraActive) {
            interval = setInterval(async () => {
                try {
                    const res = await axios.get('http://localhost:5000/current_object');
                    if (res.data.object) {
                        speak(`${res.data.object} ahead`);
                    }
                } catch (e) {
                    // ignore errors
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [cameraActive]);

    const toggleCamera = () => {
        if (cameraActive) {
            setCameraActive(false);
            speak("Camera stopped.");
        } else {
            setCameraActive(true);
            speak("Camera started. Object detection active.");
        }
    };

    const handleSOS = async () => {
        const userId = localStorage.getItem('user_id');
        speak("Activating S O S.");
        try {
            const res = await axios.post('http://localhost:5000/trigger-sos', { user_id: userId });
            speak(res.data.message);
            alert(`CALLING: ${res.data.phone}`);
        } catch (err) {
            speak("Failed to trigger S O S.");
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
            setFeedbackMode(false);
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

    if (feedbackMode) {
        return (
            <div className="flex items-center justify-center min-h-[90vh] p-4 animate-fade-in">
                <div className="glass-panel w-full max-w-lg">
                    <h1 className="text-3xl mb-4 font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Feedback</h1>
                    <form onSubmit={submitFeedback} className="flex flex-col gap-4 w-full">
                        <textarea
                            value={feedbackMsg}
                            onChange={(e) => setFeedbackMsg(e.target.value)}
                            placeholder="Type your feedback..."
                            className="input-field h-48 resize-none"
                            autoFocus
                        />
                        <button type="submit" className="btn-primary bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Submit Feedback</button>
                        <button
                            type="button"
                            onClick={() => setFeedbackMode(false)}
                            className="text-white/50 hover:text-white mt-2 transition-colors text-center"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col animate-fade-in relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="flex flex-col h-full gap-4 max-w-4xl mx-auto w-full p-4 relative z-10">

                {/* Header */}
                <div className="flex justify-between items-center px-2 py-4 flex-none">
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

                {/* Camera View Area */}
                {cameraActive && (
                    <div className="flex-1 bg-black/80 rounded-3xl overflow-hidden relative border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                        <img
                            src="http://localhost:5000/video_feed"
                            alt="Camera Feed"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 animate-pulse">
                            <div className="flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-xs font-bold uppercase text-white">Live Feed</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Buttons */}
                <div className={`grid grid-cols-1 gap-6 ${cameraActive ? 'h-auto py-4' : 'flex-1 content-center'}`}>

                    {/* Start/Stop Button */}
                    <button
                        onClick={toggleCamera}
                        className={`btn-large group ${cameraActive
                            ? 'bg-gradient-to-br from-red-500/20 to-pink-600/20 border-red-500/50 hover:shadow-red-500/30'
                            : 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-500/50 hover:shadow-emerald-500/30'
                            }`}
                    >
                        <div className={`p-4 rounded-full ${cameraActive ? 'bg-red-500' : 'bg-emerald-500'} text-white shadow-lg`}>
                            <span className="text-5xl">{cameraActive ? '⏹️' : '👁️'}</span>
                        </div>
                        <span className="text-2xl font-black uppercase tracking-widest text-white">
                            {cameraActive ? "Stop Vision" : "Start Vision"}
                        </span>
                        <span className="text-xs font-mono text-white/50">{cameraActive ? 'TERMINATE OBJECT DETECTION' : 'ACTIVATE AI ASSISTANT'}</span>
                    </button>

                    {/* SOS Button */}
                    {!cameraActive && (
                        <button onClick={handleSOS} className="btn-large group bg-gradient-to-br from-red-600 to-orange-600 border-none shadow-red-600/30 hover:shadow-red-600/50">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <span className="text-6xl animate-pulse">🆘</span>
                            <span className="text-3xl font-black uppercase tracking-widest text-white">SOS ALERT</span>
                            <span className="text-xs font-mono text-white/70">IMMEDIATE EMERGENCY CONTACT</span>
                        </button>
                    )}

                    {/* Feedback Button */}
                    {!cameraActive && (
                        <button onClick={() => setFeedbackMode(true)} className="btn-large group bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/30 hover:border-blue-500 hover:shadow-blue-500/30">
                            <span className="text-5xl">🗣️</span>
                            <span className="text-2xl font-bold uppercase tracking-widest text-white">Feedback</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
