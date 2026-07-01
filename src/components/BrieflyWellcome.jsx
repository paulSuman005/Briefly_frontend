import { motion } from 'framer-motion';

const NAVY = '#0a1628';
const BLUE = '#1754d6';

const BrieflyWellcome = ({ size = 160, text = 'Wellcome to Briefly' }) => {
    const loopTransition = {
        duration: 2.8,
        repeat: Infinity,
        repeatType: 'loop',
        ease: [0.65, 0, 0.35, 1],
    };

    const drawAnim = (delay) => ({
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] },
        transition: { ...loopTransition, delay },
    });



    return (
        <div className="relative bg-white rounded-3xl px-8 md:px-10 lg:px-16 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between w-full h-full z-10 gap-10 md:gap-0">

            {/* Animated SVG Logo Container (Left Side) */}
            <div className="flex-shrink-0">
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.05 }}
                    className="relative p-2 md:p-4 rounded-full"
                >
                    {/* Glowing aura behind the logo */}
                    <motion.div
                        className="absolute inset-0 rounded-full blur-3xl opacity-0 bg-blue-500"
                        animate={{ opacity: [0, 0.3, 0.3, 0] }}
                        transition={{ ...loopTransition, delay: 0.5 }}
                        style={{ filter: 'blur(20px)' }}
                    />

                    <motion.svg
                        viewBox="0 0 612 632"
                        width={size}
                        height={size * (632 / 612)}
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ opacity: [0.6, 1, 1, 0.6] }}
                        transition={{ ...loopTransition, delay: 0.2 }}
                        className="relative z-10 drop-shadow-lg"
                    >
                        <defs>
                            <linearGradient id="brieflyBubbleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={NAVY} />
                                <stop offset="55%" stopColor={NAVY} />
                                <stop offset="100%" stopColor={BLUE} />
                            </linearGradient>
                        </defs>

                        {/* Adjusted width to strictly not touch the B and keep perfectly straight vertical cut */}
                        <motion.path d="M 32 263 L 210 262" stroke={NAVY} strokeWidth="35" strokeLinecap="round" fill="none" {...drawAnim(0)} />
                        <motion.path d="M 104 339 L 165 339" stroke={NAVY} strokeWidth="35" strokeLinecap="round" fill="none" {...drawAnim(0.1)} />
                        <motion.path d="M 29 415 L 160 415" stroke={NAVY} strokeWidth="35" strokeLinecap="round" fill="none" {...drawAnim(0.2)} />

                        {/* Blue hairpin bar */}
                        <motion.path d="M 23 112 L 422 112 Q 458 112 474 151 Q 474 187 422 187 L 127 188" stroke={BLUE} strokeWidth="40" strokeLinecap="round" fill="none" {...drawAnim(0.3)} />

                        {/* Bubble Paths (Navy B loop + Gradient crescent) */}
                        <motion.path d="M 246 33 L 442 35 Q 552 54 552 150 Q 552 244 443 264 L 312 280 Q 245 312 245 403 L 245 468" stroke={NAVY} strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" fill="none" {...drawAnim(0.45)} />
                        <motion.path d="M 245 403 L 245 468 Q 245 508 285 520 L 312 528 L 312 597 L 380 530 Q 420 522 460 500 Q 565 460 565 388 Q 565 313 510 290" stroke="url(#brieflyBubbleGrad)" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" fill="none" {...drawAnim(0.65)} />
                    </motion.svg>
                </motion.div>
            </div>

            {/* Text Container (Right Side)*/}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-5 flex-shrink-0">

                {/* Animated Brand Text */}
                <div className="overflow-hidden relative w-full md:w-auto">
                    <motion.h1
                        className="text-4xl lg:text-6xl font-black tracking-wider inline-block"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.2 }}
                    >
                        <span className="text-[#0a1628] ">
                            Brief
                            <span className="text-[#1754d6]">ly</span>
                        </span>
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    className="text-[#1754d6] font-semibold tracking-wider text-base md:text-lg"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.5 }}
                >
                    AI Summarizer &bull; Q&A
                </motion.p>

                {/* DaisyUI Loader Indicator */}
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-[#0a1628] text-sm uppercase tracking-widest font-semibold">
                    <span>{text}</span>
                </div>

            </div>

        </div>
    )
}

export default BrieflyWellcome;