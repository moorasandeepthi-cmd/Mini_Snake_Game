import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const speed = 120;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
    const progress = timestamp - lastUpdateRef.current;

    if (progress > speed) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center justify-center p-4 crt-flicker">
      <div className="mb-6 flex w-full items-center justify-between px-2 border-b-2 border-magenta pb-2">
        <div className="pixel-text text-xl jarring-cyan">
          DATA_UNITS: {score.toString().padStart(4, '0')}
        </div>
        <div className="pixel-text text-[8px] jarring-magenta animate-pulse">
          STATUS: {gameOver ? 'TERMINATED' : isPaused ? 'HALTED' : 'EXECUTING'}
        </div>
      </div>

      <div 
        className="relative bg-[#0a0a0a] glitch-border overflow-hidden"
        style={{ 
          width: GRID_SIZE * 16, 
          height: GRID_SIZE * 16,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines for retro feel */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan" />
          ))}
        </div>

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`z-10 ${i === 0 ? 'bg-cyan' : 'bg-magenta'} border border-black`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
              width: '100%', 
              height: '100%' 
            }}
          />
        ))}

        {/* Food */}
        <div
          className="z-10 bg-yellow animate-ping"
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1,
            width: '100%', 
            height: '100%' 
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90"
            >
              {gameOver ? (
                <>
                  <h2 className="pixel-text mb-6 text-2xl jarring-magenta screen-tear">SYSTEM_FAILURE</h2>
                  <button
                    onClick={resetGame}
                    className="pixel-text border-2 border-cyan px-6 py-3 text-xs text-cyan hover:bg-cyan hover:text-black transition-all"
                  >
                    REBOOT_CORE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="pixel-text mb-6 text-2xl jarring-cyan">PROCESS_SUSPENDED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="pixel-text border-2 border-magenta px-6 py-3 text-xs text-magenta hover:bg-magenta hover:text-black transition-all"
                  >
                    RESUME_LINK
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pixel-text text-[10px] text-cyan/40">
        CMD: [UP][DOWN][LEFT][RIGHT] | [SPACE]_PAUSE
      </div>
    </div>
  );
};
