
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Trophy, Maximize2, Minimize2, Volume2, VolumeX, Monitor, Smartphone, ArrowRight, Gamepad2, Mouse, Keyboard, Laptop, AlertTriangle } from 'lucide-react';
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 14;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 25;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;
const FPS = 60;

// Simplified power-up types for better performance
const POWER_TYPES = {
    MULTI_BALL: { color: 'bg-yellow-400', icon: '\u25cf\u25cf\u25cf', effect: 'Multi Ball', duration: 0 },
    BIG_PADDLE: { color: 'bg-blue-400', icon: '\u2501\u2501\u2501', effect: 'Big Paddle', duration: 400 },
    SLOW_BALL: { color: 'bg-green-400', icon: '\u25d0', effect: 'Slow Ball', duration: 300 },
    EXTRA_LIFE: { color: 'bg-red-400', icon: '\u2665', effect: 'Extra Life', duration: 0 },
    LASER: { color: 'bg-purple-400', icon: '\u2191\u2191\u2191', effect: 'Laser Mode', duration: 250 }
};

// Enhanced Desktop Required Component with improved visuals and messaging
const DesktopRequired = () => {
    const [animationState, setAnimationState] = useState('mobile');
    const [deviceInfo, setDeviceInfo] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
        isMobile: false,
        isTablet: false,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        hasTouch: false
    });

    useEffect(() => {
        // Update device info
        const updateDeviceInfo = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const userAgent = navigator.userAgent;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || width < 768;
            const isTablet = (width >= 768 && width < 1024) || /iPad|Tablet/i.test(userAgent);
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            setDeviceInfo({
                width,
                height,
                isMobile,
                isTablet,
                userAgent,
                hasTouch
            });
        };

        // Animation interval for device switching
        const interval = setInterval(() => {
            setAnimationState(prev => prev === 'mobile' ? 'desktop' : 'mobile');
        }, 3000);

        updateDeviceInfo();
        window.addEventListener('resize', updateDeviceInfo);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateDeviceInfo, 500);
        });

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', updateDeviceInfo);
            window.removeEventListener('orientationchange', updateDeviceInfo);
        };
    }, []);

    return (
        <Dashboard activeMenu="Brick Breaker Game">
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Floating Particles */}
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                        `,
                            backgroundSize: '50px 50px'
                        }} />
                    </div>

                    {/* Floating Game Elements */}
                    <div className="absolute top-10 left-10 opacity-20 animate-bounce">
                        <div className="w-16 h-4 bg-red-500 rounded" />
                    </div>
                    <div className="absolute top-20 right-20 opacity-20 animate-pulse">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                    </div>
                    <div className="absolute bottom-20 left-20 opacity-20 animate-ping">
                        <div className="w-20 h-3 bg-blue-500 rounded-full" />
                    </div>
                    <div className="absolute bottom-40 right-40 opacity-20 animate-bounce">
                        <div className="w-12 h-12 bg-purple-500/30 rounded-lg rotate-45" />
                    </div>
                </div>

                <div className="max-w-2xl w-full text-center relative z-10">
                    {/* Alert Banner */}
                    <div className="mb-8 bg-red-500/80 backdrop-blur-sm p-3 rounded-lg flex items-center justify-center gap-2 animate-pulse">
                        <AlertTriangle className="w-6 h-6" />
                        <span className="font-bold">DESKTOP DEVICE REQUIRED</span>
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    {/* Main Icon Animation */}
                    <div className="relative mb-12 flex items-center justify-center gap-8">
                        {/* Mobile Device */}
                        <div className={`relative transition-all duration-1000 ${animationState === 'mobile' ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
                            <div className="relative w-24 h-24 p-4">
                                <Smartphone className="w-full h-full text-red-400" strokeWidth={1.5} />
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                                    <span className="text-white text-2xl font-bold">\u2715</span>
                                </div>
                            </div>
                            <p className="mt-3 text-red-400 font-semibold">Not Supported</p>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center gap-2">
                            <ArrowRight className="w-10 h-10 text-cyan-400 animate-pulse" />
                            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                        </div>

                        {/* Desktop */}
                        <div className={`relative transition-all duration-1000 ${animationState === 'desktop' ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
                            <div className="relative w-24 h-24 p-4">
                                <Laptop className="w-full h-full text-green-400" strokeWidth={1.5} />
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                    <span className="text-white text-2xl font-bold">\u2713</span>
                                </div>
                            </div>
                            <p className="mt-3 text-green-400 font-semibold">Required</p>
                        </div>
                    </div>

                    {/* Main Title */}
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 animate-pulse">
                            BRICK BREAKER
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full" />
                    </div>

                    {/* Desktop Required Message */}
                    <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 mb-8">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Laptop className="w-8 h-8 text-cyan-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">Desktop Required</h2>
                            <Laptop className="w-8 h-8 text-cyan-400" />
                        </div>

                        <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                            This game requires a desktop or laptop computer with a keyboard and mouse for the optimal gaming experience.
                        </p>

                        {/* Feature Requirements */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <Keyboard className="w-8 h-8 text-blue-400" />
                                <div className="text-center">
                                    <h3 className="font-semibold text-blue-400 mb-1">Keyboard Controls</h3>
                                    <p className="text-xs text-gray-400">Arrow keys or A/D for precise paddle movement</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <Mouse className="w-8 h-8 text-purple-400" />
                                <div className="text-center">
                                    <h3 className="font-semibold text-purple-400 mb-1">Mouse Support</h3>
                                    <p className="text-xs text-gray-400">Click interactions and menu navigation</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <Monitor className="w-8 h-8 text-green-400" />
                                <div className="text-center">
                                    <h3 className="font-semibold text-green-400 mb-1">Large Display</h3>
                                    <p className="text-xs text-gray-400">Minimum 1024px width for full experience</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Card */}
                    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-6 border border-indigo-500/30 shadow-lg mb-8">
                        <h3 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center justify-center gap-2">
                            <Laptop className="w-6 h-6" />
                            How to Play on Desktop
                        </h3>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                                <p>Open this page on your desktop or laptop computer</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                                <p>Ensure your screen is at least 1024px wide for optimal experience</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                                <p>Use keyboard controls for precise paddle movement</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                                <p>Enjoy the full gaming experience with power-ups and effects!</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="group bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/30 border-2 border-cyan-300/40 flex items-center justify-center gap-3"
                        >
                            <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                            Try Again
                        </button>
                    </div>

                    {/* Device Info */}
                    <div className="mt-8 p-4 bg-black/20 rounded-lg border border-gray-700/30">
                        <p className="text-sm text-gray-400 mb-2">Current Device Info:</p>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Screen Size: {deviceInfo.width}px \u00d7 {deviceInfo.height}px (Minimum Required: 1024px width)</p>
                            <p>Device Type: {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop/Laptop'}</p>
                            <p>Touch Support: {deviceInfo.hasTouch ? 'Yes (Not Ideal for Game)' : 'No'}</p>
                            <p className="text-xs opacity-70 truncate">{deviceInfo.userAgent}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

// Enhanced Device Detection Hook with more accurate detection
const useDeviceDetection = () => {
    const [deviceInfo, setDeviceInfo] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
        screenHeight: typeof window !== 'undefined' ? window.innerHeight : 768,
        hasTouch: false,
        orientation: 'landscape'
    });

    useEffect(() => {
        const checkDevice = () => {
            if (typeof window === 'undefined') return;

            const userAgent = navigator.userAgent.toLowerCase();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Enhanced mobile detection with multiple signals
            const mobileKeywords = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i;
            const tabletKeywords = /ipad|tablet|playbook|silk/i;

            const isMobileUA = mobileKeywords.test(userAgent) && !tabletKeywords.test(userAgent);

            // Touch detection
            const hasTouch = 'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0;

            // Screen size detection with more granularity
            const isVerySmallScreen = screenWidth < 640;
            const isSmallScreen = screenWidth < 768;
            const isMediumScreen = screenWidth >= 768 && screenWidth < 1024;
            const isLargeScreen = screenWidth >= 1024;

            // Orientation detection
            const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';

            // Combined signals for better accuracy
            const isMobile = isMobileUA || isVerySmallScreen || (hasTouch && isSmallScreen && orientation === 'portrait');
            const isTablet = (tabletKeywords.test(userAgent) || isMediumScreen ||
                (hasTouch && orientation === 'landscape' && screenWidth < 1024)) && !isMobile;

            // Desktop is the absence of mobile and tablet indicators, plus minimum screen size
            const isDesktop = !isMobile && !isTablet && isLargeScreen;

            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                screenWidth,
                screenHeight,
                hasTouch,
                orientation
            });
        };

        // Initial check
        checkDevice();

        // Event listeners for responsive updates
        window.addEventListener('resize', checkDevice);
        window.addEventListener('orientationchange', () => {
            setTimeout(checkDevice, 500); // Delay to ensure orientation has changed
        });

        return () => {
            window.removeEventListener('resize', checkDevice);
            window.removeEventListener('orientationchange', checkDevice);
        };
    }, []);

    return deviceInfo;
};

const BrickBreaker = () => {
    useUser();
    const deviceInfo = useDeviceDetection();

    // Early return for non-desktop devices - this is the key part that ensures
    // the game only runs on desktop devices
    if (!deviceInfo.isDesktop) {
        return <DesktopRequired />;
    }

    const gameAreaRef = useRef(null);
    const animationFrameRef = useRef(null);
    const gameStateRef = useRef({});
    const lastTimeRef = useRef(0);
    const lastLaserTime = useRef(0);
    const containerRef = useRef(null);

    // Core game state
    const [gameState, setGameState] = useState('menu');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(() => {
        try {
            return parseInt(localStorage.getItem('brickBreakerHighScore') || '0');
        } catch {
            return 0;
        }
    });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Optimized game objects
    const gameObjectsRef = useRef({
        paddle: { x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH },
        balls: [],
        bricks: [],
        powerUps: [],
        particles: [],
        lasers: [],
        activePowerUps: new Set(),
        powerUpTimers: new Map()
    });

    // Input handling
    const keys = useRef({ left: false, right: false, space: false });
    const paddleTarget = useRef(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
    const scale = useRef(1);

    // Audio
    const audioContext = useRef(null);

    const playSound = useCallback((frequency, duration = 100, type = 'sine') => {
        if (!soundEnabled || !audioContext.current) return;

        try {
            const oscillator = audioContext.current.createOscillator();
            const gainNode = audioContext.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.current.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.05, audioContext.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);

            oscillator.start();
            oscillator.stop(audioContext.current.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }, [soundEnabled]);

    // Initialize audio
    useEffect(() => {
        try {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('AudioContext creation failed:', error);
        }
    }, []);

    // Optimized brick initialization
    const initializeBricks = useCallback(() => {
        const newBricks = [];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
        const powerUpChance = Math.min(0.12, 0.06 + level * 0.01);

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                if (level > 3 && (row + col) % 5 === 0 && Math.random() < 0.3) continue;

                newBricks.push({
                    id: `${row}-${col}`,
                    x: col * (BRICK_WIDTH + 5) + 37.5,
                    y: row * (BRICK_HEIGHT + 5) + 60,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    color: colors[row],
                    hits: Math.min(Math.floor(level / 4) + 1, 3),
                    maxHits: Math.min(Math.floor(level / 4) + 1, 3),
                    powerUp: Math.random() < powerUpChance ?
                        Object.keys(POWER_TYPES)[Math.floor(Math.random() * Object.keys(POWER_TYPES).length)] : null
                });
            }
        }
        return newBricks;
    }, [level]);

    // Optimized ball creation
    const createBall = useCallback((x = GAME_WIDTH / 2, y = GAME_HEIGHT - 100, customVelocity = null) => {
        const baseSpeed = 3 + level * 0.15;
        const angle = customVelocity ?
            Math.atan2(customVelocity.dy, customVelocity.dx) :
            -Math.PI / 2 + (Math.random() - 0.5) * 0.6;

        return {
            id: `ball-${Date.now()}-${Math.random()}`,
            x,
            y,
            dx: customVelocity ? customVelocity.dx : Math.cos(angle) * baseSpeed,
            dy: customVelocity ? customVelocity.dy : Math.sin(angle) * baseSpeed,
            trail: []
        };
    }, [level]);

    const resetBall = useCallback(() => {
        return [createBall()];
    }, [createBall]);

    // Game initialization
    const resetGame = useCallback(() => {
        gameObjectsRef.current = {
            paddle: { x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH },
            balls: resetBall(),
            bricks: initializeBricks(),
            powerUps: [],
            particles: [],
            lasers: [],
            activePowerUps: new Set(),
            powerUpTimers: new Map()
        };
        paddleTarget.current = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    }, [initializeBricks, resetBall]);

    // Start new game
    const startNewGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        setLives(3);
        resetGame();
        setGameState('playing');
        playSound(800, 150);
    }, [resetGame, playSound]);

    // Collision detection
    const checkCollision = useCallback((ball, rect) => {
        return !(ball.x + BALL_SIZE / 2 < rect.x ||
            ball.x - BALL_SIZE / 2 > rect.x + rect.width ||
            ball.y + BALL_SIZE / 2 < rect.y ||
            ball.y - BALL_SIZE / 2 > rect.y + rect.height);
    }, []);

    // Power-up application
    const applyPowerUp = useCallback((type) => {
        const objects = gameObjectsRef.current;

        switch (type) {
            case 'MULTI_BALL':
                if (objects.balls.length < 4) {
                    const newBalls = [];
                    objects.balls.forEach(ball => {
                        if (newBalls.length < 2) {
                            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                            const angles = [-Math.PI / 4, Math.PI / 4];

                            angles.forEach(angle => {
                                newBalls.push(createBall(
                                    ball.x,
                                    ball.y,
                                    {
                                        dx: Math.cos(angle) * speed,
                                        dy: Math.sin(angle) * speed
                                    }
                                ));
                            });
                        }
                    });
                    objects.balls = [...objects.balls, ...newBalls.slice(0, 2)];
                }
                playSound(800, 150);
                break;

            case 'BIG_PADDLE':
                objects.paddle.width = PADDLE_WIDTH * 1.4;
                objects.activePowerUps.add('BIG_PADDLE');
                objects.powerUpTimers.set('BIG_PADDLE', POWER_TYPES.BIG_PADDLE.duration);
                playSound(400, 100);
                break;

            case 'SLOW_BALL':
                objects.balls.forEach(ball => {
                    ball.dx *= 0.75;
                    ball.dy *= 0.75;
                });
                objects.activePowerUps.add('SLOW_BALL');
                objects.powerUpTimers.set('SLOW_BALL', POWER_TYPES.SLOW_BALL.duration);
                playSound(300, 150);
                break;

            case 'EXTRA_LIFE':
                setLives(prev => prev + 1);
                playSound(1000, 200);
                break;

            case 'LASER':
                objects.activePowerUps.add('LASER');
                objects.powerUpTimers.set('LASER', POWER_TYPES.LASER.duration);
                playSound(600, 100);
                break;
        }
    }, [createBall, playSound]);

    // Game loop
    const gameLoop = useCallback((currentTime) => {
        if (gameStateRef.current.state !== 'playing') return;

        const deltaTime = Math.min(currentTime - lastTimeRef.current, 32);
        lastTimeRef.current = currentTime;
        const timeScale = deltaTime / (1000 / FPS);

        const objects = gameObjectsRef.current;
        let scoreToAdd = 0;

        // Update paddle
        const targetX = paddleTarget.current;
        const currentX = objects.paddle.x;
        const paddleSpeed = 10;

        if (Math.abs(targetX - currentX) > 1) {
            objects.paddle.x = Math.max(0, Math.min(GAME_WIDTH - objects.paddle.width,
                currentX + Math.sign(targetX - currentX) * paddleSpeed * timeScale));
        }

        // Handle keyboard movement
        if (keys.current.left) {
            paddleTarget.current = Math.max(0, paddleTarget.current - (6 + level) * timeScale);
        }
        if (keys.current.right) {
            paddleTarget.current = Math.min(GAME_WIDTH - objects.paddle.width,
                paddleTarget.current + (6 + level) * timeScale);
        }

        // Update balls
        const ballsToRemove = [];
        objects.balls.forEach((ball, ballIndex) => {
            ball.x += ball.dx * timeScale;
            ball.y += ball.dy * timeScale;

            // Wall collisions
            if (ball.x <= BALL_SIZE / 2) {
                ball.x = BALL_SIZE / 2;
                ball.dx = Math.abs(ball.dx);
                playSound(600, 30);
            } else if (ball.x >= GAME_WIDTH - BALL_SIZE / 2) {
                ball.x = GAME_WIDTH - BALL_SIZE / 2;
                ball.dx = -Math.abs(ball.dx);
                playSound(600, 30);
            }

            if (ball.y <= BALL_SIZE / 2) {
                ball.y = BALL_SIZE / 2;
                ball.dy = Math.abs(ball.dy);
                playSound(500, 30);
            }

            // Check if ball is lost
            if (ball.y > GAME_HEIGHT + 50) {
                ballsToRemove.push(ballIndex);
                return;
            }

            // Paddle collision
            const paddleRect = {
                x: objects.paddle.x,
                y: GAME_HEIGHT - 80,
                width: objects.paddle.width,
                height: PADDLE_HEIGHT
            };

            if (checkCollision(ball, paddleRect) && ball.dy > 0) {
                const hitPosition = (ball.x - (paddleRect.x + paddleRect.width / 2)) / paddleRect.width;
                const spin = hitPosition * 3;

                ball.dy = -Math.abs(ball.dy);
                ball.dx = ball.dx * 0.8 + spin;
                ball.y = paddleRect.y - BALL_SIZE / 2 - 1;

                const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                const minSpeed = 2.5 + level * 0.1;
                const maxSpeed = 6 + level * 0.15;

                if (speed < minSpeed || speed > maxSpeed) {
                    const targetSpeed = speed < minSpeed ? minSpeed : maxSpeed;
                    const ratio = targetSpeed / speed;
                    ball.dx *= ratio;
                    ball.dy *= ratio;
                }

                playSound(700, 50);
            }

            // Brick collisions
            for (let i = objects.bricks.length - 1; i >= 0; i--) {
                const brick = objects.bricks[i];

                if (checkCollision(ball, brick)) {
                    ball.dy = -ball.dy;

                    brick.hits--;
                    scoreToAdd += 10 * level;

                    if (brick.hits <= 0) {
                        scoreToAdd += 40 * level;

                        if (brick.powerUp && objects.powerUps.length < 3) {
                            objects.powerUps.push({
                                id: `powerup-${Date.now()}-${Math.random()}`,
                                type: brick.powerUp,
                                x: brick.x + brick.width / 2,
                                y: brick.y + brick.height / 2,
                                dy: 1.2,
                                rotation: 0
                            });
                        }

                        objects.bricks.splice(i, 1);
                        playSound(400 + Math.random() * 100, 80);
                    } else {
                        playSound(300, 40);
                    }
                    break;
                }
            }
        });

        // Remove lost balls
        for (let i = ballsToRemove.length - 1; i >= 0; i--) {
            objects.balls.splice(ballsToRemove[i], 1);
        }

        // Update power-ups
        for (let i = objects.powerUps.length - 1; i >= 0; i--) {
            const powerUp = objects.powerUps[i];
            powerUp.y += powerUp.dy * timeScale;

            if (powerUp.y > GAME_HEIGHT + 30) {
                objects.powerUps.splice(i, 1);
                continue;
            }

            const collected = Math.abs(powerUp.x - (objects.paddle.x + objects.paddle.width / 2)) < 25 &&
                powerUp.y >= GAME_HEIGHT - 100 && powerUp.y <= GAME_HEIGHT - 70;

            if (collected) {
                applyPowerUp(powerUp.type);
                objects.powerUps.splice(i, 1);
            }
        }

        // Update power-up timers
        objects.powerUpTimers.forEach((timeLeft, powerType) => {
            if (timeLeft <= 0) {
                objects.activePowerUps.delete(powerType);
                objects.powerUpTimers.delete(powerType);

                // Reset effects when power-up expires
                if (powerType === 'BIG_PADDLE') {
                    objects.paddle.width = PADDLE_WIDTH;
                }
            } else {
                objects.powerUpTimers.set(powerType, timeLeft - 1);
            }
        });

        // Handle laser firing
        if (keys.current.space && objects.activePowerUps.has('LASER')) {
            const currentTime = Date.now();
            if (currentTime - lastLaserTime.current > 300) {
                lastLaserTime.current = currentTime;

                objects.lasers.push({
                    id: `laser-${Date.now()}`,
                    x: objects.paddle.x + objects.paddle.width / 2,
                    y: GAME_HEIGHT - 80,
                    dy: -8
                });

                playSound(1200, 50, 'sawtooth');
            }
        }

        // Update lasers
        for (let i = objects.lasers.length - 1; i >= 0; i--) {
            const laser = objects.lasers[i];
            laser.y += laser.dy * timeScale;

            if (laser.y < 0) {
                objects.lasers.splice(i, 1);
                continue;
            }

            // Check laser-brick collisions
            for (let j = objects.bricks.length - 1; j >= 0; j--) {
                const brick = objects.bricks[j];

                if (laser.x >= brick.x && laser.x <= brick.x + brick.width &&
                    laser.y >= brick.y && laser.y <= brick.y + brick.height) {

                    brick.hits--;
                    scoreToAdd += 5 * level;

                    if (brick.hits <= 0) {
                        scoreToAdd += 20 * level;

                        if (brick.powerUp && objects.powerUps.length < 3) {
                            objects.powerUps.push({
                                id: `powerup-${Date.now()}-${Math.random()}`,
                                type: brick.powerUp,
                                x: brick.x + brick.width / 2,
                                y: brick.y + brick.height / 2,
                                dy: 1.2,
                                rotation: 0
                            });
                        }

                        objects.bricks.splice(j, 1);
                        playSound(500, 40);
                    } else {
                        playSound(300, 30);
                    }

                    objects.lasers.splice(i, 1);
                    break;
                }
            }
        }

        // Update score
        if (scoreToAdd > 0) {
            setScore(prev => prev + scoreToAdd);
        }

        // Check game state
        if (objects.balls.length === 0) {
            const newLives = lives - 1;
            if (newLives <= 0) {
                setGameState('gameOver');
                if (score + scoreToAdd > highScore) {
                    const newHighScore = score + scoreToAdd;
                    setHighScore(newHighScore);
                    try {
                        localStorage.setItem('brickBreakerHighScore', newHighScore.toString());
                    } catch (error) {
                        console.warn('Failed to save high score:', error);
                    }
                }
                playSound(200, 400);
                return;
            } else {
                setLives(newLives);
                playSound(300, 200);
                setTimeout(() => {
                    if (gameStateRef.current.state === 'playing') {
                        objects.balls = resetBall();
                    }
                }, 1000);
            }
        }

        if (objects.bricks.length === 0) {
            setGameState('levelComplete');
            playSound(1000, 200);
            setTimeout(() => {
                setLevel(prev => prev + 1);
                resetGame();
                setGameState('playing');
            }, 2000);
            return;
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [checkCollision, applyPowerUp, level, lives, score, highScore, resetBall, resetGame, playSound]);

    // Update game state ref
    useEffect(() => {
        gameStateRef.current = { state: gameState };
    }, [gameState]);

    // Game loop management
    useEffect(() => {
        if (gameState === 'playing') {
            lastTimeRef.current = performance.now();
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState, gameLoop]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat) return;

            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    keys.current.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keys.current.right = true;
                    e.preventDefault();
                    break;
                case 'Space':
                    keys.current.space = true;
                    e.preventDefault();
                    break;
                case 'KeyP':
                    if (gameState === 'playing' || gameState === 'paused') {
                        setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
                    }
                    e.preventDefault();
                    break;
                case 'KeyF':
                    toggleFullscreen();
                    e.preventDefault();
                    break;
                case 'KeyM':
                    setSoundEnabled(prev => !prev);
                    e.preventDefault();
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    keys.current.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keys.current.right = false;
                    break;
                case 'Space':
                    keys.current.space = false;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);

    // Fullscreen handling
    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (error) {
            console.warn('Fullscreen failed:', error);
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Initialize game
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Force re-render for smooth visuals
    const [, forceUpdate] = useState({});
    useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => {
                forceUpdate({});
            }, 100);

            return () => clearInterval(interval);
        }
    }, [gameState]);

    // Memoized game objects for rendering
    const renderObjects = useMemo(() => {
        if (gameState !== 'playing') return null;

        const objects = gameObjectsRef.current;
        return {
            bricks: objects.bricks,
            balls: objects.balls,
            powerUps: objects.powerUps,
            particles: objects.particles.slice(-20),
            lasers: objects.lasers,
            paddle: objects.paddle,
            activePowerUps: objects.activePowerUps,
            powerUpTimers: objects.powerUpTimers
        };
    }, [gameState]);

    const activeBricksCount = gameObjectsRef.current.bricks.length;
    const totalBricks = BRICK_ROWS * BRICK_COLS;
    const bricksDestroyed = totalBricks - activeBricksCount;

    return (
        <Dashboard activeMenu="Brick Breaker Game">
            <div
                ref={containerRef}
                className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
            >
                {/* Header */}
                <div className="w-full px-4 py-2 flex flex-wrap justify-between items-center text-sm gap-2 bg-black/20 backdrop-blur-sm">
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <span className="font-mono font-bold">{score.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-300 hidden sm:block">Best: {highScore.toLocaleString()}</div>
                        <div className="text-cyan-400 font-bold">Level {level}</div>
                        <div className="text-orange-400">Progress: {Math.round((bricksDestroyed / Math.max(totalBricks, 1)) * 100)}%</div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="text-xs">Lives:</span>
                            {Array.from({ length: Math.max(0, lives) }, (_, i) => (
                                <span key={i} className="text-red-400 text-lg">\u2665</span>
                            ))}
                        </div>

                        <div className="flex gap-1">
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                title="Toggle Sound (M)"
                            >
                                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                title="Toggle Fullscreen (F)"
                            >
                                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Power-ups Display */}
                {gameObjectsRef.current.activePowerUps.size > 0 && (
                    <div className="px-4 py-2 bg-black/30 backdrop-blur-sm">
                        <div className="flex gap-2 flex-wrap justify-center">
                            {Array.from(gameObjectsRef.current.activePowerUps).map(type => {
                                const timeLeft = gameObjectsRef.current.powerUpTimers.get(type) || 0;
                                const progress = timeLeft / POWER_TYPES[type].duration * 100;

                                return (
                                    <div key={type} className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-1 border border-gray-700/50">
                                        <div className={`w-6 h-6 ${POWER_TYPES[type].color} rounded-full flex items-center justify-center text-black font-bold text-xs`}>
                                            {POWER_TYPES[type].icon}
                                        </div>
                                        <span className="text-xs text-gray-300">{POWER_TYPES[type].effect}</span>
                                        {timeLeft > 0 && (
                                            <div className="w-8 h-1 bg-gray-600 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-100"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Game Area Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="relative">
                        <div
                            ref={gameAreaRef}
                            className="relative bg-gradient-to-b from-gray-900 to-black border-4 border-cyan-400 shadow-2xl shadow-cyan-400/25 overflow-hidden select-none"
                            style={{
                                width: GAME_WIDTH,
                                height: GAME_HEIGHT,
                                maxWidth: '100vw',
                                maxHeight: '70vh'
                            }}
                        >
                            {/* Background */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20" />
                            </div>

                            {gameState === 'playing' && renderObjects && (
                                <>
                                    {/* Bricks */}
                                    {renderObjects.bricks.map((brick) => {
                                        const hitRatio = brick.hits / brick.maxHits;

                                        return (
                                            <div
                                                key={brick.id}
                                                className={`absolute ${brick.color} rounded-sm shadow-md border border-white/20`}
                                                style={{
                                                    left: brick.x,
                                                    top: brick.y,
                                                    width: brick.width,
                                                    height: brick.height,
                                                    opacity: Math.max(0.7, hitRatio),
                                                    transform: `scale(${0.95 + hitRatio * 0.05})`
                                                }}
                                            >
                                                {brick.powerUp && (
                                                    <div className={`absolute inset-0 ${POWER_TYPES[brick.powerUp].color} opacity-40 rounded-sm animate-pulse`} />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-sm" />
                                                {brick.hits > 1 && (
                                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                                        {brick.hits}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Balls */}
                                    {renderObjects.balls.map((ball) => (
                                        <div key={ball.id}>
                                            <div
                                                className="absolute bg-gradient-to-br from-cyan-200 via-cyan-400 to-cyan-600 rounded-full shadow-lg"
                                                style={{
                                                    left: ball.x - BALL_SIZE / 2,
                                                    top: ball.y - BALL_SIZE / 2,
                                                    width: BALL_SIZE,
                                                    height: BALL_SIZE,
                                                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
                                                }}
                                            >
                                                <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full" />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Paddle */}
                                    <div
                                        className="absolute bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-lg shadow-lg"
                                        style={{
                                            left: renderObjects.paddle.x,
                                            top: GAME_HEIGHT - 80,
                                            width: renderObjects.paddle.width,
                                            height: PADDLE_HEIGHT,
                                            boxShadow: '0 0 15px rgba(34, 211, 238, 0.6)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/30 rounded-lg" />
                                        {renderObjects.activePowerUps.has('LASER') && (
                                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-red-400 rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    {/* Lasers */}
                                    {renderObjects.lasers.map((laser) => (
                                        <div
                                            key={laser.id}
                                            className="absolute w-2 h-10 bg-gradient-to-b from-red-400 to-red-600 rounded-full"
                                            style={{
                                                left: laser.x - 1,
                                                top: laser.y - 5,
                                                boxShadow: '0 0 8px rgba(248, 113, 113, 0.8)'
                                            }}
                                        />
                                    ))}

                                    {/* Power-ups */}
                                    {renderObjects.powerUps.map((powerUp) => (
                                        <div
                                            key={powerUp.id}
                                            className={`absolute ${POWER_TYPES[powerUp.type].color} text-black font-bold text-xs flex items-center justify-center rounded-full shadow-lg border-2 border-white/40`}
                                            style={{
                                                left: powerUp.x - 20,
                                                top: powerUp.y - 20,
                                                width: 40,
                                                height: 40,
                                                transform: `rotate(${powerUp.rotation || 0}deg)`
                                            }}
                                        >
                                            <span style={{ transform: `rotate(-${powerUp.rotation || 0}deg)` }}>
                                                {POWER_TYPES[powerUp.type].icon}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Game info overlay */}
                                    <div className="absolute top-2 left-2 text-xs text-cyan-400/70 bg-black/30 rounded px-2 py-1">
                                        Bricks: {activeBricksCount}/{totalBricks}
                                    </div>
                                    <div className="absolute top-2 right-2 text-xs text-cyan-400/70 bg-black/30 rounded px-2 py-1">
                                        Balls: {renderObjects.balls.length}
                                    </div>
                                </>
                            )}

                            {/* Menu Screen */}
                            {gameState === 'menu' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/90 to-black/95 flex items-center justify-center">
                                    <div className="text-center p-8 max-w-md">
                                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-pulse">
                                            BRICK BREAKER
                                        </h1>
                                        <div className="mb-6 text-gray-300 space-y-2 text-sm">
                                            <p>Use \u2190\u2192 or A/D to move paddle</p>
                                            <p>SPACE to fire lasers (with power-up)</p>
                                            <p>Press P to pause \u2022 F for fullscreen \u2022 M for sound</p>
                                        </div>
                                        <button
                                            onClick={startNewGame}
                                            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/30 border-2 border-cyan-300/40"
                                        >
                                            <Play className="inline mr-2" size={20} />
                                            START GAME
                                        </button>
                                        <div className="mt-4 text-sm text-gray-500">
                                            High Score: {highScore.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pause Screen */}
                            {gameState === 'paused' && (
                                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <Pause className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
                                        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                            PAUSED
                                        </h2>
                                        <div className="space-y-3 flex flex-col items-center">
                                            <button
                                                onClick={() => setGameState('playing')}
                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg w-40"
                                            >
                                                RESUME
                                            </button>
                                            <button
                                                onClick={() => setGameState('menu')}
                                                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg w-40"
                                            >
                                                MENU
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Game Over Screen */}
                            {gameState === 'gameOver' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-md flex items-center justify-center">
                                    <div className="text-center p-6 max-w-sm">
                                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                            GAME OVER
                                        </h2>
                                        <div className="mb-6 space-y-2 bg-black/30 rounded-lg p-4">
                                            <p className="text-2xl md:text-3xl font-bold text-white">
                                                Score: {score.toLocaleString()}
                                            </p>
                                            <p className="text-xl text-gray-300">Level: {level}</p>
                                        </div>
                                        {score > highScore && (
                                            <div className="mb-6 animate-bounce">
                                                <p className="text-yellow-400 text-xl md:text-2xl font-bold">
                                                    NEW HIGH SCORE!
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-3 justify-center">
                                            <button
                                                onClick={startNewGame}
                                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                            >
                                                <RotateCcw className="inline mr-2" size={20} />
                                                PLAY AGAIN
                                            </button>
                                            <button
                                                onClick={() => setGameState('menu')}
                                                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                            >
                                                MAIN MENU
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Level Complete Screen */}
                            {gameState === 'levelComplete' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-md flex items-center justify-center">
                                    <div className="text-center p-6">
                                        <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400 animate-bounce" />
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                            LEVEL COMPLETE!
                                        </h2>
                                        <div className="mb-4 space-y-1 bg-black/30 rounded-lg p-4">
                                            <p className="text-xl md:text-2xl text-white font-bold">
                                                Level {level} Cleared!
                                            </p>
                                            <p className="text-lg text-gray-300">
                                                Bonus: +{(1000 * level).toLocaleString()} points
                                            </p>
                                            <p className="text-base text-green-300">
                                                Total Score: {score.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-xl text-yellow-400 animate-pulse">
                                            Advancing to Level {level + 1}...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Power-up Legend */}
                <div className="px-4 py-3 bg-black/20 backdrop-blur-sm border-t border-gray-700/30">
                    <h3 className="text-center text-lg font-bold mb-3 text-cyan-400">Power-ups Guide</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs max-w-4xl mx-auto">
                        {Object.entries(POWER_TYPES).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-2 border border-gray-700/50">
                                <div className={`w-6 h-6 ${value.color} rounded-full flex items-center justify-center text-black font-bold text-xs border border-white/30`}>
                                    {value.icon}
                                </div>
                                <span className="text-gray-300 font-medium text-sm">{value.effect}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 text-center text-xs text-gray-500">
                        P: Pause \u2022 F: Fullscreen \u2022 M: Sound \u2022 Space: Laser
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default BrickBreaker;
