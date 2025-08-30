import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

// Simplified power-up types for better performance
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

    // Optimized game objects with minimal state updates
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

    // Mobile optimization
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [deviceOrientation, setDeviceOrientation] = useState('portrait');

    // Input handling with minimal updates
    const keys = useRef({ left: false, right: false, space: false });
    const touchState = useRef({
        isActive: false,
        startX: 0,
        currentX: 0,
        lastFireTime: 0
    });
    const paddleTarget = useRef(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);

    // Optimized audio with pooling
    const audioContext = useRef(null);
    const oscillatorPool = useRef([]);

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
            // Silent fail
        }
    }, [soundEnabled]);

    // Initialize audio and check mobile
    useEffect(() => {
        try {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            // Silent fail
        }

        const checkMobile = () => {
            const mobile = window.innerWidth <= 768 || 'ontouchstart' in window;
            setIsMobile(mobile);
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
            // Silent fail
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Optimized brick initialization
    const initializeBricks = useCallback(() => {
        const newBricks = [];
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
        const powerUpChance = Math.min(0.12, 0.06 + level * 0.01);

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                // Simple pattern for higher levels
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
            trail: [] // Simplified trail
        };
    }, [level]);

    const resetBall = useCallback(() => {
        return [createBall()];
    }, [createBall]);

    // Simplified power-up application
    const applyPowerUp = useCallback((type) => {
        const objects = gameObjectsRef.current;

        switch (type) {
            case 'MULTI_BALL':
                if (objects.balls.length < 4) { // Reduced max balls for performance
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

    // Optimized collision detection
    const checkCollision = useCallback((ball, rect) => {
        return !(ball.x + BALL_SIZE / 2 < rect.x ||
            ball.x - BALL_SIZE / 2 > rect.x + rect.width ||
            ball.y + BALL_SIZE / 2 < rect.y ||
            ball.y - BALL_SIZE / 2 > rect.y + rect.height);
    }, []);

    // Simplified collision normal
    const getCollisionNormal = useCallback((ball, rect) => {
        const ballCenterX = ball.x;
        const ballCenterY = ball.y;
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;

        const deltaX = ballCenterX - rectCenterX;
        const deltaY = ballCenterY - rectCenterY;

        const overlapX = (rect.width / 2 + BALL_SIZE / 2) - Math.abs(deltaX);
        const overlapY = (rect.height / 2 + BALL_SIZE / 2) - Math.abs(deltaY);

        return overlapX < overlapY ?
            { x: Math.sign(deltaX), y: 0 } :
            { x: 0, y: Math.sign(deltaY) };
    }, []);

    // Heavily optimized game loop
    const gameLoop = useCallback((currentTime) => {
        if (gameStateRef.current.state !== 'playing') return;

        const deltaTime = Math.min(currentTime - lastTimeRef.current, 32);
        lastTimeRef.current = currentTime;
        const timeScale = deltaTime / (1000 / FPS);

        const objects = gameObjectsRef.current;
        let scoreToAdd = 0;
        let livesLost = 0;
        let levelComplete = false;

        // Update paddle with smooth movement
        const targetX = paddleTarget.current;
        const currentX = objects.paddle.x;
        const paddleSpeed = isMobile ? 12 : 10;

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

        // Update balls with optimized physics
        const ballsToRemove = [];
        objects.balls.forEach((ball, ballIndex) => {
            // Update position
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

                // Speed management
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

            // Simplified trail update (only keep last 3 positions for performance)
            if (!ball.trail) ball.trail = [];
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 3) ball.trail.shift();

            // Brick collisions
            for (let i = objects.bricks.length - 1; i >= 0; i--) {
                const brick = objects.bricks[i];

                if (checkCollision(ball, brick)) {
                    const normal = getCollisionNormal(ball, brick);

                    // Apply collision
                    if (normal.x !== 0) ball.dx = -ball.dx;
                    if (normal.y !== 0) ball.dy = -ball.dy;

                    // Damage brick
                    brick.hits--;
                    scoreToAdd += 10 * level;

                    if (brick.hits <= 0) {
                        scoreToAdd += 40 * level;

                        // Drop power-up (reduced chance for performance)
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

                        // Simplified particles (fewer particles for performance)
                        for (let p = 0; p < 4; p++) {
                            objects.particles.push({
                                id: `particle-${Date.now()}-${p}`,
                                x: brick.x + brick.width / 2,
                                y: brick.y + brick.height / 2,
                                dx: (Math.random() - 0.5) * 6,
                                dy: (Math.random() - 0.5) * 6,
                                life: 30,
                                color: brick.color,
                                size: 2 + Math.random() * 2
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

        // Enhanced laser system
        if (keys.current.space && objects.activePowerUps.has('LASER') &&
            currentTime - lastLaserTime.current > 200) {
            objects.lasers.push({
                id: `laser-${currentTime}`,
                x: objects.paddle.x + objects.paddle.width / 2,
                y: GAME_HEIGHT - 90,
                dy: -12
            });
            lastLaserTime.current = currentTime;
            playSound(900, 40, 'sawtooth');
        }

        // Update lasers
        for (let i = objects.lasers.length - 1; i >= 0; i--) {
            const laser = objects.lasers[i];
            laser.y += laser.dy * timeScale;

            if (laser.y < -20) {
                objects.lasers.splice(i, 1);
                continue;
            }

            // Laser-brick collision
            for (let j = objects.bricks.length - 1; j >= 0; j--) {
                const brick = objects.bricks[j];

                if (laser.x >= brick.x && laser.x <= brick.x + brick.width &&
                    laser.y >= brick.y && laser.y <= brick.y + brick.height) {

                    brick.hits--;
                    scoreToAdd += 15 * level;

                    if (brick.hits <= 0) {
                        scoreToAdd += 60 * level;
                        objects.bricks.splice(j, 1);
                    }

                    objects.lasers.splice(i, 1);
                    playSound(1200, 30);
                    break;
                }
            }
        }

        // Update power-ups
        for (let i = objects.powerUps.length - 1; i >= 0; i--) {
            const powerUp = objects.powerUps[i];
            powerUp.y += powerUp.dy * timeScale;
            powerUp.rotation = (powerUp.rotation || 0) + 2 * timeScale;

            if (powerUp.y > GAME_HEIGHT + 30) {
                objects.powerUps.splice(i, 1);
                continue;
            }

            // Collection detection
            const collected = Math.abs(powerUp.x - (objects.paddle.x + objects.paddle.width / 2)) < 25 &&
                powerUp.y >= GAME_HEIGHT - 100 && powerUp.y <= GAME_HEIGHT - 70;

            if (collected) {
                applyPowerUp(powerUp.type);
                objects.powerUps.splice(i, 1);
            }
        }

        // Update particles (simplified)
        for (let i = objects.particles.length - 1; i >= 0; i--) {
            const particle = objects.particles[i];
            particle.x += particle.dx * timeScale * 0.5;
            particle.y += particle.dy * timeScale * 0.5;
            particle.dx *= 0.96;
            particle.dy += 0.15; // Gravity
            particle.life -= timeScale;

            if (particle.life <= 0) {
                objects.particles.splice(i, 1);
            }
        }

        // Update power-up timers
        objects.powerUpTimers.forEach((time, key) => {
            const newTime = time - timeScale;
            if (newTime <= 0) {
                objects.activePowerUps.delete(key);
                objects.powerUpTimers.delete(key);

                // Reset effects
                if (key === 'BIG_PADDLE') {
                    objects.paddle.width = PADDLE_WIDTH;
                    paddleTarget.current = Math.min(paddleTarget.current, GAME_WIDTH - PADDLE_WIDTH);
                } else if (key === 'SLOW_BALL') {
                    objects.balls.forEach(ball => {
                        ball.dx /= 0.75;
                        ball.dy /= 0.75;
                    });
                }
            } else {
                objects.powerUpTimers.set(key, newTime);
            }
        });

        // Check game state changes
        if (objects.balls.length === 0) {
            livesLost = 1;
        }

        if (objects.bricks.length === 0) {
            levelComplete = true;
            scoreToAdd += 1000 * level;
        }

        // Update score
        if (scoreToAdd > 0) {
            setScore(prev => prev + scoreToAdd);
        }

        // Handle state changes
        if (livesLost > 0) {
            const newLives = lives - livesLost;
            if (newLives <= 0) {
                setGameState('gameOver');
                if (score + scoreToAdd > highScore) {
                    const newHighScore = score + scoreToAdd;
                    setHighScore(newHighScore);
                    try {
                        localStorage.setItem('brickBreakerHighScore', newHighScore.toString());
                    } catch (error) {
                        // Silent fail
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

        if (levelComplete) {
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
    }, [checkCollision, getCollisionNormal, applyPowerUp, level, lives, score, highScore, resetBall, resetGame, playSound, isMobile]);

    // Start new game
    const startNewGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        setLives(3);
        resetGame();
        setGameState('playing');
        playSound(800, 150);
    }, [resetGame, playSound]);

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

    // Optimized keyboard controls
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

    // Optimized touch controls
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        const rect = gameAreaRef.current?.getBoundingClientRect();
        if (!rect) return;

        touchState.current.isActive = true;
        const relativeX = (touch.clientX - rect.left) / scale;
        paddleTarget.current = Math.max(0, Math.min(GAME_WIDTH - gameObjectsRef.current.paddle.width,
            relativeX - gameObjectsRef.current.paddle.width / 2));

        e.preventDefault();
    }, [scale]);

    const handleTouchMove = useCallback((e) => {
        if (!touchState.current.isActive || !gameAreaRef.current) return;

        const touch = e.touches[0];
        const rect = gameAreaRef.current.getBoundingClientRect();
        const relativeX = (touch.clientX - rect.left) / scale;

        paddleTarget.current = Math.max(0, Math.min(GAME_WIDTH - gameObjectsRef.current.paddle.width,
            relativeX - gameObjectsRef.current.paddle.width / 2));

        e.preventDefault();
    }, [scale]);

    const handleTouchEnd = useCallback((e) => {
        // Fire laser on tap
        if (gameObjectsRef.current.activePowerUps.has('LASER') &&
            Date.now() - touchState.current.lastFireTime > 250) {
            keys.current.space = true;
            touchState.current.lastFireTime = Date.now();
            setTimeout(() => { keys.current.space = false; }, 100);
        }

        touchState.current.isActive = false;
        e.preventDefault();
    }, []);

    // Responsive scaling
    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const availableWidth = containerRect.width - 32;
            const availableHeight = containerRect.height - 200;

            const scaleX = availableWidth / GAME_WIDTH;
            const scaleY = availableHeight / GAME_HEIGHT;

            setScale(Math.min(scaleX, scaleY, 1));
        };

        updateScale();
        const resizeHandler = () => {
            requestAnimationFrame(updateScale);
        };

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateScale, 100);
        });

        return () => {
            window.removeEventListener('resize', resizeHandler);
            window.removeEventListener('orientationchange', updateScale);
        };
    }, []);

    // Initialize game
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Memoized game objects for rendering (prevents unnecessary re-renders)
    const renderObjects = useMemo(() => {
        if (gameState !== 'playing') return null;

        const objects = gameObjectsRef.current;
        return {
            bricks: objects.bricks,
            balls: objects.balls,
            powerUps: objects.powerUps,
            particles: objects.particles.slice(-20), // Limit particles for performance
            lasers: objects.lasers,
            paddle: objects.paddle,
            activePowerUps: objects.activePowerUps,
            powerUpTimers: objects.powerUpTimers
        };
    }, [gameState]);

    // Force re-render occasionally to update visuals
    const [, forceUpdate] = useState({});
    useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(() => {
                forceUpdate({});
            }, 100); // Update every 100ms for smooth visuals

            return () => clearInterval(interval);
        }
    }, [gameState]);

    // Derived values for UI
    const activeBricksCount = gameObjectsRef.current.bricks.length;
    const totalBricks = useMemo(() => {
        let count = 0;
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                if (level <= 3 || !((row + col) % 5 === 0 && Math.random() < 0.3)) {
                    count++;
                }
            }
        }
        return count;
    }, [level]);
    const bricksDestroyed = totalBricks - activeBricksCount;

    return (
        <Dashboard activeMenu="Brik Breaker Game">
            <div
                ref={containerRef}
                className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
            >
                {/* Optimized Header */}
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
                                width: GAME_WIDTH * scale,
                                height: GAME_HEIGHT * scale,
                                maxWidth: '100vw',
                                maxHeight: '70vh'
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Simplified background */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20" />
                            </div>

                            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                {gameState === 'playing' && renderObjects && (
                                    <>
                                        {/* Optimized Bricks */}
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

                                        {/* Optimized Balls with simplified trails */}
                                        {renderObjects.balls.map((ball) => (
                                            <div key={ball.id}>
                                                {/* Simplified trail */}
                                                {ball.trail?.slice(-2).map((pos, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute bg-cyan-400/30 rounded-full"
                                                        style={{
                                                            left: pos.x - BALL_SIZE / 3,
                                                            top: pos.y - BALL_SIZE / 3,
                                                            width: BALL_SIZE / 1.5,
                                                            height: BALL_SIZE / 1.5,
                                                            opacity: (i + 1) / 3
                                                        }}
                                                    />
                                                ))}
                                                {/* Optimized Ball */}
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

                                        {/* Optimized Paddle */}
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

                                        {/* Optimized Power-ups */}
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

                                        {/* Optimized Lasers */}
                                        {renderObjects.lasers.map((laser) => (
                                            <div
                                                key={laser.id}
                                                className="absolute bg-gradient-to-t from-red-400 to-red-600 shadow-lg rounded-full"
                                                style={{
                                                    left: laser.x - 2,
                                                    top: laser.y,
                                                    width: 4,
                                                    height: 20,
                                                    boxShadow: '0 0 8px rgba(248, 113, 113, 0.8)'
                                                }}
                                            />
                                        ))}

                                        {/* Simplified Particles */}
                                        {renderObjects.particles.map((particle) => {
                                            const lifeRatio = particle.life / 30;
                                            return (
                                                <div
                                                    key={particle.id}
                                                    className={`absolute ${particle.color} rounded-full`}
                                                    style={{
                                                        left: particle.x - particle.size / 2,
                                                        top: particle.y - particle.size / 2,
                                                        width: particle.size,
                                                        height: particle.size,
                                                        opacity: lifeRatio
                                                    }}
                                                />
                                            );
                                        })}

                                        {/* Game info overlay */}
                                        <div className="absolute top-2 left-2 text-xs text-cyan-400/70 bg-black/30 rounded px-2 py-1">
                                            Bricks: {activeBricksCount}/{totalBricks}
                                        </div>
                                        <div className="absolute top-2 right-2 text-xs text-cyan-400/70 bg-black/30 rounded px-2 py-1">
                                            Balls: {renderObjects.balls.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Menu Screen */}
                            {gameState === 'menu' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/90 to-black/95 flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-8 max-w-md">
                                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-pulse">
                                            BRICK BREAKER
                                        </h1>
                                        <div className="mb-6 text-gray-300 space-y-2 text-sm">
                                            <p>Use ←→ or A/D to move paddle</p>
                                            <p>SPACE to fire lasers (with power-up)</p>
                                            <p>Press P to pause • F for fullscreen • M for sound</p>
                                            {isMobile && (
                                                <>
                                                    <p className="text-yellow-400">Touch and drag to move paddle</p>
                                                    <p className="text-yellow-400">Tap to fire lasers</p>
                                                </>
                                            )}
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
                                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
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
                                <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-black/95 backdrop-blur-md flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-6 max-w-sm">
                                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                            GAME OVER
                                        </h2>
                                        <div className="mb-6 space-y-2 bg-black/30 rounded-lg p-4">
                                            <p className="text-2xl md:text-3xl font-bold text-white">
                                                Score: {score.toLocaleString()}
                                            </p>
                                            <p className="text-xl text-gray-300">Level: {level}</p>
                                            <p className="text-base text-gray-400">
                                                Accuracy: {Math.round((bricksDestroyed / Math.max(bricksDestroyed + 1, 1)) * 100)}%
                                            </p>
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
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-md flex items-center justify-center"
                                    style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                                    <div className="text-center p-6">
                                        <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400 animate-bounce" />
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                            LEVEL COMPLETE!
                                        </h2>
                                        <div className="mb-4 space-y-1 bg-black/30 rounded-lg p-4">
                                            <p className="text-xl md:text-2xl text-white font-bold">
                                                Level {level - 1} Cleared!
                                            </p>
                                            <p className="text-lg text-gray-300">
                                                Bonus: +{(1000 * (level - 1)).toLocaleString()} points
                                            </p>
                                            <p className="text-base text-green-300">
                                                Total Score: {score.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-xl text-yellow-400 animate-pulse">
                                            Advancing to Level {level}...
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile controls info */}
                {isMobile && gameState === 'playing' && (
                    <div className="px-4 py-2 bg-black/30 backdrop-blur-sm border-t border-gray-700/50">
                        <div className="text-center text-sm text-gray-300 space-y-1">
                            <p>Touch and drag to control paddle</p>
                            {gameObjectsRef.current.activePowerUps.has('LASER') && (
                                <p className="text-yellow-400">Tap anywhere to fire lasers</p>
                            )}
                            <p className="text-gray-500">
                                {deviceOrientation} mode
                                {deviceOrientation === 'portrait' && ' • Rotate for better experience'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Simplified Power-up Legend */}
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
                        P: Pause • F: Fullscreen • M: Sound • Space: Laser
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default BrickBreaker;