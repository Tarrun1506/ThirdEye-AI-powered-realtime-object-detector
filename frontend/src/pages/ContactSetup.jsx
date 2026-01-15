import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { speak } from '../components/tts';
import TTSToggle from '../components/TTSToggle';

const ContactSetup = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        speak("Please add an emergency contact.");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');
        try {
            await axios.post('http://localhost:5000/add-contact', {
                user_id: userId,
                guardian_name: name,
                guardian_phone: phone
            });
            speak("Contact saved. Redirecting to home.");
            navigate('/home');
        } catch (err) {
            speak("Error saving contact.");
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
            <div className="glass-panel w-full max-w-lg relative z-10">
                <h1 className="text-3xl mb-8 font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Emergency Contact</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                    <div>
                        <label className="block text-sm text-cyan-400 mb-2 uppercase tracking-wider">Guardian Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-cyan-400 mb-2 uppercase tracking-wider">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="btn-primary mt-4 bg-gradient-to-r from-orange-500 to-red-500 border-orange-500/50">Save Contact</button>
                </form>
            </div>
        </div>
    );
};

export default ContactSetup;
