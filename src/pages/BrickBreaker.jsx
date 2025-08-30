import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
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

// Power-up types with enhanced effects
const POWER_TYPES = {
    MULTI_BALL: { color: 'bg-yellow-400', icon: '●●●', effect: 'Multi Ball', duration: 0 },
    BIG_PADDLE: { color: 'bg-blue-400', icon: '━━━', effect: 'Big Paddle', duration: 400 },
    SLOW_BALL: { color: 'bg-green-400', icon: '◐', effect: 'Slow Ball', duration: 300 },
    EXTRA_LIFE: { color: 'bg-red-400', icon: '♥', effect: 'Extra Life', duration: 0 },
    LASER: { color: 'bg-purple-400', icon: '↑↑↑', effect: 'Laser Mode', duration: 250 }
};

const BrickBreaker = () => {
    useUser();
    const gameAreaRef = useRef(null);
    const animationFrameRef = useRef(null);
    const gameStateRef = useRef({});
    const lastTimeRef = useRef(0);
    const lastLaserTime = useRef(0);
    const containerRef = useRef(null);

    // Game state
    const [gameState, setGameState] = useState('menu');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [gameObjects, setGameObjects] = useState({
        paddle: { x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH },
        balls: [],
        bricks: [],
        powerUps: [],
        particles: [],
        lasers: [],
        activePowerUps: new Set(),
        powerUpTimers: new Map()
    });

    // Mobile and responsive
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [deviceOrientation, setDeviceOrientation] = useState('portrait');

    // Input handling
    const keys = useRef({ left: false, right: false, space: false });
    const touchState = useRef({
        isActive: false,
        startX: 0,
        currentX: 0,
        lastFireTime: 0
    });
    const paddleTarget = useRef(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);

    // Sound effects (using Web Audio API)
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

            gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);

            oscillator.start();
            oscillator.stop(audioContext.current.currentTime + duration / 1000);
        } catch (error) {
            console.log('Audio context not available');
        }
    }, [soundEnabled]);

    // Initialize audio context and high score
    useEffect(() => {
        try {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
        }

        const saved = localStorage.getItem('brickBreakerHighScore');
        if (saved) setHighScore(parseInt(saved));

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
            setDeviceOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            console.log('Fullscreen not supported or blocked');
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Enhanced brick initialization with level variations
    const initializeBricks = useCallback(() => {
        const newBricks = [];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
        const powerUpChance = Math.min(0.15, 0.08 + level * 0.01);

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                // Create patterns for higher levels
                if (level > 2 && (row + col) % 4 === 0 && Math.random() < 0.2) continue;
                if (level > 5 && row === 2 && col >= 3 && col <= 6) continue; // Create gaps

                newBricks.push({
                    id: `${row}-${col}`,
                    x: col * (BRICK_WIDTH + 5) + 37.5,
                    y: row * (BRICK_HEIGHT + 5) + 60,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    color: colors[row],
                    hits: Math.min(Math.floor(level / 3) + 1, 4),
                    maxHits: Math.min(Math.floor(level / 3) + 1, 4),
                    powerUp: Math.random() < powerUpChance ?
                        Object.keys(POWER_TYPES)[Math.floor(Math.random() * Object.keys(POWER_TYPES).length)] : null,
                    glowIntensity: Math.random()
                });
            }
        }
        return newBricks;
    }, [level]);

    // Enhanced ball reset with level-based speed
    const createBall = useCallback((x = GAME_WIDTH / 2, y = GAME_HEIGHT - 100, customVelocity = null) => {
        const baseSpeed = 3.5 + level * 0.2;
        const angle = customVelocity ?
            Math.atan2(customVelocity.dy, customVelocity.dx) :
            -Math.PI / 2 + (Math.random() - 0.5) * 0.8;

        return {
            id: `ball-${Date.now()}-${Math.random()}`,
            x,
            y,
            dx: customVelocity ? customVelocity.dx : Math.cos(angle) * baseSpeed,
            dy: customVelocity ? customVelocity.dy : Math.sin(angle) * baseSpeed,
            trail: [],
            glowIntensity: 0
        };
    }, [level]);

    const resetBall = useCallback(() => {
        return [createBall()];
    }, [createBall]);

    // Apply power-up effects with proper state management
    const applyPowerUp = useCallback((type, currentObjects) => {
        let newObjects = { ...currentObjects };
        const activePowerUps = new Set(currentObjects.activePowerUps);
        const powerUpTimers = new Map(currentObjects.powerUpTimers);

        switch (type) {
            case 'MULTI_BALL':
                if (newObjects.balls.length < 8) { // Limit max balls
                    const additionalBalls = [];
                    newObjects.balls.forEach(ball => {
                        if (additionalBalls.length < 6) { // Limit new balls per power-up
                            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                            const angles = [-Math.PI / 6, Math.PI / 6, -Math.PI / 3, Math.PI / 3];

                            for (let i = 0; i < 2 && additionalBalls.length < 6; i++) {
                                const angle = angles[i % angles.length];
                                additionalBalls.push(createBall(
                                    ball.x,
                                    ball.y,
                                    {
                                        dx: Math.cos(angle) * speed,
                                        dy: Math.sin(angle) * speed
                                    }
                                ));
                            }
                        }
                    });
                    newObjects.balls = [...newObjects.balls, ...additionalBalls];
                }
                playSound(800, 150);
                break;

            case 'BIG_PADDLE':
                newObjects.paddle = { ...newObjects.paddle, width: PADDLE_WIDTH * 1.5 };
                activePowerUps.add('BIG_PADDLE');
                powerUpTimers.set('BIG_PADDLE', POWER_TYPES.BIG_PADDLE.duration);
                playSound(400, 100);
                break;

            case 'SLOW_BALL':
                newObjects.balls = newObjects.balls.map(ball => ({
                    ...ball,
                    dx: ball.dx * 0.7,
                    dy: ball.dy * 0.7
                }));
                activePowerUps.add('SLOW_BALL');
                powerUpTimers.set('SLOW_BALL', POWER_TYPES.SLOW_BALL.duration);
                playSound(300, 150);
                break;

            case 'EXTRA_LIFE':
                setLives(prev => prev + 1);
                playSound(1000, 200);
                break;

            case 'LASER':
                activePowerUps.add('LASER');
                powerUpTimers.set('LASER', POWER_TYPES.LASER.duration);
                playSound(600, 100);
                break;
        }

        newObjects.activePowerUps = activePowerUps;
        newObjects.powerUpTimers = powerUpTimers;
        return newObjects;
    }, [createBall, playSound]);

    // Game initialization
    const resetGame = useCallback(() => {
        setGameObjects({
            paddle: { x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2, width: PADDLE_WIDTH },
            balls: resetBall(),
            bricks: initializeBricks(),
            powerUps: [],
            particles: [],
            lasers: [],
            activePowerUps: new Set(),
            powerUpTimers: new Map()
        });
        paddleTarget.current = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    }, [initializeBricks, resetBall]);

    // Collision detection optimized for performance
    const checkCollision = useCallback((ball, rect) => {
        const ballLeft = ball.x - BALL_SIZE / 2;
        const ballRight = ball.x + BALL_SIZE / 2;
        const ballTop = ball.y - BALL_SIZE / 2;
        const ballBottom = ball.y + BALL_SIZE / 2;

        return !(ballLeft > rect.x + rect.width ||
            ballRight < rect.x ||
            ballTop > rect.y + rect.height ||
            ballBottom < rect.y);
    }, []);

    // Enhanced collision normal calculation
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

    // Main game loop - heavily optimized with proper state management
    const gameLoop = useCallback((currentTime) => {
        if (gameStateRef.current.state !== 'playing') return;

        const deltaTime = Math.min(currentTime - lastTimeRef.current, 32);
        lastTimeRef.current = currentTime;
        const timeScale = deltaTime / (1000 / FPS);

        setGameObjects(prevObjects => {
            let newObjects = {
                ...prevObjects,
                activePowerUps: new Set(prevObjects.activePowerUps),
                powerUpTimers: new Map(prevObjects.powerUpTimers)
            };

            let scoreToAdd = 0;
            const bricksToRemove = new Set();
            const newPowerUps = [];
            const newParticles = [];

            // Update paddle with smooth movement
            const targetX = paddleTarget.current;
            const currentX = newObjects.paddle.x;
            const paddleSpeed = isMobile ? 15 : 12;
            const newPaddleX = Math.abs(targetX - currentX) < 2
                ? targetX
                : currentX + Math.sign(targetX - currentX) * paddleSpeed * timeScale;

            newObjects.paddle = {
                ...newObjects.paddle,
                x: Math.max(0, Math.min(GAME_WIDTH - newObjects.paddle.width, newPaddleX))
            };

            // Update balls with enhanced physics
            const updatedBalls = newObjects.balls.map(ball => {
                let newBall = { ...ball };

                // Update position
                newBall.x += newBall.dx * timeScale;
                newBall.y += newBall.dy * timeScale;

                // Wall collisions with bounce effects
                if (newBall.x <= BALL_SIZE / 2) {
                    newBall.x = BALL_SIZE / 2;
                    newBall.dx = Math.abs(newBall.dx) * 0.95;
                    playSound(600, 50);
                } else if (newBall.x >= GAME_WIDTH - BALL_SIZE / 2) {
                    newBall.x = GAME_WIDTH - BALL_SIZE / 2;
                    newBall.dx = -Math.abs(newBall.dx) * 0.95;
                    playSound(600, 50);
                }

                if (newBall.y <= BALL_SIZE / 2) {
                    newBall.y = BALL_SIZE / 2;
                    newBall.dy = Math.abs(newBall.dy) * 0.95;
                    playSound(500, 50);
                }

                // Paddle collision with enhanced physics
                const paddleRect = {
                    x: newObjects.paddle.x,
                    y: GAME_HEIGHT - 80,
                    width: newObjects.paddle.width,
                    height: PADDLE_HEIGHT
                };

                if (checkCollision(newBall, paddleRect) && newBall.dy > 0) {
                    const hitPosition = (newBall.x - (paddleRect.x + paddleRect.width / 2)) / paddleRect.width;
                    const maxSpin = 4;
                    const spin = hitPosition * maxSpin;

                    newBall.dy = -Math.abs(newBall.dy);
                    newBall.dx = newBall.dx * 0.8 + spin;
                    newBall.y = paddleRect.y - BALL_SIZE / 2 - 1;

                    // Speed management
                    const speed = Math.sqrt(newBall.dx * newBall.dx + newBall.dy * newBall.dy);
                    const minSpeed = 3 + level * 0.1;
                    const maxSpeed = 8 + level * 0.2;

                    if (speed < minSpeed) {
                        const ratio = minSpeed / speed;
                        newBall.dx *= ratio;
                        newBall.dy *= ratio;
                    } else if (speed > maxSpeed) {
                        const ratio = maxSpeed / speed;
                        newBall.dx *= ratio;
                        newBall.dy *= ratio;
                    }

                    newBall.glowIntensity = 1;
                    playSound(700, 80);
                }

                // Brick collisions
                for (const brick of newObjects.bricks) {
                    if (bricksToRemove.has(brick.id)) continue;

                    if (checkCollision(newBall, brick)) {
                        const normal = getCollisionNormal(newBall, brick);

                        // Apply collision response
                        if (normal.axis === 'x') {
                            newBall.dx = -newBall.dx * 0.98;
                        } else {
                            newBall.dy = -newBall.dy * 0.98;
                        }

                        // Damage brick
                        brick.hits--;
                        scoreToAdd += 10 * level;
                        newBall.glowIntensity = 1;

                        if (brick.hits <= 0) {
                            bricksToRemove.add(brick.id);
                            scoreToAdd += 50 * level;

                            // Drop power-up
                            if (brick.powerUp) {
                                newPowerUps.push({
                                    id: `powerup-${Date.now()}-${Math.random()}`,
                                    type: brick.powerUp,
                                    x: brick.x + brick.width / 2,
                                    y: brick.y + brick.height / 2,
                                    dy: 1.5,
                                    rotation: 0,
                                    pulse: 0
                                });
                            }

                            // Enhanced particles
                            for (let i = 0; i < 8; i++) {
                                newParticles.push({
                                    id: `particle-${Date.now()}-${i}`,
                                    x: brick.x + brick.width / 2,
                                    y: brick.y + brick.height / 2,
                                    dx: (Math.random() - 0.5) * 10,
                                    dy: (Math.random() - 0.5) * 10,
                                    life: 40 + Math.random() * 20,
                                    maxLife: 60,
                                    color: brick.color,
                                    size: 3 + Math.random() * 3
                                });
                            }

                            playSound(400 + Math.random() * 200, 120);
                        } else {
                            playSound(300, 60);
                        }
                        break;
                    }
                }

                // Update trail
                newBall.trail = [...(newBall.trail || []).slice(-8), {
                    x: newBall.x,
                    y: newBall.y,
                    intensity: newBall.glowIntensity || 0
                }];

                // Fade glow
                newBall.glowIntensity = Math.max(0, (newBall.glowIntensity || 0) - 0.05);

                return newBall;
            }).filter(ball => ball.y < GAME_HEIGHT + 100); // Extended boundary for multiball

            newObjects.balls = updatedBalls;

            // Handle keyboard movement with acceleration
            const acceleration = isMobile ? 0.8 : 0.6;
            if (keys.current.left) {
                paddleTarget.current = Math.max(0, paddleTarget.current - (8 + level) * timeScale);
            }
            if (keys.current.right) {
                paddleTarget.current = Math.min(GAME_WIDTH - newObjects.paddle.width,
                    paddleTarget.current + (8 + level) * timeScale);
            }

            // Enhanced laser firing
            if (keys.current.space && newObjects.activePowerUps.has('LASER') &&
                currentTime - lastLaserTime.current > 150) {
                const laserCount = isMobile ? 1 : 2;
                for (let i = 0; i < laserCount; i++) {
                    newObjects.lasers.push({
                        id: `laser-${currentTime}-${i}`,
                        x: newObjects.paddle.x + newObjects.paddle.width / 2 + (i - 0.5) * 20,
                        y: GAME_HEIGHT - 90,
                        dy: -15
                    });
                }
                lastLaserTime.current = currentTime;
                playSound(900, 60, 'sawtooth');
            }

            // Update lasers
            newObjects.lasers = newObjects.lasers.map(laser => ({
                ...laser,
                y: laser.y + laser.dy * timeScale
            })).filter(laser => {
                if (laser.y < -20) return false;

                // Laser-brick collision
                for (const brick of newObjects.bricks) {
                    if (bricksToRemove.has(brick.id)) continue;

                    if (laser.x >= brick.x && laser.x <= brick.x + brick.width &&
                        laser.y >= brick.y && laser.y <= brick.y + brick.height) {

                        brick.hits--;
                        scoreToAdd += 20 * level;

                        if (brick.hits <= 0) {
                            bricksToRemove.add(brick.id);
                            scoreToAdd += 100 * level;

                            // Laser destruction particles
                            for (let i = 0; i < 6; i++) {
                                newParticles.push({
                                    id: `laser-particle-${Date.now()}-${i}`,
                                    x: brick.x + brick.width / 2,
                                    y: brick.y + brick.height / 2,
                                    dx: (Math.random() - 0.5) * 8,
                                    dy: (Math.random() - 0.5) * 8,
                                    life: 35,
                                    maxLife: 35,
                                    color: 'bg-red-400',
                                    size: 2
                                });
                            }
                        }
                        playSound(1200, 40);
                        return false;
                    }
                }
                return true;
            });

            // Update power-ups with enhanced movement
            newObjects.powerUps = [...newObjects.powerUps, ...newPowerUps].map(powerUp => ({
                ...powerUp,
                y: powerUp.y + powerUp.dy * timeScale,
                rotation: (powerUp.rotation || 0) + 3 * timeScale,
                pulse: (powerUp.pulse || 0) + 0.1
            })).filter(powerUp => {
                if (powerUp.y > GAME_HEIGHT + 50) return false;

                // Collection detection
                const collected = Math.abs(powerUp.x - (newObjects.paddle.x + newObjects.paddle.width / 2)) < 30 &&
                    powerUp.y >= GAME_HEIGHT - 110 && powerUp.y <= GAME_HEIGHT - 70;

                if (collected) {
                    newObjects = applyPowerUp(powerUp.type, newObjects);
                    return false;
                }
                return true;
            });

            // Update particles with physics
            newObjects.particles = [...newObjects.particles.slice(-50), ...newParticles].map(particle => ({
                ...particle,
                x: particle.x + particle.dx * timeScale * 0.4,
                y: particle.y + particle.dy * timeScale * 0.4,
                dx: particle.dx * 0.97,
                dy: particle.dy * 0.97 + 0.2, // Gravity
                life: particle.life - timeScale
            })).filter(particle => particle.life > 0);

            // Update power-up timers
            const updatedTimers = new Map();
            const updatedActivePowerUps = new Set();

            newObjects.powerUpTimers.forEach((time, key) => {
                const newTime = time - timeScale;
                if (newTime > 0) {
                    updatedTimers.set(key, newTime);
                    updatedActivePowerUps.add(key);
                } else {
                    // Reset power-up effects
                    if (key === 'BIG_PADDLE') {
                        newObjects.paddle.width = PADDLE_WIDTH;
                        paddleTarget.current = Math.min(paddleTarget.current, GAME_WIDTH - PADDLE_WIDTH);
                    } else if (key === 'SLOW_BALL') {
                        newObjects.balls = newObjects.balls.map(ball => ({
                            ...ball,
                            dx: ball.dx / 0.7,
                            dy: ball.dy / 0.7
                        }));
                    }
                }
            });

            newObjects.powerUpTimers = updatedTimers;
            newObjects.activePowerUps = updatedActivePowerUps;

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
    }, [checkCollision, getCollisionNormal, applyPowerUp, level, isMobile, playSound, createBall]);

    // Start new game
    const startNewGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        setLives(3);
        resetGame();
        setGameState('playing');
        playSound(800, 200);
    }, [resetGame, playSound]);

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
                playSound(200, 500);
            } else {
                setLives(newLives);
                playSound(300, 300);
                setTimeout(() => {
                    if (gameStateRef.current.state === 'playing') {
                        setGameObjects(prev => ({ ...prev, balls: resetBall() }));
                    }
                }, 1500);
            }
        }

        if (gameObjects.bricks.length === 0) {
            setGameState('levelComplete');
            setScore(prev => prev + 1000 * level);
            playSound(1000, 300);
            setTimeout(() => {
                setLevel(prev => prev + 1);
                resetGame();
                setGameState('playing');
            }, 2500);
        }
    }, [gameObjects.balls.length, gameObjects.bricks.length, gameState, score, highScore, level, lives, resetBall, resetGame, playSound]);

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

    // Enhanced keyboard controls
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
    }, [gameState, toggleFullscreen]);

    // Enhanced touch controls for mobile
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        const rect = gameAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        touchState.current = {
            isActive: true,
            startX: touch.clientX,
            currentX: touch.clientX,
            lastFireTime: touchState.current.lastFireTime
        };

        // Convert touch position to game coordinates
        const relativeX = (touch.clientX - rect.left) / scale;
        paddleTarget.current = Math.max(0, Math.min(GAME_WIDTH - gameObjects.paddle.width,
            relativeX - gameObjects.paddle.width / 2));

        e.preventDefault();
    }, [scale, gameObjects.paddle.width]);

    const handleTouchMove = useCallback((e) => {
        if (!touchState.current.isActive || !gameAreaRef.current) return;

        const touch = e.touches[0];
        const rect = gameAreaRef.current.getBoundingClientRect();
        const relativeX = (touch.clientX - rect.left) / scale;

        touchState.current.currentX = touch.clientX;
        paddleTarget.current = Math.max(0, Math.min(GAME_WIDTH - gameObjects.paddle.width,
            relativeX - gameObjects.paddle.width / 2));

        e.preventDefault();
    }, [scale, gameObjects.paddle.width]);

    const handleTouchEnd = useCallback((e) => {
        // Fire laser on tap (if laser power-up is active)
        if (gameObjects.activePowerUps.has('LASER') &&
            Date.now() - touchState.current.lastFireTime > 200) {
            keys.current.space = true;
            touchState.current.lastFireTime = Date.now();
            setTimeout(() => { keys.current.space = false; }, 50);
        }

        touchState.current.isActive = false;
        e.preventDefault();
    }, [gameObjects.activePowerUps]);

    // Responsive scaling with orientation support
    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const availableWidth = containerRect.width - 32;
            const availableHeight = containerRect.height - 150;

            const scaleX = availableWidth / GAME_WIDTH;
            const scaleY = availableHeight / GAME_HEIGHT;

            setScale(Math.min(scaleX, scaleY, 1));
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateScale, 100);
        });

        return () => {
            window.removeEventListener('resize', updateScale);
            window.removeEventListener('orientationchange', updateScale);
        };
    }, []);

    // Initialize game
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Derived values
    const activeBricksCount = gameObjects.bricks.length;
    const totalBricks = BRICK_ROWS * BRICK_COLS;
    const bricksDestroyed = totalBricks - activeBricksCount;

    return (
        <Dashboard activeMenu="Brik Breaker Game">
            <div
                ref={containerRef}
                className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
            >
                {/* Enhanced Header with controls */}
                <div className="w-full px-4 py-2 flex flex-wrap justify-between items-center text-xs sm:text-sm md:text-base gap-2 bg-black/20 backdrop-blur-sm">
                    <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                            <span className="font-mono font-bold">{score.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-300 hidden sm:block">Best: {highScore.toLocaleString()}</div>
                        <div className="text-cyan-400 font-bold">Level {level}</div>
                        <div className="text-orange-400">Progress: {Math.round((bricksDestroyed / totalBricks) * 100)}%</div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                            <span className="text-xs">Lives:</span>
                            {Array.from({ length: Math.max(0, lives) }, (_, i) => (
                                <span key={i} className="text-red-400 text-sm sm:text-lg">♥</span>
                            ))}
                        </div>

                        {/* Control buttons */}
                        <div className="flex gap-1">
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-1 sm:p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                title="Toggle Sound (M)"
                            >
                                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-1 sm:p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                title="Toggle Fullscreen (F)"
                            >
                                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Power-ups Display */}
                {gameObjects.activePowerUps.size > 0 && (
                    <div className="px-4 py-2 bg-black/30 backdrop-blur-sm">
                        <div className="flex gap-2 flex-wrap justify-center">
                            {Array.from(gameObjects.activePowerUps).map(type => {
                                const timeLeft = gameObjects.powerUpTimers.get(type) || 0;
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
                <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
                    <div className="relative">
                        <div
                            ref={gameAreaRef}
                            className="relative bg-gradient-to-b from-gray-900 to-black border-2 sm:border-4 border-cyan-400 shadow-2xl shadow-cyan-400/25 overflow-hidden select-none"
                            style={{
                                width: GAME_WIDTH * scale,
                                height: GAME_HEIGHT * scale,
                                maxWidth: '100vw',
                                maxHeight: '70vh'
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Animated background */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse" />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0,255,255,0.1) 0%, transparent 50%),
                                                     radial-gradient(circle at 75% 75%, rgba(128,0,255,0.1) 0%, transparent 50%)`,
                                        backgroundSize: '400px 400px',
                                        animation: 'float 8s ease-in-out infinite'
                                    }}
                                />
                            </div>

                            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                {gameState === 'playing' && (
                                    <>
                                        {/* Enhanced Bricks with glow effects */}
                                        {gameObjects.bricks.map((brick) => {
                                            const hitRatio = brick.hits / brick.maxHits;
                                            const glowIntensity = 0.3 + brick.glowIntensity * 0.7;

                                            return (
                                                <div
                                                    key={brick.id}
                                                    className={`absolute ${brick.color} rounded-sm shadow-lg border border-white/30 transition-all duration-100`}
                                                    style={{
                                                        left: brick.x,
                                                        top: brick.y,
                                                        width: brick.width,
                                                        height: brick.height,
                                                        opacity: Math.max(0.6, hitRatio),
                                                        transform: `scale(${0.9 + hitRatio * 0.1})`,
                                                        boxShadow: `0 0 ${10 + glowIntensity * 15}px rgba(34, 211, 238, ${glowIntensity})`
                                                    }}
                                                >
                                                    {brick.powerUp && (
                                                        <div className={`absolute inset-0 ${POWER_TYPES[brick.powerUp].color} opacity-50 rounded-sm animate-pulse`} />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-sm" />
                                                    {brick.hits > 1 && (
                                                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                                            {brick.hits}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Enhanced Balls with trails */}
                                        {gameObjects.balls.map((ball) => (
                                            <div key={ball.id}>
                                                {/* Ball trail */}
                                                {ball.trail?.map((pos, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute bg-cyan-400/40 rounded-full"
                                                        style={{
                                                            left: pos.x - (BALL_SIZE * (i + 1)) / (ball.trail.length * 2),
                                                            top: pos.y - (BALL_SIZE * (i + 1)) / (ball.trail.length * 2),
                                                            width: (BALL_SIZE * (i + 1)) / ball.trail.length,
                                                            height: (BALL_SIZE * (i + 1)) / ball.trail.length,
                                                            opacity: (i + 1) / ball.trail.length * 0.6,
                                                            filter: `blur(${(ball.trail.length - i) * 0.5}px)`
                                                        }}
                                                    />
                                                ))}
                                                {/* Enhanced Ball */}
                                                <div
                                                    className="absolute bg-gradient-radial from-cyan-200 via-cyan-400 to-cyan-600 rounded-full shadow-lg"
                                                    style={{
                                                        left: ball.x - BALL_SIZE / 2,
                                                        top: ball.y - BALL_SIZE / 2,
                                                        width: BALL_SIZE,
                                                        height: BALL_SIZE,
                                                        boxShadow: `0 0 ${15 + (ball.glowIntensity || 0) * 20}px rgba(34, 211, 238, ${0.8 + (ball.glowIntensity || 0) * 0.5})`,
                                                        transform: `scale(${1 + (ball.glowIntensity || 0) * 0.3})`
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-full" />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Enhanced Paddle */}
                                        <div
                                            className="absolute bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-lg shadow-lg transition-all duration-200"
                                            style={{
                                                left: gameObjects.paddle.x,
                                                top: GAME_HEIGHT - 80,
                                                width: gameObjects.paddle.width,
                                                height: PADDLE_HEIGHT,
                                                boxShadow: `0 0 20px rgba(34, 211, 238, 0.8)`
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-lg" />
                                            {gameObjects.activePowerUps.has('LASER') && (
                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-red-400 rounded-full animate-pulse" />
                                            )}
                                        </div>

                                        {/* Enhanced Power-ups */}
                                        {gameObjects.powerUps.map((powerUp) => (
                                            <div
                                                key={powerUp.id}
                                                className={`absolute ${POWER_TYPES[powerUp.type].color} text-black font-bold text-xs flex items-center justify-center rounded-full shadow-lg border-2 border-white/60 transition-all duration-100`}
                                                style={{
                                                    left: powerUp.x - 20,
                                                    top: powerUp.y - 20,
                                                    width: 40,
                                                    height: 40,
                                                    transform: `rotate(${powerUp.rotation || 0}deg) scale(${1 + Math.sin(powerUp.pulse || 0) * 0.2})`,
                                                    boxShadow: `0 0 15px rgba(255,255,255,0.6)`
                                                }}
                                            >
                                                <span style={{ transform: `rotate(-${powerUp.rotation || 0}deg)` }}>
                                                    {POWER_TYPES[powerUp.type].icon}
                                                </span>
                                            </div>
                                        ))}

                                        {/* Enhanced Lasers */}
                                        {gameObjects.lasers.map((laser) => (
                                            <div
                                                key={laser.id}
                                                className="absolute bg-gradient-to-t from-red-400 via-red-500 to-red-600 shadow-lg rounded-full"
                                                style={{
                                                    left: laser.x - 3,
                                                    top: laser.y,
                                                    width: 6,
                                                    height: 30,
                                                    boxShadow: '0 0 15px rgba(248, 113, 113, 0.9)',
                                                    background: 'linear-gradient(180deg, #f87171 0%, #ef4444 50%, #dc2626 100%)'
                                                }}
                                            />
                                        ))}

                                        {/* Enhanced Particles */}
                                        {gameObjects.particles.map((particle) => {
                                            const lifeRatio = particle.life / particle.maxLife;
                                            return (
                                                <div
                                                    key={particle.id}
                                                    className={`absolute ${particle.color} rounded-full`}
                                                    style={{
                                                        left: particle.x - particle.size / 2,
                                                        top: particle.y - particle.size / 2,
                                                        width: particle.size,
                                                        height: particle.size,
                                                        opacity: lifeRatio,
                                                        transform: `scale(${lifeRatio})`,
                                                        boxShadow: `0 0 ${particle.size * 2}px currentColor`
                                                    }}
                                                />
                                            );
                                        })}

                                        {/* Enhanced Game info overlay */}
                                        <div className="absolute top-2 left-2 text-xs text-cyan-400/70 bg-black/30 rounded px-2 py-1">
                                            Bricks: {activeBricksCount}/{totalBricks}
                                        </div>
                                        <div className="absolute top-2 right-2 text-xs text-cyan-400/70 bg-black/30 rounded px-2 py-1">
                                            Balls: {gameObjects.balls.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Enhanced Menu Screen */}
                            {gameState === 'menu' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/90 to-black/95 flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-4 sm:p-8 max-w-md">
                                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 sm:mb-6 animate-pulse">
                                            BRICK BREAKER
                                        </h1>
                                        <div className="mb-4 sm:mb-6 text-gray-300 space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
                                            <p>🎮 Use ←→ or A/D to move paddle</p>
                                            <p>🚀 SPACE to fire lasers (with power-up)</p>
                                            <p>⏸️ Press P to pause • F for fullscreen • M for sound</p>
                                            {isMobile && (
                                                <>
                                                    <p className="text-yellow-400">📱 Touch and drag to move paddle</p>
                                                    <p className="text-yellow-400">⚡ Tap to fire lasers</p>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={startNewGame}
                                            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/30 border-2 border-cyan-300/40 w-full sm:w-auto"
                                        >
                                            <Play className="inline mr-2" size={20} />
                                            START GAME
                                        </button>
                                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                                            High Score: {highScore.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Pause Screen */}
                            {gameState === 'paused' && (
                                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-4 sm:p-6">
                                        <Pause className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
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

                            {/* Enhanced Game Over Screen */}
                            {gameState === 'gameOver' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-md flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-4 sm:p-6 max-w-sm">
                                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                            GAME OVER
                                        </h2>
                                        <div className="mb-4 sm:mb-6 space-y-2 bg-black/30 rounded-lg p-4">
                                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                                Score: {score.toLocaleString()}
                                            </p>
                                            <p className="text-lg md:text-xl text-gray-300">Level: {level}</p>
                                            <p className="text-sm md:text-base text-gray-400">
                                                Accuracy: {gameObjects.balls.length > 0 ? Math.round((bricksDestroyed / (bricksDestroyed + 1)) * 100) : 0}%
                                            </p>
                                        </div>
                                        {score > highScore && (
                                            <div className="mb-4 sm:mb-6 animate-bounce">
                                                <p className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bold">
                                                    🏆 NEW HIGH SCORE! 🏆
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-3 justify-center">
                                            <button
                                                onClick={startNewGame}
                                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                            >
                                                <RotateCcw className="inline mr-2" size={20} />
                                                PLAY AGAIN
                                            </button>
                                            <button
                                                onClick={() => setGameState('menu')}
                                                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                            >
                                                MAIN MENU
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Level Complete Screen */}
                            {gameState === 'levelComplete' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-md flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-4 sm:p-6">
                                        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 text-yellow-400 animate-bounce" />
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                            LEVEL COMPLETE!
                                        </h2>
                                        <div className="mb-4 space-y-1 bg-black/30 rounded-lg p-4">
                                            <p className="text-lg sm:text-xl md:text-2xl text-white font-bold">
                                                Level {level - 1} Cleared!
                                            </p>
                                            <p className="text-base sm:text-lg text-gray-300">
                                                Bonus: +{(1000 * (level - 1)).toLocaleString()} points
                                            </p>
                                            <p className="text-sm sm:text-base text-green-300">
                                                Total Score: {score.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-lg md:text-xl text-yellow-400 animate-pulse">
                                            Advancing to Level {level}...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile-optimized controls info */}
                {isMobile && gameState === 'playing' && (
                    <div className="px-4 py-2 bg-black/30 backdrop-blur-sm border-t border-gray-700/50">
                        <div className="text-center text-xs sm:text-sm text-gray-300 space-y-1">
                            <p>👆 Touch and drag to control paddle</p>
                            {gameObjects.activePowerUps.has('LASER') && (
                                <p className="text-yellow-400">⚡ Tap anywhere to fire lasers</p>
                            )}
                            <p className="text-gray-500">
                                Current: {deviceOrientation} mode
                                {deviceOrientation === 'portrait' && ' • Rotate for better experience'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Enhanced Power-up Legend */}
                <div className="px-4 py-3 bg-black/20 backdrop-blur-sm border-t border-gray-700/30">
                    <h3 className="text-center text-sm sm:text-lg font-bold mb-2 sm:mb-3 text-cyan-400">Power-ups Guide</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 text-xs max-w-6xl mx-auto">
                        {Object.entries(POWER_TYPES).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1 sm:gap-2 bg-gray-800/60 rounded-lg p-1 sm:p-2 border border-gray-700/50 hover:bg-gray-700/60 transition-colors">
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 ${value.color} rounded-full flex items-center justify-center text-black font-bold text-xs border border-white/30 shadow-lg`}>
                                    {value.icon}
                                </div>
                                <span className="text-gray-300 font-medium text-xs sm:text-sm truncate">{value.effect}</span>
                            </div>
                        ))}
                    </div>

                    {/* Keyboard shortcuts */}
                    <div className="mt-2 sm:mt-3 text-center text-xs text-gray-500">
                        P: Pause • F: Fullscreen • M: Sound • Space: Laser
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}

export default BrickBreaker;