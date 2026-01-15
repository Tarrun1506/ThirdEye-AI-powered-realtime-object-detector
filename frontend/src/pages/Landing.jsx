import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { speak } from '../components/tts';
import TTSToggle from '../components/TTSToggle';

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        speak("Welcome to Third Eye. Navigate to top right for login.");
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col animate-fade-in relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Navbar */}
            <nav className="flex-none flex justify-between items-center px-8 py-4 border-b border-white/5 backdrop-blur-sm relative z-50">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">👁️</span>
                    <div>
                        <span className="text-xl font-mono text-cyan-400 font-bold">THIRD<span className="text-white">EYE</span></span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <TTSToggle />
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 transition-all hover:scale-105"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:scale-105"
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Main Content - Centered */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-6xl mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                    {/* Left: Text Content */}
                    <div className="text-left space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-blue-200 leading-tight">
                            See The World <br /> Differently
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-lg">
                            An advanced AI assistant designed to empower the visually impaired through real-time object detection and intelligent voice feedback.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-cyan-300">
                                🤖 AI-Powered
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-orange-300">
                                ⚡ Real-Time
                            </div>
                        </div>
                    </div>

                    {/* Right: Feature Cards (Compact Stack) */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-4">
                            <div className="text-3xl p-3 bg-cyan-500/20 rounded-xl">🔍</div>
                            <div>
                                <h3 className="text-lg font-bold text-cyan-400">Object Detection</h3>
                                <p className="text-white/60 text-sm">Identifies 600+ objects instantly.</p>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-4">
                            <div className="text-3xl p-3 bg-orange-500/20 rounded-xl">🛡️</div>
                            <div>
                                <h3 className="text-lg font-bold text-orange-400">SOS Emergency</h3>
                                <p className="text-white/60 text-sm">Instant alerts to guardians.</p>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-4">
                            <div className="text-3xl p-3 bg-blue-500/20 rounded-xl">🗣️</div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-400">Voice Feedback</h3>
                                <p className="text-white/60 text-sm">Full audio navigation support.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
