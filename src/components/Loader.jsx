import { motion } from 'framer-motion';

const NAVY = '#0a1628';
const BLUE = '#1754d6';

const Loader = ({ size = 220 }) => {
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
    <motion.div
      className="min-h-screen flex items-center justify-center bg-base-100 p-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* Floating Icon Container */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="relative"
      >

        {/* Glowing Aura (Now lives on top of the backdrop) */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-0 bg-blue-200"
          animate={{ opacity: [0.6, 0.6, 0.6, 0.6] }}
          transition={{ ...loopTransition, delay: 0.3 }}
          style={{ filter: 'blur(120px)' }}
        />

        {/* EXACT LEFT-SIDE LOGO GRAPHIC */}
        <motion.svg
          viewBox="0 0 612 632"
          width={size}
          height={size * (632 / 612)}
          xmlns="http://www.w3.org/2000/svg"
          animate={{ opacity: [0.6, 1, 1, 0.6] }}
          transition={{ ...loopTransition, delay: 0.2 }}
          className="relative z-10 drop-shadow-xl"
        >
          <defs>
            <linearGradient id="brieflyBubbleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={NAVY} />
              <stop offset="55%" stopColor={NAVY} />
              <stop offset="100%" stopColor={BLUE} />
            </linearGradient>
          </defs>

          <motion.path d="M 32 263 L 210 262" stroke={NAVY} strokeWidth="35" strokeLinecap="round" fill="none" {...drawAnim(0)} />
          <motion.path d="M 104 339 L 165 339" stroke={NAVY} strokeWidth="35" strokeLinecap="round" fill="none" {...drawAnim(0.1)} />
          <motion.path d="M 29 415 L 160 415" stroke={NAVY} strokeWidth="35" strokeLinecap="round" fill="none" {...drawAnim(0.2)} />
          <motion.path d="M 23 112 L 422 112 Q 458 112 474 151 Q 474 187 422 187 L 127 188" stroke={BLUE} strokeWidth="40" strokeLinecap="round" fill="none" {...drawAnim(0.3)} />
          <motion.path d="M 246 33 L 442 35 Q 552 54 552 150 Q 552 244 443 264 L 312 280 Q 245 312 245 403 L 245 468" stroke={NAVY} strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" fill="none" {...drawAnim(0.45)} />
          <motion.path d="M 245 403 L 245 468 Q 245 508 285 520 L 312 528 L 312 597 L 380 530 Q 420 522 460 500 Q 565 460 565 388 Q 565 313 510 290" stroke="url(#brieflyBubbleGrad)" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" fill="none" {...drawAnim(0.65)} />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
};

export default Loader;