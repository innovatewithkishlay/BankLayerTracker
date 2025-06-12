import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-[#00ff9d] border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] text-white overflow-hidden flex-col relative">
            <div aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    background: "transparent",
                }}>

                <div
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: "none",
                        opacity: 0.18,
                        background: "transparent",
                    }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        style={{ position: "absolute", left: 0, top: 0 }}
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern
                                id="smallGrid"
                                width="28"
                                height="28"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 28 0 L 0 0 0 28"
                                    fill="none"
                                    stroke="#00ff9d"
                                    strokeWidth="1"
                                    opacity="0.18"
                                />
                            </pattern>
                            <pattern
                                id="grid"
                                width="112"
                                height="112"
                                patternUnits="userSpaceOnUse"
                            >
                                <rect width="112" height="112" fill="url(#smallGrid)" />
                                <path
                                    d="M 112 0 L 0 0 0 112"
                                    fill="none"
                                    stroke="#00ff9d"
                                    strokeWidth="1"
                                    opacity="0.28"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)">
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                from="0 0"
                                to="28 28"
                                dur="20s"
                                repeatCount="indefinite"
                            />
                        </rect>
                    </svg>
                </div>
                <div className="text-center relative z-100">
                    <h1 className="text-3xl text-gray-500 mt-20">Opps!</h1>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center items-center space-x-1 mt-10"
                    >
                        <motion.h1
                            animate={{
                                rotate: [-10],
                                y: [0, 2, -2, 0]
                            }}
                            transition={{
                                delay: 3,
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="mt-2 mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-9xl font-bold sm:mb-8 px-2 text-white"
                            style={{
                                fontFamily: "cursive",
                                left: '35px',
                                position: 'relative',
                                transform: 'rotate(-17deg)',
                                zIndex: -1,
                            }}
                        >
                            4
                        </motion.h1>
                        <div className='pb-5' style={{ zIndex: 2 }}>
                            <motion.div
                                animate={{
                                    rotate: [0],
                                    y: [0, 2, -2, 0]
                                }}
                                transition={{
                                    delay: 3,
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}>
                                <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    {/* Face outline */}
                                    <circle cx="100" cy="100" r="90" fill="orange" stroke="#0d0d0d" stroke-width="8" />

                                    {/* Left X eye */}
                                    <line x1="60" y1="70" x2="80" y2="90" stroke="black" stroke-width="5" stroke-linecap="round" />
                                    <line x1="80" y1="70" x2="60" y2="90" stroke="black" stroke-width="5" stroke-linecap="round" />

                                    {/* Right X eye */}
                                    <line x1="120" y1="70" x2="140" y2="90" stroke="black" stroke-width="5" stroke-linecap="round" />
                                    <line x1="140" y1="70" x2="120" y2="90" stroke="black" stroke-width="5" stroke-linecap="round" />

                                    {/* Sad mouth */}
                                    <path d="M60 140 Q100 110 140 140" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" />
                                </svg>
                            </motion.div>
                        </div>

                        <motion.h1
                            animate={{
                                rotate: [10],
                                y: [0, 2, -2, 0]
                            }}
                            transition={{
                                delay: 3,
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-9xl font-bold mb-6 sm:mb-8 text-white"
                            style={{
                                fontFamily: "cursive",
                                left: '-25px',
                                position: 'relative',
                                zIndex: 20
                            }}
                        >
                            4
                        </motion.h1>

                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold mb-2 sm:mb-2 px-4 text-[#00ff9d]"
                    >
                        Page Not Found
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto mb-3 sm:mb-12 leading-relaxed px-4"
                    >
                        Sorry, we can't find the page you're looking for.
                    </motion.p>


                    <Link
                        to="/"
                        className="w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] font-mono transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;



