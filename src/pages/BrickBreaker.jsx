import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";

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
    const gameStateRef = useRef({});
    const lastTimeRef = useRef(0);
    const lastLaserTime = useRef(0);

    // Game state
    const [gameState, setGameState] = useState('menu');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(0);
    const [gameObjects, setGameObjects] = useState({
        paddle: { x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH },
        balls: [],
        bricks: [],
        powerUps: [],
        particles: [],
        lasers: [],
        activePowerUps: {},
        powerUpTimers: {}
    });

    // Mobile and responsive
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // Input handling
    const keys = useRef({ left: false, right: false, space: false });
    const touchStart = useRef(null);
    const paddleTarget = useRef(gameObjects.paddle.x);

    // Initialize high score
    useEffect(() => {
        const saved = localStorage.getItem('brickBreakerHighScore');
        if (saved) setHighScore(parseInt(saved));
        setIsMobile('ontouchstart' in window);
    }, []);

    // Optimized brick initialization
    const initializeBricks = useCallback(() => {
        const newBricks = [];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                if (level > 1 && (row + col) % 3 === 0 && Math.random() < 0.15) continue;

                newBricks.push({
                    id: `${row}-${col}`,
                    x: col * (BRICK_WIDTH + 5) + 37.5,
                    y: row * (BRICK_HEIGHT + 5) + 80,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    color: colors[row],
                    hits: Math.min(Math.floor(level / 2) + 1, 3),
                    maxHits: Math.min(Math.floor(level / 2) + 1, 3),
                    powerUp: Math.random() < 0.1 ? Object.keys(POWER_TYPES)[Math.floor(Math.random() * 5)] : null
                });
            }
        }
        return newBricks;
    }, [level]);

    // Reset ball
    const resetBall = useCallback(() => {
        return [{
            id: 'main',
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 100,
            dx: (Math.random() > 0.5 ? 1 : -1) * 4,
            dy: -4,
            trail: []
        }];
    }, []);

    // Game initialization
    const resetGame = useCallback(() => {
        setGameObjects({
            paddle: { x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH },
            balls: resetBall(),
            bricks: initializeBricks(),
            powerUps: [],
            particles: [],
            lasers: [],
            activePowerUps: {},
            powerUpTimers: {}
        });
        paddleTarget.current = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    }, [initializeBricks, resetBall]);

    // Start new game
    const startNewGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        setLives(3);
        resetGame();
        setGameState('playing');
    }, [resetGame]);

    // Collision detection with spatial optimization
    const checkCollision = useCallback((ball, rect) => {
        const dx = Math.abs(ball.x - (rect.x + rect.width / 2));
        const dy = Math.abs(ball.y - (rect.y + rect.height / 2));

        return dx <= (rect.width / 2 + BALL_SIZE / 2) &&
            dy <= (rect.height / 2 + BALL_SIZE / 2);
    }, []);

    // Get collision normal
    const getCollisionNormal = useCallback((ball, rect) => {
        const deltaX = ball.x - (rect.x + rect.width / 2);
        const deltaY = ball.y - (rect.y + rect.height / 2);
        const overlapX = (rect.width / 2 + BALL_SIZE / 2) - Math.abs(deltaX);
        const overlapY = (rect.height / 2 + BALL_SIZE / 2) - Math.abs(deltaY);

        return overlapX < overlapY
            ? { x: Math.sign(deltaX), y: 0, axis: 'x' }
            : { x: 0, y: Math.sign(deltaY), axis: 'y' };
    }, []);

    // Apply power-up effects
    const applyPowerUp = useCallback((type, currentObjects) => {
        const duration = 300;
        let newObjects = { ...currentObjects };

        switch (type) {
            case 'MULTI_BALL':
                const newBalls = [];
                currentObjects.balls.forEach(ball => {
                    newBalls.push(ball);
                    for (let i = 0; i < 2; i++) {
                        const angle = (Math.PI / 4) * (i === 0 ? 1 : -1);
                        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                        newBalls.push({
                            ...ball,
                            id: `multi-${Date.now()}-${i}`,
                            dx: Math.cos(angle) * speed,
                            dy: Math.sin(angle) * speed,
                            trail: []
                        });
                    }
                });
                newObjects.balls = newBalls;
                break;

            case 'BIG_PADDLE':
                newObjects.paddle = { ...newObjects.paddle, width: PADDLE_WIDTH * 1.6 };
                newObjects.powerUpTimers = { ...newObjects.powerUpTimers, BIG_PADDLE: duration };
                break;

            case 'SLOW_BALL':
                newObjects.balls = newObjects.balls.map(ball => ({
                    ...ball,
                    dx: ball.dx * 0.6,
                    dy: ball.dy * 0.6
                }));
                newObjects.powerUpTimers = { ...newObjects.powerUpTimers, SLOW_BALL: duration };
                break;

            case 'EXTRA_LIFE':
                setLives(prev => prev + 1);
                break;

            case 'LASER':
                newObjects.powerUpTimers = { ...newObjects.powerUpTimers, LASER: duration };
                break;
        }

        newObjects.activePowerUps = { ...newObjects.activePowerUps, [type]: true };
        return newObjects;
    }, []);

    // Main game loop - heavily optimized
    const gameLoop = useCallback((currentTime) => {
        if (gameStateRef.current.state !== 'playing') return;

        const deltaTime = Math.min(currentTime - lastTimeRef.current, 32);
        lastTimeRef.current = currentTime;
        const timeScale = deltaTime / (1000 / FPS);

        setGameObjects(prevObjects => {
            let newObjects = { ...prevObjects };
            let scoreToAdd = 0;
            const bricksToRemove = new Set();
            const newPowerUps = [];

            // Update paddle with smooth interpolation
            const targetX = paddleTarget.current;
            const currentX = newObjects.paddle.x;
            const paddleSpeed = isMobile ? 12 : 10;
            const newPaddleX = Math.abs(targetX - currentX) < 1
                ? targetX
                : currentX + Math.sign(targetX - currentX) * paddleSpeed * timeScale;

            newObjects.paddle = {
                ...newObjects.paddle,
                x: Math.max(0, Math.min(GAME_WIDTH - newObjects.paddle.width, newPaddleX))
            };

            // Update balls
            newObjects.balls = newObjects.balls.map(ball => {
                let newBall = { ...ball };
                newBall.x += newBall.dx * timeScale;
                newBall.y += newBall.dy * timeScale;

                // Wall collisions
                if (newBall.x <= BALL_SIZE / 2) {
                    newBall.x = BALL_SIZE / 2;
                    newBall.dx = Math.abs(newBall.dx);
                } else if (newBall.x >= GAME_WIDTH - BALL_SIZE / 2) {
                    newBall.x = GAME_WIDTH - BALL_SIZE / 2;
                    newBall.dx = -Math.abs(newBall.dx);
                }

                if (newBall.y <= BALL_SIZE / 2) {
                    newBall.y = BALL_SIZE / 2;
                    newBall.dy = Math.abs(newBall.dy);
                }

                // Paddle collision
                const paddleRect = {
                    x: newObjects.paddle.x,
                    y: GAME_HEIGHT - 80,
                    width: newObjects.paddle.width,
                    height: PADDLE_HEIGHT
                };

                if (checkCollision(newBall, paddleRect) && newBall.dy > 0) {
                    const hitPosition = (newBall.x - paddleRect.x) / paddleRect.width;
                    const spin = (hitPosition - 0.5) * 6;

                    newBall.dy = -Math.abs(newBall.dy);
                    newBall.dx = newBall.dx * 0.9 + spin;
                    newBall.y = paddleRect.y - BALL_SIZE / 2;

                    // Speed normalization
                    const speed = Math.sqrt(newBall.dx * newBall.dx + newBall.dy * newBall.dy);
                    if (speed < 3) {
                        newBall.dx *= 3 / speed;
                        newBall.dy *= 3 / speed;
                    } else if (speed > 10) {
                        newBall.dx *= 10 / speed;
                        newBall.dy *= 10 / speed;
                    }
                }

                // Brick collisions - optimized
                for (const brick of newObjects.bricks) {
                    if (bricksToRemove.has(brick.id)) continue;

                    if (checkCollision(newBall, brick)) {
                        const normal = getCollisionNormal(newBall, brick);

                        if (normal.axis === 'x') {
                            newBall.dx = -newBall.dx;
                        } else {
                            newBall.dy = -newBall.dy;
                        }

                        brick.hits--;
                        scoreToAdd += 10 * level;

                        if (brick.hits <= 0) {
                            bricksToRemove.add(brick.id);
                            scoreToAdd += 50 * level;

                            if (brick.powerUp) {
                                newPowerUps.push({
                                    id: `powerup-${Date.now()}-${Math.random()}`,
                                    type: brick.powerUp,
                                    x: brick.x + brick.width / 2,
                                    y: brick.y + brick.height / 2
                                });
                            }

                            // Add particles
                            const newParticles = Array.from({ length: 6 }, (_, i) => ({
                                id: `particle-${Date.now()}-${i}`,
                                x: brick.x + brick.width / 2,
                                y: brick.y + brick.height / 2,
                                dx: (Math.random() - 0.5) * 8,
                                dy: (Math.random() - 0.5) * 8,
                                life: 30,
                                color: brick.color
                            }));
                            newObjects.particles = [...newObjects.particles.slice(-20), ...newParticles];
                        }
                        break; // Only one collision per ball per frame
                    }
                }

                // Update trail
                newBall.trail = [...(ball.trail || []).slice(-5), { x: ball.x, y: ball.y }];

                return newBall;
            }).filter(ball => ball.y < GAME_HEIGHT + 50);

            // Keyboard movement
            if (keys.current.left) {
                paddleTarget.current = Math.max(0, paddleTarget.current - 8 * timeScale);
            }
            if (keys.current.right) {
                paddleTarget.current = Math.min(GAME_WIDTH - newObjects.paddle.width,
                    paddleTarget.current + 8 * timeScale);
            }

            // Fire lasers
            if (keys.current.space && newObjects.activePowerUps.LASER &&
                currentTime - lastLaserTime.current > 200) {
                newObjects.lasers = [...newObjects.lasers, {
                    id: `laser-${currentTime}`,
                    x: newObjects.paddle.x + newObjects.paddle.width / 2,
                    y: GAME_HEIGHT - 90
                }];
                lastLaserTime.current = currentTime;
            }

            // Update lasers and check brick collisions
            newObjects.lasers = newObjects.lasers.map(laser => ({
                ...laser,
                y: laser.y - 12 * timeScale
            })).filter(laser => {
                if (laser.y < 0) return false;

                // Check laser-brick collision
                for (const brick of newObjects.bricks) {
                    if (bricksToRemove.has(brick.id)) continue;

                    if (laser.x >= brick.x && laser.x <= brick.x + brick.width &&
                        laser.y >= brick.y && laser.y <= brick.y + brick.height) {

                        brick.hits--;
                        scoreToAdd += 15 * level;

                        if (brick.hits <= 0) {
                            bricksToRemove.add(brick.id);
                            scoreToAdd += 75 * level;
                        }
                        return false;
                    }
                }
                return true;
            });

            // Update power-ups
            newObjects.powerUps = [...newObjects.powerUps, ...newPowerUps].map(powerUp => ({
                ...powerUp,
                y: powerUp.y + 2 * timeScale
            })).filter(powerUp => {
                if (powerUp.y > GAME_HEIGHT) return false;

                // Check collection
                const collected = powerUp.x >= newObjects.paddle.x - 15 &&
                    powerUp.x <= newObjects.paddle.x + newObjects.paddle.width + 15 &&
                    powerUp.y >= GAME_HEIGHT - 100;

                if (collected) {
                    newObjects = applyPowerUp(powerUp.type, newObjects);
                    return false;
                }
                return true;
            });

            // Update particles
            newObjects.particles = newObjects.particles.map(particle => ({
                ...particle,
                x: particle.x + particle.dx * timeScale * 0.3,
                y: particle.y + particle.dy * timeScale * 0.3,
                dx: particle.dx * 0.98,
                dy: particle.dy * 0.98,
                life: particle.life - timeScale
            })).filter(particle => particle.life > 0);

            // Update power-up timers
            const newTimers = { ...newObjects.powerUpTimers };
            Object.keys(newTimers).forEach(key => {
                newTimers[key] -= timeScale;
                if (newTimers[key] <= 0) {
                    delete newTimers[key];

                    // Reset effects
                    if (key === 'BIG_PADDLE') {
                        newObjects.paddle.width = PADDLE_WIDTH;
                    } else if (key === 'SLOW_BALL') {
                        newObjects.balls = newObjects.balls.map(ball => ({
                            ...ball,
                            dx: ball.dx / 0.6,
                            dy: ball.dy / 0.6
                        }));
                    }

                    const newActivePowerUps = { ...newObjects.activePowerUps };
                    delete newActivePowerUps[key];
                    newObjects.activePowerUps = newActivePowerUps;
                }
            });
            newObjects.powerUpTimers = newTimers;

            // Remove destroyed bricks
            if (bricksToRemove.size > 0) {
                newObjects.bricks = newObjects.bricks.filter(brick => !bricksToRemove.has(brick.id));
            }

            // Update score
            if (scoreToAdd > 0) {
                setScore(prev => prev + scoreToAdd);
            }

            return newObjects;
        });

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [checkCollision, getCollisionNormal, applyPowerUp, level, isMobile]);

    // Update game state ref
    useEffect(() => {
        gameStateRef.current = { state: gameState };
    }, [gameState]);

    // Game state management
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (gameObjects.balls.length === 0) {
            const newLives = lives - 1;
            if (newLives <= 0) {
                setGameState('gameOver');
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem('brickBreakerHighScore', score.toString());
                }
            } else {
                setLives(newLives);
                setTimeout(() => {
                    if (gameStateRef.current.state === 'playing') {
                        setGameObjects(prev => ({ ...prev, balls: resetBall() }));
                    }
                }, 1000);
            }
        }

        if (gameObjects.bricks.length === 0) {
            setGameState('levelComplete');
            setScore(prev => prev + 1000 * level);
            setTimeout(() => {
                setLevel(prev => prev + 1);
                resetGame();
                setGameState('playing');
            }, 2000);
        }
    }, [gameObjects.balls.length, gameObjects.bricks.length, gameState, score, highScore, level, lives, resetBall, resetGame]);

    // Start/stop game loop
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
                    setGameState(prev => prev === 'playing' ? 'paused' :
                        prev === 'paused' ? 'playing' : prev);
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
    }, []);

    // Touch controls - optimized for mobile
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        touchStart.current = touch.clientX;
        e.preventDefault();
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!gameAreaRef.current || touchStart.current === null) return;

        const touch = e.touches[0];
        const rect = gameAreaRef.current.getBoundingClientRect();
        const relativeX = (touch.clientX - rect.left) / scale;
        paddleTarget.current = Math.max(0, Math.min(GAME_WIDTH - gameObjects.paddle.width,
            relativeX - gameObjects.paddle.width / 2));
        e.preventDefault();
    }, [scale, gameObjects.paddle.width]);

    const handleTouchEnd = useCallback(() => {
        touchStart.current = null;
    }, []);

    // Responsive scaling
    useEffect(() => {
        const updateScale = () => {
            const containerWidth = Math.min(window.innerWidth - 32, 900);
            const containerHeight = window.innerHeight - 200;
            const scaleX = containerWidth / GAME_WIDTH;
            const scaleY = containerHeight / GAME_HEIGHT;
            setScale(Math.min(scaleX, scaleY, 1));
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Initialize game
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const activeBricksCount = gameObjects.bricks.length;

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
                        {Object.keys(gameObjects.activePowerUps).length > 0 && (
                            <div className="flex gap-1">
                                {Object.keys(gameObjects.activePowerUps).map(type => (
                                    <div key={type} className={`px-2 py-1 rounded text-xs ${POWER_TYPES[type].color} text-black font-bold`}>
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
                        className="relative bg-gradient-to-b from-gray-900 to-black border-4 border-cyan-400 shadow-2xl shadow-cyan-400/25 overflow-hidden select-none"
                        style={{
                            width: GAME_WIDTH * scale,
                            height: GAME_HEIGHT * scale
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Background grid */}
                        <div className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                            }} />

                        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                            {gameState === 'playing' && (
                                <>
                                    {/* Bricks */}
                                    {gameObjects.bricks.map((brick) => (
                                        <div
                                            key={brick.id}
                                            className={`absolute ${brick.color} rounded-sm shadow-lg border border-white/20`}
                                            style={{
                                                left: brick.x,
                                                top: brick.y,
                                                width: brick.width,
                                                height: brick.height,
                                                opacity: Math.max(0.5, brick.hits / brick.maxHits),
                                                transform: `scale(${0.85 + (brick.hits / brick.maxHits) * 0.15})`
                                            }}
                                        >
                                            {brick.powerUp && (
                                                <div className={`absolute inset-0 ${POWER_TYPES[brick.powerUp].color} opacity-40 rounded-sm animate-pulse`} />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-sm" />
                                        </div>
                                    ))}

                                    {/* Balls */}
                                    {gameObjects.balls.map((ball) => (
                                        <div key={ball.id}>
                                            {/* Ball trail */}
                                            {ball.trail?.map((pos, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute bg-cyan-400/30 rounded-full"
                                                    style={{
                                                        left: pos.x - (BALL_SIZE * (i + 1)) / (ball.trail.length * 4),
                                                        top: pos.y - (BALL_SIZE * (i + 1)) / (ball.trail.length * 4),
                                                        width: (BALL_SIZE * (i + 1)) / ball.trail.length,
                                                        height: (BALL_SIZE * (i + 1)) / ball.trail.length,
                                                        opacity: (i + 1) / ball.trail.length * 0.5
                                                    }}
                                                />
                                            ))}
                                            {/* Ball */}
                                            <div
                                                className="absolute bg-gradient-radial from-cyan-300 via-cyan-400 to-cyan-600 rounded-full shadow-lg"
                                                style={{
                                                    left: ball.x - BALL_SIZE / 2,
                                                    top: ball.y - BALL_SIZE / 2,
                                                    width: BALL_SIZE,
                                                    height: BALL_SIZE,
                                                    boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)'
                                                }}
                                            />
                                        </div>
                                    ))}

                                    {/* Paddle */}
                                    <div
                                        className="absolute bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-lg shadow-lg"
                                        style={{
                                            left: gameObjects.paddle.x,
                                            top: GAME_HEIGHT - 80,
                                            width: gameObjects.paddle.width,
                                            height: PADDLE_HEIGHT,
                                            boxShadow: '0 0 15px rgba(34, 211, 238, 0.6)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-lg" />
                                    </div>

                                    {/* Power-ups */}
                                    {gameObjects.powerUps.map((powerUp) => (
                                        <div
                                            key={powerUp.id}
                                            className={`absolute ${POWER_TYPES[powerUp.type].color} text-black font-bold text-xs flex items-center justify-center rounded-full shadow-lg border-2 border-white/50`}
                                            style={{
                                                left: powerUp.x - 18,
                                                top: powerUp.y - 18,
                                                width: 36,
                                                height: 36
                                            }}
                                        >
                                            {POWER_TYPES[powerUp.type].icon}
                                        </div>
                                    ))}

                                    {/* Lasers */}
                                    {gameObjects.lasers.map((laser) => (
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
                                    {gameObjects.particles.map((particle) => (
                                        <div
                                            key={particle.id}
                                            className={`absolute ${particle.color} rounded-full`}
                                            style={{
                                                left: particle.x,
                                                top: particle.y,
                                                width: 4,
                                                height: 4,
                                                opacity: particle.life / 30,
                                                transform: `scale(${particle.life / 30})`
                                            }}
                                        />
                                    ))}

                                    {/* Game info overlay */}
                                    <div className="absolute top-4 left-4 text-xs text-cyan-400/60">
                                        Bricks: {activeBricksCount}
                                    </div>
                                    <div className="absolute top-4 right-4 text-xs text-cyan-400/60">
                                        Balls: {gameObjects.balls.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Menu Screen */}
                        {gameState === 'menu' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/85 to-black/95 flex items-center justify-center"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                <div className="text-center p-8">
                                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                                        BRICK BREAKER
                                    </h1>
                                    <div className="mb-6 text-gray-300 space-y-2 text-sm md:text-base">
                                        <p>Use arrow keys or A/D to move paddle</p>
                                        <p>SPACE to fire lasers (with power-up)</p>
                                        <p>Press P to pause/unpause game</p>
                                        {isMobile && <p className="text-yellow-400">Touch and drag to move paddle</p>}
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
                            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                <div className="text-center">
                                    <Pause className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        PAUSED
                                    </h2>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setGameState('playing')}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg block mx-auto"
                                        >
                                            RESUME
                                        </button>
                                        <button
                                            onClick={() => setGameState('menu')}
                                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg block mx-auto"
                                        >
                                            MENU
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Game Over Screen */}
                        {gameState === 'gameOver' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-sm flex items-center justify-center"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                <div className="text-center p-6">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                        GAME OVER
                                    </h2>
                                    <div className="mb-6 space-y-2">
                                        <p className="text-2xl md:text-3xl font-bold text-white">Score: {score.toLocaleString()}</p>
                                        <p className="text-lg md:text-xl text-gray-300">Level: {level}</p>
                                        <p className="text-sm md:text-base text-gray-400">Bricks Destroyed: {(level - 1) * 60 + (60 - activeBricksCount)}</p>
                                    </div>
                                    {score > highScore && (
                                        <div className="mb-6">
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
                            <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-sm flex items-center justify-center"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                <div className="text-center p-6">
                                    <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-yellow-400" />
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        LEVEL COMPLETE!
                                    </h2>
                                    <div className="mb-4 space-y-1">
                                        <p className="text-xl md:text-2xl text-white font-bold">Level {level - 1} Cleared!</p>
                                        <p className="text-lg text-gray-300">Bonus: +{1000 * (level - 1)} points</p>
                                        <p className="text-base text-green-300">Score: {score.toLocaleString()}</p>
                                    </div>
                                    <p className="text-lg md:text-xl text-yellow-400">
                                        Advancing to Level {level}...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Controls Info */}
                {isMobile && gameState === 'playing' && (
                    <div className="mt-4 text-center text-sm text-gray-400">
                        <p>Touch and drag horizontally to control paddle</p>
                        {gameObjects.activePowerUps.LASER && (
                            <p className="text-yellow-400">Tap screen to fire lasers</p>
                        )}
                    </div>
                )}

                {/* Power-up Legend */}
                <div className="mt-6 max-w-4xl w-full">
                    <h3 className="text-center text-lg font-bold mb-3 text-cyan-400">Power-ups</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        {Object.entries(POWER_TYPES).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-2 border border-gray-700/50">
                                <div className={`w-6 h-6 ${value.color} rounded-full flex items-center justify-center text-black font-bold text-xs border border-white/30 shadow-lg`}>
                                    {value.icon}
                                </div>
                                <span className="text-gray-300 font-medium">{value.effect}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}
export default BrickBreaker;