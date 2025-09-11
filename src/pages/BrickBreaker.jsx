import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Monitor, Play, Pause, RotateCcw, Zap, Shield, Target } from 'lucide-react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 12;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 25;
const BRICK_ROWS = 8;
const BRICK_COLS = 10;

const BrickBreaker = () => {
    // Mobile restriction component
    const MobileRestriction = () => (
        <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-white mb-4">
                    Desktop Required
                </h1>
                <p className="text-white/70 text-lg mb-2">
                    This editor is only usable on desktop.
                </p>
                <p className="text-white/50 text-sm">
                    Please use a larger screen to access the full editing experience.
                </p>
            </div>
        </div>
    );

    // Game state
    const [gameState, setGameState] = useState('menu');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [highScore, setHighScore] = useState(0);

    // Game objects
    const [paddle, setPaddle] = useState({
        x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
        y: GAME_HEIGHT - 50,
        width: PADDLE_WIDTH
    });
    const [balls, setBalls] = useState([]);
    const [bricks, setBricks] = useState([]);
    const [powerUps, setPowerUps] = useState([]);
    const [particles, setParticles] = useState([]);

    // Power-up states
    const [activePowerUps, setActivePowerUps] = useState({
        multiball: false,
        expandPaddle: false,
        fireball: false,
        shield: false,
        magneticPaddle: false
    });

    const animationRef = useRef();
    const keysRef = useRef({});
    const gameStateRef = useRef(gameState);
    const ballsRef = useRef(balls);
    const bricksRef = useRef(bricks);
    const paddleRef = useRef(paddle);
    const activePowerUpsRef = useRef(activePowerUps);

    // Update refs when state changes
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        ballsRef.current = balls;
    }, [balls]);

    useEffect(() => {
        bricksRef.current = bricks;
    }, [bricks]);

    useEffect(() => {
        paddleRef.current = paddle;
    }, [paddle]);

    useEffect(() => {
        activePowerUpsRef.current = activePowerUps;
    }, [activePowerUps]);

    // Initialize game
    const initializeGame = useCallback(() => {
        const newBricks = [];
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'
        ];

        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                const x = col * (BRICK_WIDTH + 5) + 5;
                const y = row * (BRICK_HEIGHT + 5) + 50;
                const type = Math.random() < 0.1 ? 'special' : Math.random() < 0.15 ? 'strong' : 'normal';

                newBricks.push({
                    id: `${row}-${col}`,
                    x,
                    y,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    type,
                    hits: type === 'strong' ? 2 : 1,
                    maxHits: type === 'strong' ? 2 : 1,
                    color: colors[row % colors.length],
                    destroyed: false
                });
            }
        }

        setBricks(newBricks);
        setBalls([{
            id: 1,
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - 100,
            dx: 4 + level * 0.3,
            dy: -4 - level * 0.3,
            size: BALL_SIZE,
            type: 'normal',
            trail: []
        }]);
        setPowerUps([]);
        setParticles([]);
        setActivePowerUps({
            multiball: false,
            expandPaddle: false,
            fireball: false,
            shield: false,
            magneticPaddle: false
        });
        setPaddle({
            x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
            y: GAME_HEIGHT - 50,
            width: PADDLE_WIDTH
        });
    }, [level]);

    // Create particles
    const createParticles = (x, y, color, count = 8) => {
        const newParticles = [];
        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: Math.random(),
                x,
                y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color: color || 'bg-yellow-400',
                size: Math.random() * 4 + 2
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    };

    // Create power-up
    const createPowerUp = (x, y) => {
        if (Math.random() < 0.3) {
            const types = ['multiball', 'expandPaddle', 'fireball', 'shield', 'magneticPaddle'];
            const type = types[Math.floor(Math.random() * types.length)];
            const colors = {
                multiball: 'bg-blue-500',
                expandPaddle: 'bg-green-500',
                fireball: 'bg-red-500',
                shield: 'bg-purple-500',
                magneticPaddle: 'bg-yellow-500'
            };

            setPowerUps(prev => [...prev, {
                id: Math.random(),
                x,
                y,
                type,
                color: colors[type],
                dy: 2,
                size: 20
            }]);
        }
    };

    // Handle power-up collection
    const activatePowerUp = (type) => {
        setActivePowerUps(prev => ({ ...prev, [type]: true }));

        switch (type) {
            case 'multiball':
                setBalls(prev => {
                    const newBalls = [];
                    prev.forEach(ball => {
                        for (let i = 0; i < 2; i++) {
                            newBalls.push({
                                ...ball,
                                id: Math.random(),
                                dx: ball.dx + (Math.random() - 0.5) * 4,
                                dy: ball.dy + (Math.random() - 0.5) * 2
                            });
                        }
                    });
                    return [...prev, ...newBalls];
                });
                setTimeout(() => setActivePowerUps(prev => ({ ...prev, multiball: false })), 10000);
                break;

            case 'expandPaddle':
                setPaddle(prev => ({ ...prev, width: PADDLE_WIDTH * 1.5 }));
                setTimeout(() => {
                    setPaddle(prev => ({ ...prev, width: PADDLE_WIDTH }));
                    setActivePowerUps(prev => ({ ...prev, expandPaddle: false }));
                }, 15000);
                break;

            case 'fireball':
                setTimeout(() => setActivePowerUps(prev => ({ ...prev, fireball: false })), 12000);
                break;

            case 'shield':
                setTimeout(() => setActivePowerUps(prev => ({ ...prev, shield: false })), 20000);
                break;

            case 'magneticPaddle':
                setTimeout(() => setActivePowerUps(prev => ({ ...prev, magneticPaddle: false })), 15000);
                break;
        }
    };

    // Game loop
    const gameLoop = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;

        // Update balls
        setBalls(prevBalls => {
            const updatedBalls = prevBalls.map(ball => {
                let newX = ball.x + ball.dx;
                let newY = ball.y + ball.dy;
                let newDx = ball.dx;
                let newDy = ball.dy;

                // Wall collisions
                if (newX <= ball.size / 2 || newX >= GAME_WIDTH - ball.size / 2) {
                    newDx = -newDx;
                    newX = Math.max(ball.size / 2, Math.min(GAME_WIDTH - ball.size / 2, newX));
                }
                if (newY <= ball.size / 2) {
                    newDy = -newDy;
                    newY = ball.size / 2;
                }

                // Paddle collision
                const currentPaddle = paddleRef.current;
                if (newY + ball.size / 2 >= currentPaddle.y &&
                    newY - ball.size / 2 <= currentPaddle.y + PADDLE_HEIGHT &&
                    newX >= currentPaddle.x && newX <= currentPaddle.x + currentPaddle.width) {

                    if (activePowerUpsRef.current.magneticPaddle) {
                        newDy = 0;
                        newY = currentPaddle.y - ball.size / 2;
                    } else {
                        const paddleCenter = currentPaddle.x + currentPaddle.width / 2;
                        const hitPos = (newX - paddleCenter) / (currentPaddle.width / 2);
                        newDx = hitPos * 6;
                        newDy = -Math.abs(newDy);
                        newY = currentPaddle.y - ball.size / 2;
                    }
                }

                // Update trail
                const newTrail = [...ball.trail, { x: newX, y: newY }];
                if (newTrail.length > 8) newTrail.shift();

                return {
                    ...ball,
                    x: newX,
                    y: newY,
                    dx: newDx,
                    dy: newDy,
                    trail: newTrail
                };
            });

            // Filter out balls that fell off screen
            return updatedBalls.filter(ball => ball.y < GAME_HEIGHT + 50);
        });

        // Update bricks
        setBricks(prevBricks => {
            let brickDestroyed = false;
            let updatedBricks = prevBricks.map(brick => {
                if (brick.destroyed) return brick;

                // Check collision with balls
                ballsRef.current.forEach(ball => {
                    if (!brick.destroyed &&
                        ball.x + ball.size / 2 >= brick.x &&
                        ball.x - ball.size / 2 <= brick.x + brick.width &&
                        ball.y + ball.size / 2 >= brick.y &&
                        ball.y - ball.size / 2 <= brick.y + brick.height) {

                        const updatedBrick = { ...brick, hits: brick.hits - 1 };

                        if (updatedBrick.hits <= 0) {
                            updatedBrick.destroyed = true;
                            brickDestroyed = true;
                            const points = brick.type === 'special' ? 50 : brick.type === 'strong' ? 20 : 10;
                            setScore(prev => prev + points);
                            createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                            createPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2);
                        }

                        brick.hits = updatedBrick.hits;
                        brick.destroyed = updatedBrick.destroyed;
                    }
                });

                return brick;
            });

            // Update ball directions after brick collisions
            if (brickDestroyed && !activePowerUpsRef.current.fireball) {
                setBalls(prevBalls =>
                    prevBalls.map(ball => ({
                        ...ball,
                        dy: -ball.dy
                    }))
                );
            }

            return updatedBricks;
        });

        // Update power-ups
        setPowerUps(prev => {
            return prev.map(powerUp => ({
                ...powerUp,
                y: powerUp.y + powerUp.dy
            })).filter(powerUp => {
                const currentPaddle = paddleRef.current;
                // Check collision with paddle
                if (powerUp.y + powerUp.size >= currentPaddle.y &&
                    powerUp.y <= currentPaddle.y + PADDLE_HEIGHT &&
                    powerUp.x + powerUp.size >= currentPaddle.x &&
                    powerUp.x <= currentPaddle.x + currentPaddle.width) {
                    activatePowerUp(powerUp.type);
                    return false;
                }
                return powerUp.y < GAME_HEIGHT;
            });
        });

        // Update particles
        setParticles(prev => {
            return prev.map(particle => ({
                ...particle,
                x: particle.x + particle.dx,
                y: particle.y + particle.dy,
                life: particle.life - 1,
                dy: particle.dy + 0.1
            })).filter(particle => particle.life > 0);
        });

        // Check game conditions
        setTimeout(() => {
            // Check if all balls are gone
            if (ballsRef.current.length === 0) {
                if (activePowerUpsRef.current.shield) {
                    setActivePowerUps(prev => ({ ...prev, shield: false }));
                    setBalls([{
                        id: Math.random(),
                        x: GAME_WIDTH / 2,
                        y: GAME_HEIGHT - 100,
                        dx: 4 + level * 0.3,
                        dy: -4 - level * 0.3,
                        size: BALL_SIZE,
                        type: 'normal',
                        trail: []
                    }]);
                } else {
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) {
                            setGameState('gameOver');
                            setHighScore(prev => Math.max(prev, score));
                        } else {
                            setBalls([{
                                id: Math.random(),
                                x: GAME_WIDTH / 2,
                                y: GAME_HEIGHT - 100,
                                dx: 4 + level * 0.3,
                                dy: -4 - level * 0.3,
                                size: BALL_SIZE,
                                type: 'normal',
                                trail: []
                            }]);
                        }
                        return newLives;
                    });
                }
            }

            // Check victory condition
            const remainingBricks = bricksRef.current.filter(brick => !brick.destroyed);
            if (remainingBricks.length === 0 && gameStateRef.current === 'playing') {
                setGameState('victory');
                setLevel(prev => prev + 1);
                setScore(prev => prev + lives * 100);
            }
        }, 0);

    }, [level, lives, score]);

    // Paddle movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key] = true;

            if (e.key === ' ') {
                e.preventDefault();
                if (gameState === 'playing') {
                    setGameState('paused');
                } else if (gameState === 'paused') {
                    setGameState('playing');
                }
            }

            if (e.key === 'Enter' && activePowerUps.magneticPaddle) {
                setBalls(prev => prev.map(ball => ({
                    ...ball,
                    dy: ball.dy === 0 ? -Math.abs(ball.dx) : ball.dy
                })));
            }
        };

        const handleKeyUp = (e) => {
            keysRef.current[e.key] = false;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState, activePowerUps.magneticPaddle]);

    // Paddle movement loop
    useEffect(() => {
        let moveInterval;

        const movePaddle = () => {
            if (gameStateRef.current !== 'playing') return;

            if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
                setPaddle(prev => ({
                    ...prev,
                    x: Math.max(0, prev.x - 8)
                }));
            }
            if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
                setPaddle(prev => ({
                    ...prev,
                    x: Math.min(GAME_WIDTH - prev.width, prev.x + 8)
                }));
            }
        };

        if (gameState === 'playing') {
            moveInterval = setInterval(movePaddle, 16);
        }

        return () => {
            if (moveInterval) {
                clearInterval(moveInterval);
            }
        };
    }, [gameState]);

    // Animation loop
    useEffect(() => {
        if (gameState === 'playing') {
            animationRef.current = setInterval(gameLoop, 16);
        } else {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        }

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [gameLoop, gameState]);

    // Initialize game on level change
    useEffect(() => {
        if (gameState === 'victory') {
            const timeout = setTimeout(() => {
                initializeGame();
                setGameState('playing');
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [gameState, initializeGame]);

    const startGame = () => {
        setScore(0);
        setLevel(1);
        setLives(3);
        initializeGame();
        setGameState('playing');
    };

    const resetGame = () => {
        setGameState('menu');
        setScore(0);
        setLevel(1);
        setLives(3);
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
    };

    return (
        <>
            <MobileRestriction />
            <div className="hidden lg:block min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                            🧱 BRICK BREAKER 🚀
                        </h1>
                        <div className="flex justify-center items-center gap-8 text-white">
                            <div className="text-lg">Score: <span className="text-cyan-400 font-bold">{score}</span></div>
                            <div className="text-lg">Level: <span className="text-purple-400 font-bold">{level}</span></div>
                            <div className="text-lg">Lives: <span className="text-red-400 font-bold">{'❤️'.repeat(lives)}</span></div>
                            <div className="text-lg">High Score: <span className="text-yellow-400 font-bold">{highScore}</span></div>
                        </div>
                    </div>

                    {/* Active Power-ups Display */}
                    {Object.entries(activePowerUps).some(([_, active]) => active) && (
                        <div className="flex justify-center gap-4 mb-4">
                            {activePowerUps.multiball && <div className="bg-blue-500 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"><Target size={16} />Multi Ball</div>}
                            {activePowerUps.expandPaddle && <div className="bg-green-500 px-3 py-1 rounded-full text-white text-sm">Expand Paddle</div>}
                            {activePowerUps.fireball && <div className="bg-red-500 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"><Zap size={16} />Fireball</div>}
                            {activePowerUps.shield && <div className="bg-purple-500 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"><Shield size={16} />Shield</div>}
                            {activePowerUps.magneticPaddle && <div className="bg-yellow-500 px-3 py-1 rounded-full text-black text-sm">Magnetic</div>}
                        </div>
                    )}

                    {/* Game Area */}
                    <div className="flex justify-center">
                        <div
                            className="relative bg-black border-4 border-cyan-400 rounded-lg overflow-hidden shadow-2xl"
                            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                        >
                            {/* Game Objects Rendering */}
                            {gameState === 'playing' || gameState === 'paused' ? (
                                <>
                                    {/* Bricks */}
                                    {bricks.filter(brick => !brick.destroyed).map(brick => (
                                        <div
                                            key={brick.id}
                                            className={`absolute ${brick.color} ${brick.type === 'special' ? 'animate-pulse shadow-lg shadow-yellow-400' : ''}`}
                                            style={{
                                                left: brick.x,
                                                top: brick.y,
                                                width: brick.width,
                                                height: brick.height,
                                                opacity: brick.hits / brick.maxHits,
                                                border: brick.type === 'strong' ? '2px solid white' : 'none'
                                            }}
                                        />
                                    ))}

                                    {/* Paddle */}
                                    <div
                                        className={`absolute bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg ${activePowerUps.expandPaddle ? 'shadow-green-400' : ''} ${activePowerUps.magneticPaddle ? 'shadow-yellow-400' : ''}`}
                                        style={{
                                            left: paddle.x,
                                            top: paddle.y,
                                            width: paddle.width,
                                            height: PADDLE_HEIGHT
                                        }}
                                    />

                                    {/* Balls */}
                                    {balls.map(ball => (
                                        <div key={ball.id}>
                                            {/* Ball trail */}
                                            {ball.trail.map((pos, index) => (
                                                <div
                                                    key={index}
                                                    className={`absolute rounded-full ${activePowerUps.fireball ? 'bg-red-400' : 'bg-cyan-400'}`}
                                                    style={{
                                                        left: pos.x - ball.size / 2,
                                                        top: pos.y - ball.size / 2,
                                                        width: ball.size * (index / ball.trail.length),
                                                        height: ball.size * (index / ball.trail.length),
                                                        opacity: index / ball.trail.length * 0.5
                                                    }}
                                                />
                                            ))}
                                            {/* Ball */}
                                            <div
                                                className={`absolute rounded-full ${activePowerUps.fireball ? 'bg-red-500 shadow-lg shadow-red-400' : 'bg-cyan-400 shadow-lg shadow-cyan-400'}`}
                                                style={{
                                                    left: ball.x - ball.size / 2,
                                                    top: ball.y - ball.size / 2,
                                                    width: ball.size,
                                                    height: ball.size
                                                }}
                                            />
                                        </div>
                                    ))}

                                    {/* Power-ups */}
                                    {powerUps.map(powerUp => (
                                        <div
                                            key={powerUp.id}
                                            className={`absolute ${powerUp.color} rounded-full animate-bounce shadow-lg`}
                                            style={{
                                                left: powerUp.x - powerUp.size / 2,
                                                top: powerUp.y - powerUp.size / 2,
                                                width: powerUp.size,
                                                height: powerUp.size
                                            }}
                                        />
                                    ))}

                                    {/* Particles */}
                                    {particles.map(particle => (
                                        <div
                                            key={particle.id}
                                            className={`absolute ${particle.color} rounded-full`}
                                            style={{
                                                left: particle.x,
                                                top: particle.y,
                                                width: particle.size,
                                                height: particle.size,
                                                opacity: particle.life / particle.maxLife
                                            }}
                                        />
                                    ))}

                                    {/* Pause Overlay */}
                                    {gameState === 'paused' && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="text-white text-6xl font-bold">PAUSED</div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Menu/Game Over/Victory Screens */
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        {gameState === 'menu' && (
                                            <>
                                                <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                                    Ready to Break Some Bricks?
                                                </h2>
                                                <button
                                                    onClick={startGame}
                                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 flex items-center gap-2 mx-auto"
                                                >
                                                    <Play size={24} />
                                                    START GAME
                                                </button>
                                                <div className="mt-8 text-sm text-gray-400">
                                                    <p>🎮 Use Arrow Keys or A/D to move paddle</p>
                                                    <p>⏸️ Space to pause • 🧲 Enter to release magnetic ball</p>
                                                    <p>💎 Collect power-ups for special abilities!</p>
                                                </div>
                                            </>
                                        )}

                                        {gameState === 'gameOver' && (
                                            <>
                                                <h2 className="text-4xl font-bold mb-4 text-red-400">GAME OVER</h2>
                                                <p className="text-2xl mb-6">Final Score: {score}</p>
                                                <div className="flex gap-4 justify-center">
                                                    <button
                                                        onClick={startGame}
                                                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
                                                    >
                                                        <Play size={20} />
                                                        PLAY AGAIN
                                                    </button>
                                                    <button
                                                        onClick={resetGame}
                                                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
                                                    >
                                                        <RotateCcw size={20} />
                                                        MENU
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {gameState === 'victory' && (
                                            <>
                                                <h2 className="text-4xl font-bold mb-4 text-yellow-400">LEVEL COMPLETE! 🎉</h2>
                                                <p className="text-2xl mb-2">Score: {score}</p>
                                                <p className="text-lg mb-6">Preparing Level {level}...</p>
                                                <div className="animate-spin mx-auto w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Info */}
                    <div className="text-center mt-6 text-gray-400 text-sm">
                        <p>Controls: ← → or A/D (Move) • Space (Pause) • Enter (Release Magnetic Ball)</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BrickBreaker;