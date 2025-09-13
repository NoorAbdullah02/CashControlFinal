import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Trophy, Maximize2, Minimize2, Volume2, VolumeX, Monitor, Zap, Shield, Gauge } from 'lucide-react';
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";


// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const ROAD_WIDTH = 400;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const FPS = 60;
const MAX_SPEED = 12;
const ACCELERATION = 0.3;
const DECELERATION = 0.2;
const TURN_SPEED = 0.08;

// Power-up types
const POWER_TYPES = {
    SPEED_BOOST: { color: 'bg-yellow-400', icon: '⚡', effect: 'Speed Boost', duration: 300 },
    SHIELD: { color: 'bg-blue-400', icon: '🛡', effect: 'Shield', duration: 400 },
    SLOW_MOTION: { color: 'bg-purple-400', icon: '⏰', effect: 'Slow Motion', duration: 250 },
    NITRO: { color: 'bg-red-400', icon: '🔥', effect: 'Nitro', duration: 200 }
};

const TRACK_TYPES = {
    HIGHWAY: { name: 'Highway', bgColor: 'from-gray-700 to-gray-900', roadColor: 'bg-gray-600' },
    DESERT: { name: 'Desert', bgColor: 'from-yellow-600 to-orange-800', roadColor: 'bg-yellow-700' },
    FOREST: { name: 'Forest', bgColor: 'from-green-700 to-green-900', roadColor: 'bg-green-600' },
    NIGHT: { name: 'Night City', bgColor: 'from-blue-900 to-black', roadColor: 'bg-gray-800' }
};

const CarRacingGame = () => {
    useUser();

    const MobileRestriction = () => (
        <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-white mb-4">Desktop Required</h1>
                <p className="text-white/70 text-lg mb-2">This racing game is optimized for desktop play.</p>
                <p className="text-white/50 text-sm">Please use a larger screen for the best racing experience.</p>
            </div>
        </div>
    );

    const gameAreaRef = useRef(null);
    const animationFrameRef = useRef(null);
    const gameStateRef = useRef({});
    const lastTimeRef = useRef(0);
    const containerRef = useRef(null);
    const audioContext = useRef(null);

    // Core game state
    const [gameState, setGameState] = useState('menu');
    const [currentTrack, setCurrentTrack] = useState('HIGHWAY');
    const [score, setScore] = useState(0);
    const [distance, setDistance] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(() => {
        try {
            return parseInt(localStorage.getItem('carRacingHighScore') || '0');
        } catch { return 0; }
    });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Game objects
    const gameObjectsRef = useRef({
        playerCar: { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 120, speed: 0, angle: 0 },
        enemyCars: [],
        roadMarkings: [],
        powerUps: [],
        particles: [],
        activePowerUps: new Set(),
        powerUpTimers: new Map(),
        roadCurve: 0,
        roadCurveTarget: 0
    });

    // Input handling
    const keys = useRef({ left: false, right: false, up: false, down: false });

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
        return () => {
            if (audioContext.current && audioContext.current.state !== 'closed') {
                audioContext.current.close();
            }
        };
    }, []);

    // Initialize road markings
    const initializeRoadMarkings = useCallback(() => {
        const markings = [];
        for (let i = 0; i < 20; i++) {
            markings.push({
                id: `marking-${i}`,
                x: GAME_WIDTH / 2 - 5,
                y: i * 40,
                width: 10,
                height: 20
            });
        }
        return markings;
    }, []);

    // Create enemy car
    const createEnemyCar = useCallback(() => {
        const lanes = [
            GAME_WIDTH / 2 - ROAD_WIDTH / 3,
            GAME_WIDTH / 2,
            GAME_WIDTH / 2 + ROAD_WIDTH / 3
        ];

        return {
            id: `enemy-${Date.now()}-${Math.random()}`,
            x: lanes[Math.floor(Math.random() * lanes.length)],
            y: -CAR_HEIGHT,
            speed: 2 + Math.random() * 3,
            color: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'][Math.floor(Math.random() * 4)],
            width: CAR_WIDTH,
            height: CAR_HEIGHT
        };
    }, []);

    // Create power-up
    const createPowerUp = useCallback(() => {
        const lanes = [
            GAME_WIDTH / 2 - ROAD_WIDTH / 4,
            GAME_WIDTH / 2,
            GAME_WIDTH / 2 + ROAD_WIDTH / 4
        ];

        const powerUpTypes = Object.keys(POWER_TYPES);
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

        return {
            id: `powerup-${Date.now()}-${Math.random()}`,
            type,
            x: lanes[Math.floor(Math.random() * lanes.length)],
            y: -30,
            rotation: 0
        };
    }, []);

    // Reset game
    const resetGame = useCallback(() => {
        gameObjectsRef.current = {
            playerCar: { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 120, speed: 0, angle: 0 },
            enemyCars: [],
            roadMarkings: initializeRoadMarkings(),
            powerUps: [],
            particles: [],
            activePowerUps: new Set(),
            powerUpTimers: new Map(),
            roadCurve: 0,
            roadCurveTarget: 0
        };
        setDistance(0);
    }, [initializeRoadMarkings]);

    // Start new game
    const startNewGame = useCallback(() => {
        setScore(0);
        setLives(3);
        resetGame();
        setGameState('playing');
        playSound(800, 150);
    }, [resetGame, playSound]);

    // Collision detection
    const checkCollision = useCallback((obj1, obj2) => {
        return !(obj1.x + obj1.width < obj2.x ||
            obj1.x > obj2.x + obj2.width ||
            obj1.y + obj1.height < obj2.y ||
            obj1.y > obj2.y + obj2.height);
    }, []);

    // Apply power-up
    const applyPowerUp = useCallback((type) => {
        const objects = gameObjectsRef.current;

        switch (type) {
            case 'SPEED_BOOST':
                objects.playerCar.speed = Math.min(objects.playerCar.speed + 3, MAX_SPEED * 1.5);
                objects.activePowerUps.add('SPEED_BOOST');
                objects.powerUpTimers.set('SPEED_BOOST', POWER_TYPES.SPEED_BOOST.duration);
                playSound(1000, 150);
                break;
            case 'SHIELD':
                objects.activePowerUps.add('SHIELD');
                objects.powerUpTimers.set('SHIELD', POWER_TYPES.SHIELD.duration);
                playSound(600, 200);
                break;
            case 'SLOW_MOTION':
                objects.activePowerUps.add('SLOW_MOTION');
                objects.powerUpTimers.set('SLOW_MOTION', POWER_TYPES.SLOW_MOTION.duration);
                playSound(400, 300);
                break;
            case 'NITRO':
                objects.playerCar.speed = MAX_SPEED * 2;
                objects.activePowerUps.add('NITRO');
                objects.powerUpTimers.set('NITRO', POWER_TYPES.NITRO.duration);
                playSound(1200, 100);
                break;
            default:
                break;
        }
    }, [playSound]);

    // Game loop
    const gameLoop = useCallback((currentTime) => {
        if (gameStateRef.current.state !== 'playing') return;

        const deltaTime = Math.min(currentTime - lastTimeRef.current, 32);
        lastTimeRef.current = currentTime;
        const timeScale = deltaTime / (1000 / FPS);
        const slowMotionScale = gameObjectsRef.current.activePowerUps.has('SLOW_MOTION') ? 0.5 : 1;

        const objects = gameObjectsRef.current;
        let scoreToAdd = Math.floor(objects.playerCar.speed * timeScale);

        // Handle player input
        const player = objects.playerCar;

        if (keys.current.up) {
            player.speed = Math.min(player.speed + ACCELERATION * timeScale, MAX_SPEED);
        } else if (keys.current.down) {
            player.speed = Math.max(player.speed - DECELERATION * timeScale, -MAX_SPEED / 2);
        } else {
            player.speed *= 0.98; // Natural deceleration
        }

        if (keys.current.left && player.speed > 0) {
            player.x = Math.max(GAME_WIDTH / 2 - ROAD_WIDTH / 2 + CAR_WIDTH / 2,
                player.x - TURN_SPEED * player.speed * timeScale);
            player.angle = Math.max(player.angle - 0.1, -0.3);
        } else if (keys.current.right && player.speed > 0) {
            player.x = Math.min(GAME_WIDTH / 2 + ROAD_WIDTH / 2 - CAR_WIDTH / 2,
                player.x + TURN_SPEED * player.speed * timeScale);
            player.angle = Math.min(player.angle + 0.1, 0.3);
        } else {
            player.angle *= 0.9; // Return to center
        }

        // Update road curve
        if (Math.random() < 0.005) {
            objects.roadCurveTarget = (Math.random() - 0.5) * 2;
        }
        objects.roadCurve += (objects.roadCurveTarget - objects.roadCurve) * 0.02;

        // Update road markings
        objects.roadMarkings.forEach(marking => {
            marking.y += (player.speed * 3 + 2) * timeScale * slowMotionScale;
            if (marking.y > GAME_HEIGHT) {
                marking.y = -20;
            }
        });

        // Spawn enemy cars
        if (Math.random() < 0.008 + distance / 50000) {
            objects.enemyCars.push(createEnemyCar());
        }

        // Update enemy cars
        for (let i = objects.enemyCars.length - 1; i >= 0; i--) {
            const enemy = objects.enemyCars[i];
            enemy.y += (enemy.speed + player.speed) * timeScale * slowMotionScale;

            if (enemy.y > GAME_HEIGHT + CAR_HEIGHT) {
                objects.enemyCars.splice(i, 1);
                scoreToAdd += 50;
                continue;
            }

            // Check collision with player
            const playerRect = { x: player.x - CAR_WIDTH / 2, y: player.y - CAR_HEIGHT / 2, width: CAR_WIDTH, height: CAR_HEIGHT };
            const enemyRect = { x: enemy.x - enemy.width / 2, y: enemy.y - enemy.height / 2, width: enemy.width, height: enemy.height };

            if (checkCollision(playerRect, enemyRect)) {
                if (objects.activePowerUps.has('SHIELD')) {
                    objects.enemyCars.splice(i, 1);
                    scoreToAdd += 100;
                    playSound(800, 100);
                } else {
                    const newLives = lives - 1;
                    setLives(newLives);

                    if (newLives <= 0) {
                        setGameState('gameOver');
                        if (score + scoreToAdd > highScore) {
                            const newHighScore = score + scoreToAdd;
                            setHighScore(newHighScore);
                            try {
                                localStorage.setItem('carRacingHighScore', newHighScore.toString());
                            } catch (error) {
                                console.warn('Failed to save high score:', error);
                            }
                        }
                        playSound(200, 400);
                        return;
                    }

                    objects.enemyCars.splice(i, 1);
                    player.speed = Math.max(player.speed * 0.5, 0);
                    playSound(300, 200);
                }
            }
        }

        // Spawn power-ups
        if (Math.random() < 0.002) {
            objects.powerUps.push(createPowerUp());
        }

        // Update power-ups
        for (let i = objects.powerUps.length - 1; i >= 0; i--) {
            const powerUp = objects.powerUps[i];
            powerUp.y += (player.speed * 2 + 3) * timeScale * slowMotionScale;
            powerUp.rotation += 2 * timeScale;

            if (powerUp.y > GAME_HEIGHT + 30) {
                objects.powerUps.splice(i, 1);
                continue;
            }

            // Check collection
            const distance = Math.sqrt(
                Math.pow(powerUp.x - player.x, 2) +
                Math.pow(powerUp.y - player.y, 2)
            );

            if (distance < 30) {
                applyPowerUp(powerUp.type);
                objects.powerUps.splice(i, 1);
                scoreToAdd += 20;
            }
        }

        // Update power-up timers
        objects.powerUpTimers.forEach((timeLeft, powerType) => {
            if (timeLeft <= 0) {
                objects.activePowerUps.delete(powerType);
                objects.powerUpTimers.delete(powerType);
            } else {
                objects.powerUpTimers.set(powerType, timeLeft - 1);
            }
        });

        // Update score and distance
        if (scoreToAdd > 0) {
            setScore(prev => prev + scoreToAdd);
        }
        setDistance(prev => prev + player.speed * timeScale);

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [lives, score, highScore, distance, checkCollision, createEnemyCar, createPowerUp, applyPowerUp, playSound]);

    // Update game state reference
    useEffect(() => {
        gameStateRef.current = { state: gameState };
    }, [gameState]);

    // Game loop effect
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
                case 'ArrowUp':
                case 'KeyW':
                    keys.current.up = true;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    keys.current.down = true;
                    e.preventDefault();
                    break;
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
                case 'ArrowUp':
                case 'KeyW':
                    keys.current.up = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    keys.current.down = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    keys.current.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keys.current.right = false;
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

    // Force render updates
    const [, forceUpdate] = useState({});
    useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => forceUpdate({}), 50);
            return () => clearInterval(interval);
        }
    }, [gameState]);

    const renderObjects = useMemo(() => {
        if (gameState !== 'playing') return null;
        return gameObjectsRef.current;
    }, [gameState]);

    const speedKmh = Math.round(gameObjectsRef.current.playerCar.speed * 10);
    const distanceKm = Math.round(distance / 100);

    return (
        <>
            <MobileRestriction />
            <Dashboard activeMenu="Car Racing">
                <div
                    ref={containerRef}
                    className={`min-h-screen bg-gradient-to-b ${TRACK_TYPES[currentTrack].bgColor} text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
                >
                    {/* Header HUD */}
                    <div className="w-full px-4 py-2 flex flex-wrap justify-between items-center text-sm gap-2 bg-black/40 backdrop-blur-sm">
                        <div className="flex gap-4 items-center flex-wrap">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <span className="font-mono font-bold">{score.toLocaleString()}</span>
                            </div>
                            <div className="text-gray-300 hidden sm:block">Best: {highScore.toLocaleString()}</div>
                            <div className="text-cyan-400 font-bold">Track: {TRACK_TYPES[currentTrack].name}</div>
                            <div className="text-green-400">{distanceKm} km</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Gauge className="w-4 h-4 text-orange-400" />
                                <span className="font-mono text-orange-400">{speedKmh} km/h</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">Lives:</span>
                                {Array.from({ length: Math.max(0, lives) }, (_, i) => (
                                    <span key={i} className="text-red-400 text-lg">♥</span>
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

                    {/* Active Power-ups */}
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
                                            <div className="w-8 h-1 bg-gray-600 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-100"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Game Area */}
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="relative">
                            <div
                                ref={gameAreaRef}
                                className="relative bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-cyan-400 shadow-2xl shadow-cyan-400/25 overflow-hidden select-none"
                                style={{
                                    width: GAME_WIDTH,
                                    height: GAME_HEIGHT,
                                    maxWidth: '100vw',
                                    maxHeight: '70vh'
                                }}
                            >
                                {/* Road Background */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${TRACK_TYPES[currentTrack].bgColor}`}>
                                    <div className={`absolute left-1/2 transform -translate-x-1/2 ${TRACK_TYPES[currentTrack].roadColor} shadow-inner`}
                                        style={{ width: ROAD_WIDTH, height: '100%' }} />
                                </div>

                                {gameState === 'playing' && renderObjects && (
                                    <>
                                        {/* Road Markings */}
                                        {renderObjects.roadMarkings.map((marking) => (
                                            <div
                                                key={marking.id}
                                                className="absolute bg-white opacity-80"
                                                style={{
                                                    left: marking.x + renderObjects.roadCurve * marking.y / 10,
                                                    top: marking.y,
                                                    width: marking.width,
                                                    height: marking.height
                                                }}
                                            />
                                        ))}

                                        {/* Enemy Cars */}
                                        {renderObjects.enemyCars.map((car) => (
                                            <div key={car.id}>
                                                <div
                                                    className={`absolute ${car.color} rounded-lg shadow-lg border border-white/20`}
                                                    style={{
                                                        left: car.x - car.width / 2 + renderObjects.roadCurve * car.y / 15,
                                                        top: car.y - car.height / 2,
                                                        width: car.width,
                                                        height: car.height,
                                                        transform: `rotate(${renderObjects.roadCurve * 0.5}deg)`
                                                    }}
                                                >
                                                    <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded" />
                                                    <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-300 rounded-full" />
                                                    <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-300 rounded-full" />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Power-ups */}
                                        {renderObjects.powerUps.map((powerUp) => (
                                            <div
                                                key={powerUp.id}
                                                className={`absolute ${POWER_TYPES[powerUp.type].color} text-black font-bold text-lg flex items-center justify-center rounded-full shadow-lg border-2 border-white/60 animate-bounce`}
                                                style={{
                                                    left: powerUp.x - 20 + renderObjects.roadCurve * powerUp.y / 15,
                                                    top: powerUp.y - 20,
                                                    width: 40,
                                                    height: 40,
                                                    transform: `rotate(${powerUp.rotation}deg)`
                                                }}
                                            >
                                                {POWER_TYPES[powerUp.type].icon}
                                            </div>
                                        ))}

                                        {/* Player Car */}
                                        <div
                                            className={`absolute bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 rounded-lg shadow-xl ${renderObjects.activePowerUps.has('SHIELD') ? 'ring-4 ring-blue-400 ring-opacity-60' : ''}`}
                                            style={{
                                                left: renderObjects.playerCar.x - CAR_WIDTH / 2,
                                                top: renderObjects.playerCar.y - CAR_HEIGHT / 2,
                                                width: CAR_WIDTH,
                                                height: CAR_HEIGHT,
                                                transform: `rotate(${renderObjects.playerCar.angle}rad)`,
                                                boxShadow: renderObjects.activePowerUps.has('NITRO')
                                                    ? '0 0 20px rgba(255, 0, 0, 0.8)'
                                                    : '0 0 15px rgba(34, 211, 238, 0.6)'
                                            }}
                                        >
                                            <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded" />
                                            <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 rounded-full" />
                                            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full" />
                                            <div className="absolute bottom-2 left-2 w-3 h-3 bg-red-500 rounded-full" />
                                            <div className="absolute bottom-2 right-2 w-3 h-3 bg-red-500 rounded-full" />
                                        </div>

                                        {/* Nitro Effect */}
                                        {renderObjects.activePowerUps.has('NITRO') && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                {[...Array(10)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-2 h-8 bg-gradient-to-t from-orange-400 to-transparent opacity-80"
                                                        style={{
                                                            left: `${10 + i * 8}%`,
                                                            top: `${80 + Math.sin(Date.now() / 100 + i) * 10}%`,
                                                            animation: 'fadeInOut 0.3s ease-in-out infinite alternate'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Speed Lines Effect */}
                                        {renderObjects.playerCar.speed > 8 && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                {[...Array(15)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-1 bg-gradient-to-b from-white/60 to-transparent"
                                                        style={{
                                                            left: `${Math.random() * 100}%`,
                                                            top: 0,
                                                            height: '100%',
                                                            animation: `speedLine ${0.1 + Math.random() * 0.2}s linear infinite`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Menu Screen */}
                                {gameState === 'menu' && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95 flex items-center justify-center">
                                        <div className="text-center p-8 max-w-md">
                                            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6 animate-pulse">
                                                CAR RACING
                                            </h1>

                                            {/* Track Selection */}
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold mb-3 text-gray-300">Select Track</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.entries(TRACK_TYPES).map(([key, track]) => (
                                                        <button
                                                            key={key}
                                                            onClick={() => setCurrentTrack(key)}
                                                            className={`p-2 rounded text-sm font-medium transition-all ${currentTrack === key
                                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                }`}
                                                        >
                                                            {track.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6 text-gray-300 space-y-2 text-sm">
                                                <p>Use ↑↓ or W/S for acceleration/braking</p>
                                                <p>Use ←→ or A/D for steering</p>
                                                <p>Avoid crashes, collect power-ups!</p>
                                                <p>Press P to pause • F for fullscreen • M for sound</p>
                                            </div>

                                            <button
                                                onClick={startNewGame}
                                                className="bg-gradient-to-r from-red-500 via-orange-600 to-yellow-600 hover:from-red-600 hover:via-orange-700 hover:to-yellow-700 px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-500/30 border-2 border-orange-300/40"
                                            >
                                                <Play className="inline mr-2" size={20} />
                                                START RACE
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
                                            <Pause className="w-16 h-16 mx-auto mb-4 text-orange-400 animate-pulse" />
                                            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                RACE PAUSED
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
                                                RACE OVER
                                            </h2>
                                            <div className="mb-6 space-y-2 bg-black/30 rounded-lg p-4">
                                                <p className="text-2xl md:text-3xl font-bold text-white">
                                                    Score: {score.toLocaleString()}
                                                </p>
                                                <p className="text-xl text-gray-300">Distance: {distanceKm} km</p>
                                                <p className="text-lg text-orange-300">Top Speed: {speedKmh} km/h</p>
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
                                                    className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                                >
                                                    <RotateCcw className="inline mr-2" size={20} />
                                                    RACE AGAIN
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
                            </div>
                        </div>
                    </div>

                    {/* Power-up Legend & Controls */}
                    <div className="px-4 py-3 bg-black/20 backdrop-blur-sm border-t border-gray-700/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                            {/* Power-ups */}
                            <div>
                                <h3 className="text-center text-lg font-bold mb-3 text-orange-400">Power-ups</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {Object.entries(POWER_TYPES).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-2 border border-gray-700/50">
                                            <div className={`w-6 h-6 ${value.color} rounded-full flex items-center justify-center text-black font-bold text-xs border border-white/30`}>
                                                {value.icon}
                                            </div>
                                            <span className="text-gray-300 font-medium">{value.effect}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Controls */}
                            <div>
                                <h3 className="text-center text-lg font-bold mb-3 text-cyan-400">Controls</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                                        <div className="font-bold text-green-400 mb-1">↑ W</div>
                                        <div className="text-gray-300">Accelerate</div>
                                    </div>
                                    <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                                        <div className="font-bold text-red-400 mb-1">↓ S</div>
                                        <div className="text-gray-300">Brake</div>
                                    </div>
                                    <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                                        <div className="font-bold text-blue-400 mb-1">← A</div>
                                        <div className="text-gray-300">Steer Left</div>
                                    </div>
                                    <div className="bg-gray-800/60 rounded-lg p-2 text-center">
                                        <div className="font-bold text-blue-400 mb-1">→ D</div>
                                        <div className="text-gray-300">Steer Right</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 text-center text-xs text-gray-500">
                            P: Pause • F: Fullscreen • M: Sound
                        </div>
                    </div>

                    {/* CSS Animations */}
                    <style jsx>{`
                        @keyframes speedLine {
                            0% { transform: translateY(-100vh); opacity: 0; }
                            20% { opacity: 1; }
                            100% { transform: translateY(100vh); opacity: 0; }
                        }
                        
                        @keyframes fadeInOut {
                            0% { opacity: 0.3; }
                            100% { opacity: 0.8; }
                        }
                    `}</style>
                </div>
            </Dashboard>
        </>
    );
};

export default CarRacingGame;