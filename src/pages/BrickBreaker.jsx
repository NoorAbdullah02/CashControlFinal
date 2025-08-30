import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";



// You can replace these with regular div elements if you don't have lucide-react
const Play = ({ className, size }) => (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>▶</div>
);
const Pause = ({ className, size }) => (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>⏸</div>
);
const RotateCcw = ({ className, size }) => (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>↻</div>
);
const Trophy = ({ className, size }) => (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>🏆</div>
);

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

// Power-up types
const POWER_TYPES = {
    MULTI_BALL: { color: 'bg-yellow-400', icon: '●●●', effect: 'Multi Ball' },
    BIG_PADDLE: { color: 'bg-blue-400', icon: '━━━', effect: 'Big Paddle' },
    SLOW_BALL: { color: 'bg-green-400', icon: '◐', effect: 'Slow Ball' },
    EXTRA_LIFE: { color: 'bg-red-400', icon: '♥', effect: 'Extra Life' },
    LASER: { color: 'bg-purple-400', icon: '↑↑↑', effect: 'Laser Mode' }
};

const BrickBreaker = () => {
    useUser();
    const gameAreaRef = useRef(null);
    const animationFrameRef = useRef(null);
    const keysRef = useRef({ left: false, right: false, space: false });
    const lastTimeRef = useRef(0);
    const lastLaserTime = useRef(0);

    // Game state
    const [gameState, setGameState] = useState('menu');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(0);

    // Game objects
    const [paddle, setPaddle] = useState({ x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH });
    const [balls, setBalls] = useState([]);
    const [bricks, setBricks] = useState([]);
    const [powerUps, setPowerUps] = useState([]);
    const [particles, setParticles] = useState([]);
    const [lasers, setLasers] = useState([]);

    // Power-up states
    const [activePowerUps, setActivePowerUps] = useState({});
    const [powerUpTimers, setPowerUpTimers] = useState({});

    // Touch and responsive
    const [touchStartX, setTouchStartX] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [scale, setScale] = useState(1);

    // Initialize high score
    useEffect(() => {
        try {
            const saved = localStorage.getItem('brickBreakerHighScore');
            if (saved) setHighScore(parseInt(saved));
        } catch (e) {
            console.warn('localStorage not available');
        }
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Initialize bricks for level
    const initializeBricks = useCallback(() => {
        const newBricks = [];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                // Create patterns for higher levels
                if (level > 1 && (row + col) % 3 === 0 && Math.random() < 0.2) continue;

                newBricks.push({
                    id: `brick-${row}-${col}`,
                    x: col * (BRICK_WIDTH + 5) + 37.5,
                    y: row * (BRICK_HEIGHT + 5) + 80,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    color: colors[row],
                    hits: Math.min(Math.floor(level / 2) + 1, 3),
                    maxHits: Math.min(Math.floor(level / 2) + 1, 3),
                    powerUp: Math.random() < 0.12 ? Object.keys(POWER_TYPES)[Math.floor(Math.random() * 5)] : null
                });
            }
        }
        setBricks(newBricks);
    }, [level]);

    // Reset ball
    const resetBall = useCallback(() => {
        setBalls([{
            id: 'ball-main',
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 100,
            dx: (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2),
            dy: -(3 + Math.random() * 2),
            trail: []
        }]);
    }, []);

    // Reset game
    const resetGame = useCallback(() => {
        resetBall();
        setPaddle({ x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH });
        setPowerUps([]);
        setParticles([]);
        setLasers([]);
        setActivePowerUps({});
        setPowerUpTimers({});
        initializeBricks();
    }, [initializeBricks, resetBall]);

    // Start new game
    const startNewGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        setLives(3);
        resetGame();
        setGameState('playing');
    }, [resetGame]);

    // Create particles
    const createParticles = useCallback((x, y, color) => {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: `particle-${Date.now()}-${i}`,
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            dx: (Math.random() - 0.5) * 12,
            dy: (Math.random() - 0.5) * 12,
            life: 60,
            maxLife: 60,
            color: color || 'bg-yellow-400'
        }));

        setParticles(prev => [...prev.slice(-50), ...newParticles]);
    }, []);

    // Handle power-up effects
    const applyPowerUp = useCallback((type) => {
        const duration = 300; // 5 seconds at 60fps

        switch (type) {
            case 'MULTI_BALL':
                setBalls(prev => {
                    const newBalls = [];
                    prev.forEach(ball => {
                        newBalls.push(ball);
                        // Add two additional balls with different angles
                        for (let i = 0; i < 2; i++) {
                            const angle = (Math.PI / 4) * (i === 0 ? 1 : -1);
                            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                            newBalls.push({
                                ...ball,
                                id: `ball-multi-${Date.now()}-${i}`,
                                dx: Math.cos(angle) * speed,
                                dy: Math.sin(angle) * speed,
                                trail: []
                            });
                        }
                    });
                    return newBalls;
                });
                break;

            case 'BIG_PADDLE':
                setPaddle(prev => ({ ...prev, width: PADDLE_WIDTH * 1.6 }));
                setPowerUpTimers(prev => ({ ...prev, BIG_PADDLE: duration }));
                break;

            case 'SLOW_BALL':
                setBalls(prev => prev.map(ball => ({
                    ...ball,
                    dx: ball.dx * 0.6,
                    dy: ball.dy * 0.6
                })));
                setPowerUpTimers(prev => ({ ...prev, SLOW_BALL: duration }));
                break;

            case 'EXTRA_LIFE':
                setLives(prev => prev + 1);
                break;

            case 'LASER':
                setPowerUpTimers(prev => ({ ...prev, LASER: duration }));
                break;
        }

        setActivePowerUps(prev => ({ ...prev, [type]: true }));
    }, []);

    // Optimized collision detection
    const checkCollision = useCallback((ball, rect) => {
        const ballLeft = ball.x - BALL_SIZE / 2;
        const ballRight = ball.x + BALL_SIZE / 2;
        const ballTop = ball.y - BALL_SIZE / 2;
        const ballBottom = ball.y + BALL_SIZE / 2;

        return !(ballRight < rect.x ||
            ballLeft > rect.x + rect.width ||
            ballBottom < rect.y ||
            ballTop > rect.y + rect.height);
    }, []);

    // Get collision normal
    const getCollisionNormal = useCallback((ball, rect) => {
        const ballCenterX = ball.x;
        const ballCenterY = ball.y;
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;

        const deltaX = ballCenterX - rectCenterX;
        const deltaY = ballCenterY - rectCenterY;

        const overlapX = (rect.width / 2 + BALL_SIZE / 2) - Math.abs(deltaX);
        const overlapY = (rect.height / 2 + BALL_SIZE / 2) - Math.abs(deltaY);

        if (overlapX < overlapY) {
            return { x: Math.sign(deltaX), y: 0, axis: 'x' };
        } else {
            return { x: 0, y: Math.sign(deltaY), axis: 'y' };
        }
    }, []);

    // Main game loop with optimized performance
    const gameLoop = useCallback((currentTime) => {
        if (gameState !== 'playing') return;

        const deltaTime = Math.min(currentTime - lastTimeRef.current, 32); // Cap at ~30fps minimum
        lastTimeRef.current = currentTime;
        const timeScale = deltaTime / (1000 / FPS);

        // Update balls with smooth movement
        setBalls(prevBalls => {
            if (prevBalls.length === 0) return prevBalls;

            return prevBalls.map(ball => {
                let newX = ball.x + ball.dx * timeScale;
                let newY = ball.y + ball.dy * timeScale;
                let newDx = ball.dx;
                let newDy = ball.dy;

                // Wall collisions with proper bouncing
                if (newX <= BALL_SIZE / 2) {
                    newX = BALL_SIZE / 2;
                    newDx = Math.abs(newDx);
                } else if (newX >= GAME_WIDTH - BALL_SIZE / 2) {
                    newX = GAME_WIDTH - BALL_SIZE / 2;
                    newDx = -Math.abs(newDx);
                }

                if (newY <= BALL_SIZE / 2) {
                    newY = BALL_SIZE / 2;
                    newDy = Math.abs(newDy);
                }

                // Paddle collision with improved physics
                const paddleRect = { x: paddle.x, y: GAME_HEIGHT - 80, width: paddle.width, height: PADDLE_HEIGHT };

                if (newY + BALL_SIZE / 2 >= paddleRect.y &&
                    newY - BALL_SIZE / 2 <= paddleRect.y + paddleRect.height &&
                    newX + BALL_SIZE / 2 >= paddleRect.x &&
                    newX - BALL_SIZE / 2 <= paddleRect.x + paddleRect.width) {

                    // Calculate hit position for spin effect
                    const hitPosition = (newX - paddleRect.x) / paddleRect.width;
                    const spin = (hitPosition - 0.5) * 8; // -4 to 4 spin factor

                    newDy = -Math.abs(newDy);
                    newDx = ball.dx * 0.8 + spin;
                    newY = paddleRect.y - BALL_SIZE / 2;

                    // Ensure reasonable speed
                    const speed = Math.sqrt(newDx * newDx + newDy * newDy);
                    if (speed < 4) {
                        const factor = 4 / speed;
                        newDx *= factor;
                        newDy *= factor;
                    } else if (speed > 12) {
                        const factor = 12 / speed;
                        newDx *= factor;
                        newDy *= factor;
                    }
                }

                // Update trail
                const newTrail = [...(ball.trail || [])];
                newTrail.push({ x: ball.x, y: ball.y });
                if (newTrail.length > 8) newTrail.shift();

                return {
                    ...ball,
                    x: newX,
                    y: newY,
                    dx: newDx,
                    dy: newDy,
                    trail: newTrail
                };
            }).filter(ball => ball.y < GAME_HEIGHT + 100);
        });

        // Update paddle movement
        if (keysRef.current.left && paddle.x > 0) {
            setPaddle(prev => ({ ...prev, x: Math.max(0, prev.x - 10 * timeScale) }));
        }
        if (keysRef.current.right && paddle.x < GAME_WIDTH - paddle.width) {
            setPaddle(prev => ({ ...prev, x: Math.min(GAME_WIDTH - prev.width, prev.x + 10 * timeScale) }));
        }

        // Fire lasers
        if (keysRef.current.space && activePowerUps.LASER && currentTime - lastLaserTime.current > 150) {
            setLasers(prev => [...prev, {
                id: `laser-${currentTime}`,
                x: paddle.x + paddle.width / 2,
                y: GAME_HEIGHT - 90
            }]);
            lastLaserTime.current = currentTime;
        }

        // Update other game objects
        setLasers(prev => prev.map(laser => ({ ...laser, y: laser.y - 15 * timeScale })).filter(laser => laser.y > 0));
        setPowerUps(prev => prev.map(powerUp => ({ ...powerUp, y: powerUp.y + 3 * timeScale })).filter(powerUp => powerUp.y < GAME_HEIGHT));
        setParticles(prev => prev.map(particle => ({
            ...particle,
            x: particle.x + particle.dx * timeScale * 0.5,
            y: particle.y + particle.dy * timeScale * 0.5,
            dx: particle.dx * 0.99,
            dy: particle.dy * 0.99,
            life: particle.life - timeScale
        })).filter(particle => particle.life > 0));

        // Update power-up timers
        setPowerUpTimers(prev => {
            const newTimers = { ...prev };
            let hasChanges = false;

            Object.keys(newTimers).forEach(key => {
                newTimers[key] -= timeScale;
                if (newTimers[key] <= 0) {
                    delete newTimers[key];
                    hasChanges = true;

                    // Reset effects
                    if (key === 'BIG_PADDLE') {
                        setPaddle(p => ({ ...p, width: PADDLE_WIDTH }));
                    } else if (key === 'SLOW_BALL') {
                        setBalls(b => b.map(ball => ({ ...ball, dx: ball.dx / 0.6, dy: ball.dy / 0.6 })));
                    }

                    setActivePowerUps(ap => {
                        const newAp = { ...ap };
                        delete newAp[key];
                        return newAp;
                    });
                }
            });

            return hasChanges ? newTimers : prev;
        });

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, paddle.x, paddle.width, activePowerUps]);

    // Handle collisions in separate optimized loop
    useEffect(() => {
        if (gameState !== 'playing' || balls.length === 0 || bricks.length === 0) return;

        let scoreToAdd = 0;
        const bricksToRemove = new Set();
        const newPowerUps = [];

        // Process ball-brick collisions
        setBalls(currentBalls => {
            return currentBalls.map(ball => {
                let newBall = { ...ball };
                let hasCollision = false;

                for (let i = 0; i < bricks.length && !hasCollision; i++) {
                    const brick = bricks[i];
                    if (bricksToRemove.has(brick.id)) continue;

                    if (checkCollision(newBall, brick)) {
                        const normal = getCollisionNormal(newBall, brick);

                        // Apply collision response
                        if (normal.axis === 'x') {
                            newBall.dx = -newBall.dx;
                            newBall.x = normal.x > 0 ? brick.x + brick.width + BALL_SIZE / 2 : brick.x - BALL_SIZE / 2;
                        } else {
                            newBall.dy = -newBall.dy;
                            newBall.y = normal.y > 0 ? brick.y + brick.height + BALL_SIZE / 2 : brick.y - BALL_SIZE / 2;
                        }

                        // Damage brick
                        brick.hits--;
                        scoreToAdd += 10 * level;

                        if (brick.hits <= 0) {
                            bricksToRemove.add(brick.id);
                            createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                            scoreToAdd += 50 * level;

                            if (brick.powerUp) {
                                newPowerUps.push({
                                    id: `powerup-${Date.now()}-${Math.random()}`,
                                    type: brick.powerUp,
                                    x: brick.x + brick.width / 2,
                                    y: brick.y + brick.height / 2
                                });
                            }
                        }

                        hasCollision = true;
                    }
                }

                return newBall;
            });
        });

        // Process laser-brick collisions
        setLasers(currentLasers => {
            return currentLasers.filter(laser => {
                for (const brick of bricks) {
                    if (bricksToRemove.has(brick.id)) continue;

                    if (laser.x >= brick.x && laser.x <= brick.x + brick.width &&
                        laser.y >= brick.y && laser.y <= brick.y + brick.height) {

                        brick.hits--;
                        scoreToAdd += 15 * level;

                        if (brick.hits <= 0) {
                            bricksToRemove.add(brick.id);
                            createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                            scoreToAdd += 75 * level;
                        }

                        return false; // Remove laser
                    }
                }
                return true;
            });
        });

        // Update bricks and score
        if (bricksToRemove.size > 0) {
            setBricks(prev => prev.filter(brick => !bricksToRemove.has(brick.id)));
        }

        if (newPowerUps.length > 0) {
            setPowerUps(prev => [...prev, ...newPowerUps]);
        }

        if (scoreToAdd > 0) {
            setScore(prev => prev + scoreToAdd);
        }

        // Check power-up collection
        setPowerUps(prevPowerUps => {
            return prevPowerUps.filter(powerUp => {
                const collected = powerUp.x >= paddle.x - 20 &&
                    powerUp.x <= paddle.x + paddle.width + 20 &&
                    powerUp.y >= GAME_HEIGHT - 100 &&
                    powerUp.y <= GAME_HEIGHT - 60;

                if (collected) {
                    applyPowerUp(powerUp.type);
                    return false;
                }
                return true;
            });
        });

    }, [balls, bricks, lasers, paddle.x, paddle.width, gameState, level, checkCollision, getCollisionNormal, createParticles, applyPowerUp]);

    // Game state management
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (balls.length === 0) {
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameState('gameOver');
                    if (score > highScore) {
                        setHighScore(score);
                        try {
                            localStorage.setItem('brickBreakerHighScore', score.toString());
                        } catch (e) {
                            console.warn('Could not save high score');
                        }
                    }
                    return newLives;
                } else {
                    // Reset ball after a short delay
                    setTimeout(() => {
                        if (gameState === 'playing') {
                            resetBall();
                        }
                    }, 1000);
                    return newLives;
                }
            });
        }

        // Check level completion
        if (bricks.length === 0) {
            setGameState('levelComplete');
            setScore(prev => prev + 1000 * level); // Level bonus
            setTimeout(() => {
                setLevel(prev => prev + 1);
                resetGame();
                setGameState('playing');
            }, 2000);
        }

    }, [balls.length, bricks.length, gameState, score, highScore, level, resetBall, resetGame]);

    // Game loop management
    useEffect(() => {
        if (gameState === 'playing') {
            lastTimeRef.current = performance.now();
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState, gameLoop]);

    // Initialize game
    useEffect(() => {
        initializeBricks();
    }, [initializeBricks]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat) return;

            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    keysRef.current.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keysRef.current.right = true;
                    e.preventDefault();
                    break;
                case 'Space':
                    keysRef.current.space = true;
                    e.preventDefault();
                    break;
                case 'KeyP':
                    if (gameState === 'playing') setGameState('paused');
                    else if (gameState === 'paused') setGameState('playing');
                    e.preventDefault();
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    keysRef.current.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keysRef.current.right = false;
                    break;
                case 'Space':
                    keysRef.current.space = false;
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

    // Touch controls
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        setTouchStartX(touch.clientX);
        e.preventDefault();
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (touchStartX === null || !gameAreaRef.current) return;

        const touch = e.touches[0];
        const rect = gameAreaRef.current.getBoundingClientRect();
        const relativeX = (touch.clientX - rect.left) / scale;
        const paddleX = Math.max(0, Math.min(GAME_WIDTH - paddle.width, relativeX - paddle.width / 2));

        setPaddle(prev => ({ ...prev, x: paddleX }));
        e.preventDefault();
    }, [touchStartX, scale, paddle.width]);

    const handleTouchEnd = useCallback(() => {
        setTouchStartX(null);
    }, []);

    // Responsive scaling
    useEffect(() => {
        const updateScale = () => {
            if (gameAreaRef.current?.parentElement) {
                const container = gameAreaRef.current.parentElement;
                const containerWidth = container.clientWidth - 32; // padding
                const containerHeight = window.innerHeight - 200; // header + controls

                const scaleX = containerWidth / GAME_WIDTH;
                const scaleY = containerHeight / GAME_HEIGHT;
                const newScale = Math.min(scaleX, scaleY, 1);

                setScale(newScale);
            }
            setIsMobile(window.innerWidth < 768);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Memoize active bricks count for performance
    const activeBricksCount = useMemo(() => bricks.length, [bricks]);

    return (
        <Dashboard activeMenu="Brik Breaker Game">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col items-center justify-center p-4">
                {/* Header */}
                <div className="w-full max-w-4xl mb-4 flex flex-wrap justify-between items-center text-sm md:text-base gap-2">
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <span className="font-mono">{score.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-300">Best: {highScore.toLocaleString()}</div>
                        <div className="text-cyan-400">Level {level}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span>Lives:</span>
                            {Array.from({ length: lives }, (_, i) => (
                                <span key={i} className="text-red-400 text-lg">♥</span>
                            ))}
                        </div>
                        {Object.keys(activePowerUps).length > 0 && (
                            <div className="flex gap-1">
                                {Object.keys(activePowerUps).map(type => (
                                    <div key={type} className={`px-2 py-1 rounded text-xs ${POWER_TYPES[type].color} text-black font-bold animate-pulse`}>
                                        {POWER_TYPES[type].icon}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Game Area */}
                <div className="relative">
                    <div
                        ref={gameAreaRef}
                        className="relative bg-gradient-to-b from-gray-900 to-black border-4 border-cyan-400 shadow-2xl shadow-cyan-400/25 overflow-hidden"
                        style={{
                            width: GAME_WIDTH * scale,
                            height: GAME_HEIGHT * scale,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Background grid effect */}
                        <div className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                            }} />

                        {gameState === 'playing' && (
                            <>
                                {/* Bricks */}
                                {bricks.map((brick) => (
                                    <div
                                        key={brick.id}
                                        className={`absolute ${brick.color} rounded-sm shadow-lg transition-all duration-200 border border-white/20`}
                                        style={{
                                            left: brick.x,
                                            top: brick.y,
                                            width: brick.width,
                                            height: brick.height,
                                            opacity: Math.max(0.4, brick.hits / brick.maxHits),
                                            boxShadow: brick.hits > 1 ? `0 0 ${brick.hits * 5}px rgba(255,255,255,0.3)` : 'none',
                                            transform: `scale(${0.8 + (brick.hits / brick.maxHits) * 0.2})`
                                        }}
                                    >
                                        {brick.powerUp && (
                                            <div className={`absolute inset-0 ${POWER_TYPES[brick.powerUp].color} opacity-40 animate-pulse rounded-sm`} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-sm" />
                                    </div>
                                ))}

                                {/* Balls */}
                                {balls.map((ball) => (
                                    <div key={ball.id}>
                                        {/* Ball trail */}
                                        {ball.trail?.map((pos, i) => (
                                            <div
                                                key={i}
                                                className="absolute bg-cyan-400/40 rounded-full"
                                                style={{
                                                    left: pos.x - (BALL_SIZE * (i + 1)) / (ball.trail.length * 4),
                                                    top: pos.y - (BALL_SIZE * (i + 1)) / (ball.trail.length * 4),
                                                    width: (BALL_SIZE * (i + 1)) / ball.trail.length,
                                                    height: (BALL_SIZE * (i + 1)) / ball.trail.length,
                                                    opacity: (i + 1) / ball.trail.length * 0.6
                                                }}
                                            />
                                        ))}
                                        {/* Ball */}
                                        <div
                                            className="absolute bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600 rounded-full shadow-lg animate-pulse"
                                            style={{
                                                left: ball.x - BALL_SIZE / 2,
                                                top: ball.y - BALL_SIZE / 2,
                                                width: BALL_SIZE,
                                                height: BALL_SIZE,
                                                boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), inset 0 0 5px rgba(255, 255, 255, 0.3)'
                                            }}
                                        />
                                    </div>
                                ))}

                                {/* Paddle */}
                                <div
                                    className="absolute bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-lg shadow-lg transition-all duration-150"
                                    style={{
                                        left: paddle.x,
                                        top: GAME_HEIGHT - 80,
                                        width: paddle.width,
                                        height: PADDLE_HEIGHT,
                                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-lg" />
                                </div>

                                {/* Power-ups */}
                                {powerUps.map((powerUp) => (
                                    <div
                                        key={powerUp.id}
                                        className={`absolute ${POWER_TYPES[powerUp.type].color} text-black font-bold text-xs flex items-center justify-center rounded-full shadow-lg animate-bounce border-2 border-white/50`}
                                        style={{
                                            left: powerUp.x - 18,
                                            top: powerUp.y - 18,
                                            width: 36,
                                            height: 36,
                                            animation: 'bounce 1s infinite, pulse 2s infinite'
                                        }}
                                    >
                                        {POWER_TYPES[powerUp.type].icon}
                                    </div>
                                ))}

                                {/* Lasers */}
                                {lasers.map((laser) => (
                                    <div
                                        key={laser.id}
                                        className="absolute bg-gradient-to-t from-red-400 to-red-600 shadow-lg rounded-full"
                                        style={{
                                            left: laser.x - 2,
                                            top: laser.y,
                                            width: 4,
                                            height: 24,
                                            boxShadow: '0 0 10px rgba(248, 113, 113, 0.8)'
                                        }}
                                    />
                                ))}

                                {/* Particles */}
                                {particles.map((particle) => (
                                    <div
                                        key={particle.id}
                                        className={`absolute ${particle.color} rounded-full`}
                                        style={{
                                            left: particle.x,
                                            top: particle.y,
                                            width: 6,
                                            height: 6,
                                            opacity: particle.life / particle.maxLife,
                                            transform: `scale(${particle.life / particle.maxLife})`
                                        }}
                                    />
                                ))}

                                {/* Game info overlay */}
                                <div className="absolute top-4 left-4 text-xs text-cyan-400/60">
                                    Bricks: {activeBricksCount}
                                </div>
                                <div className="absolute top-4 right-4 text-xs text-cyan-400/60">
                                    Balls: {balls.length}
                                </div>
                            </>
                        )}

                        {/* Menu Screen */}
                        {gameState === 'menu' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/85 to-black/95 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
                                        BRICK BREAKER
                                    </h1>
                                    <div className="mb-8 text-gray-300 space-y-3 text-lg">
                                        <p>🎮 Use ←→ or A/D keys to move paddle</p>
                                        <p>🚀 SPACE to fire lasers (with power-up)</p>
                                        <p>⏸️ Press P to pause/unpause game</p>
                                        {isMobile && <p className="text-yellow-400">📱 Touch and drag to move paddle</p>}
                                    </div>
                                    <button
                                        onClick={startNewGame}
                                        className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 px-12 py-6 rounded-xl font-bold text-2xl transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-cyan-500/30 border-2 border-cyan-300/40 animate-pulse"
                                        style={{
                                            textShadow: '0 0 20px rgba(34, 211, 238, 0.8)',
                                            boxShadow: '0 0 30px rgba(34, 211, 238, 0.4), 0 0 60px rgba(34, 211, 238, 0.2)'
                                        }}
                                    >
                                        <Play className="inline mr-3" size={32} />
                                        START GAME
                                    </button>
                                    <div className="mt-6 text-sm text-gray-500">
                                        High Score: {highScore.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pause Screen */}
                        {gameState === 'paused' && (
                            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center">
                                    <Pause className="w-20 h-20 mx-auto mb-6 text-cyan-400 animate-pulse" />
                                    <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        PAUSED
                                    </h2>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setGameState('playing')}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg block mx-auto"
                                        >
                                            RESUME GAME
                                        </button>
                                        <button
                                            onClick={() => setGameState('menu')}
                                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg block mx-auto"
                                        >
                                            MAIN MENU
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Game Over Screen */}
                        {gameState === 'gameOver' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center p-8">
                                    <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                        GAME OVER
                                    </h2>
                                    <div className="mb-8 space-y-3">
                                        <p className="text-4xl font-bold text-white">Score: {score.toLocaleString()}</p>
                                        <p className="text-2xl text-gray-300">Level Reached: {level}</p>
                                        <p className="text-lg text-gray-400">Bricks Destroyed: {(level - 1) * 60 + (60 - activeBricksCount)}</p>
                                    </div>
                                    {score > highScore && (
                                        <div className="mb-8">
                                            <p className="text-yellow-400 text-3xl font-bold animate-bounce">
                                                🏆 NEW HIGH SCORE! 🏆
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={startNewGame}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-10 py-5 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <RotateCcw className="inline mr-2" size={24} />
                                            PLAY AGAIN
                                        </button>
                                        <button
                                            onClick={() => setGameState('menu')}
                                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-10 py-5 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            MAIN MENU
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Level Complete Screen */}
                        {gameState === 'levelComplete' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center p-8">
                                    <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400 animate-bounce" />
                                    <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        LEVEL COMPLETE!
                                    </h2>
                                    <div className="mb-6 space-y-2">
                                        <p className="text-3xl text-white font-bold">Level {level - 1} Cleared!</p>
                                        <p className="text-xl text-gray-300">Bonus: +{1000 * (level - 1)} points</p>
                                        <p className="text-lg text-green-300">Score: {score.toLocaleString()}</p>
                                    </div>
                                    <p className="text-2xl text-yellow-400 animate-pulse">
                                        🚀 Advancing to Level {level}...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Controls Info */}
                {isMobile && gameState === 'playing' && (
                    <div className="mt-4 text-center text-sm text-gray-400">
                        <p>📱 Touch and drag horizontally to control paddle</p>
                    </div>
                )}

                {/* Power-up Legend */}
                <div className="mt-6 max-w-4xl w-full">
                    <h3 className="text-center text-lg font-bold mb-3 text-cyan-400">Power-ups Guide</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                        {Object.entries(POWER_TYPES).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                                <div className={`w-8 h-8 ${value.color} rounded-full flex items-center justify-center text-black font-bold text-xs border-2 border-white/30 shadow-lg`}>
                                    {value.icon}
                                </div>
                                <span className="text-gray-300 font-medium">{value.effect}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Game Stats Footer */}
                <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
                    <p>{isMobile ? '📱 Mobile Mode' : '💻 Desktop Mode'} • Scale: {(scale * 100).toFixed(0)}% • FPS: {FPS}</p>
                    <p>Made with React & Tailwind CSS • Optimized for Performance</p>
                </div>
            </div>
        </Dashboard>
    );
};

export default BrickBreaker;