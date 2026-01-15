import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { speak } from '../components/tts';
import TTSToggle from '../components/TTSToggle';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        speak("Welcome. Please sign up to create an account.");
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/signup', { username, password });
            localStorage.setItem('user_id', res.data.user_id);
            speak("Registration successful. Redirecting to setup.");
            navigate('/contact-setup');
        } catch (err) {
            speak("Registration failed. Please try again.");
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center animate-fade-in relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="absolute top-4 right-4 z-50">
                <TTSToggle />
            </div>
            <div className="glass-panel w-full max-w-md flex flex-col items-center relative z-10">
                <h1 className="text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Create Account</h1>
                <p className="text-white/60 mb-8">Join ThirdEye Community</p>

                <form onSubmit={handleSignup} className="flex flex-col gap-6 w-full">
                    <div>
                        <label className="block text-sm text-cyan-400 mb-2 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-cyan-400 mb-2 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            placeholder="Choose a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="btn-primary mt-4">Register</button>
                </form>

                <div className="mt-8 text-center text-white/60">
                    Already have an account? <span onClick={() => navigate('/login')} className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold underline decoration-2 underline-offset-4 cursor-pointer">Login</span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
