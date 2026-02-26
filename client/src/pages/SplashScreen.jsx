import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/register');
        }, 4500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-horror-bg flex flex-col items-center justify-center overflow-hidden">
            <div className="scanline"></div>

            {/* Cinematic Background Image */}
            <div
                className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat scale-110 animate-[pulse_10s_infinite]"
                style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp9043161.jpg')" }}
            ></div>

            {/* Background Atmosphere Overlay */}
            <div className="absolute inset-0 opacity-60 pointer-events-none bg-gradient-to-t from-horror-bg via-transparent to-horror-bg">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#300000_0%,_transparent_70%)] opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative z-10"
            >
                <h1 className="text-7xl md:text-9xl font-black text-neon-red glow-text tracking-[0.2em] glitch select-none uppercase italic">
                    MINDFLAYER.IO
                </h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 3 }}
                    className="h-1 bg-red-600 mt-2 shadow-[0_0_20px_#ff0000]"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.4, 0.8] }}
                    transition={{ delay: 2, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-red-500 text-center mt-12 tracking-[0.5em] text-sm font-mono font-bold"
                >
                    CROSSING THE RIFT...
                </motion.p>
            </motion.div>

            {/* Ash Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/20 rounded-full blur-[1px]"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [-100, 100],
                            x: [-50, 50],
                            opacity: [0, 0.6, 0],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SplashScreen;
