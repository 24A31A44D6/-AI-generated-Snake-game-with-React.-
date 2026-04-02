import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
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

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, generateFood, onScoreChange]);

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
          if (gameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    const tick = (time: number) => {
      if (time - lastUpdateRef.current > 150) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative w-full max-w-[400px] aspect-square bg-black border-4 border-cyan rounded-none overflow-hidden shadow-[8px_8px_0_var(--color-magenta)]">
      {/* Grid Background */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-cyan/30" />
        ))}
      </div>

      {/* Snake */}
      {snake.map((segment, i) => (
        <motion.div
          key={`${i}-${segment.x}-${segment.y}`}
          initial={false}
          animate={{
            left: `${(segment.x / GRID_SIZE) * 100}%`,
            top: `${(segment.y / GRID_SIZE) * 100}%`,
          }}
          className={`absolute w-[5%] h-[5%] rounded-none ${
            i === 0 ? 'bg-cyan shadow-[0_0_10px_var(--color-cyan)] z-10' : 'bg-cyan/60'
          }`}
          transition={{ type: 'tween', duration: 0.1 }}
        />
      ))}

      {/* Food */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
        style={{
          left: `${(food.x / GRID_SIZE) * 100}%`,
          top: `${(food.y / GRID_SIZE) * 100}%`,
        }}
        className="absolute w-[5%] h-[5%] bg-magenta shadow-[0_0_15px_var(--color-magenta)]"
      />

      {/* Overlays */}
      <AnimatePresence>
        {(gameOver || isPaused) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 p-6 text-center font-pixel"
          >
            {gameOver ? (
              <>
                <h2 className="text-2xl font-bold text-magenta mb-4 glitch-box" data-text="CRITICAL_ERROR">CRITICAL_ERROR</h2>
                <p className="text-cyan text-[10px] mb-8 tracking-widest">FINAL_YIELD: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-magenta text-black hover:bg-cyan transition-all font-bold text-[10px] tracking-tighter"
                >
                  REBOOT_CORE
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-cyan mb-8 tracking-tighter">IDLE_STATE</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-cyan text-black hover:bg-magenta transition-all font-bold text-[10px] tracking-tighter"
                >
                  RESUME_PROCESS
                </button>
                <p className="mt-6 text-[8px] text-magenta animate-pulse uppercase tracking-[0.3em]">Awaiting User Input</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
