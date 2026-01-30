import React from 'react';
import { motion } from 'framer-motion';

const LuxuryLoader: React.FC = () => {
    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{
                y: '-100%',
                transition: {
                    duration: 1.2,
                    ease: [0.65, 0, 0.35, 1] // Custom bezier for "heavy" curtain lift
                }
            }}
            className="fixed inset-0 h-[100dvh] z-[9999] flex items-center justify-center bg-[#FCF9F1]"
        >
            <motion.div
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{
                    duration: 1.8,
                    ease: [0.43, 0.13, 0.23, 0.96] // "Heavy" ease out
                }}
                className="flex flex-col items-center"
            >
                <h1 className="font-display text-4xl md:text-6xl font-black text-[#1A1A1A] uppercase tracking-[0.2em] mb-2">
                    NUTMUNCH
                </h1>
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-[#C7A15E] text-[10px] uppercase tracking-[0.4em] font-bold mt-4"
                >
                    Est. 1984
                </motion.span>
            </motion.div>
        </motion.div>
    );
};

export default LuxuryLoader;
