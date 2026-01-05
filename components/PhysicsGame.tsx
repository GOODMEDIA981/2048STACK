
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { GAME_WIDTH, GAME_HEIGHT, SPAWN_Y, LOSE_LINE_Y, CIRCLE_DEFS, NEXT_TILE_PROBS } from '../constants';
import { GameStats } from '../types';
import { soundService } from '../services/soundService';

interface PhysicsGameProps {
  onUpdateStats: (stats: Partial<GameStats>) => void;
  isGameOver: boolean;
  onReset: () => void;
  continueToken?: number;
}

const PhysicsGame: React.FC<PhysicsGameProps> = ({ onUpdateStats, isGameOver, onReset, continueToken = 0 }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [nextValue, setNextValue] = useState<number>(2);
  const [mousePos, setMousePos] = useState({ x: GAME_WIDTH / 2, y: SPAWN_Y });
  const [canDrop, setCanDrop] = useState(true);
  const [isPopping, setIsPopping] = useState(false);
  
  const scoreRef = useRef(0);
  const highestRef = useRef(2);
  const gameOverTimerRef = useRef<number | null>(null);

  // The floor is at the bottom of the canvas
  const FLOOR_Y = GAME_HEIGHT;

  // Handle Continue: Remove half the circles on board (prioritizing top ones)
  useEffect(() => {
    if (continueToken > 0 && engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const circles = bodies.filter(b => b.label === 'circle');
      
      if (circles.length > 0) {
        const sortedCircles = [...circles].sort((a, b) => a.position.y - b.position.y);
        const removeCount = Math.ceil(sortedCircles.length / 2);
        const toRemove = sortedCircles.slice(0, removeCount);
        Matter.World.remove(engineRef.current.world, toRemove);
      }
      
      if (gameOverTimerRef.current) {
        clearTimeout(gameOverTimerRef.current);
        gameOverTimerRef.current = null;
      }
    }
  }, [continueToken]);

  const spawnCircle = (x: number, y: number, value: number, isStatic = false) => {
    const def = CIRCLE_DEFS[value] || CIRCLE_DEFS[2];
    const circle = Matter.Bodies.circle(x, y, def.radius, {
      restitution: 0.3,
      friction: 0.05,
      isStatic,
      label: 'circle',
      plugin: { value },
      render: {
        fillStyle: def.color,
        strokeStyle: def.borderColor,
        lineWidth: 6 
      }
    });
    return circle;
  };

  const handleMerge = (bodyA: Matter.Body, bodyB: Matter.Body) => {
    if (!engineRef.current) return;
    const value = bodyA.plugin.value;
    const newValue = value * 2;
    
    const newX = (bodyA.position.x + bodyB.position.x) / 2;
    const newY = (bodyA.position.y + bodyB.position.y) / 2;

    Matter.World.remove(engineRef.current.world, [bodyA, bodyB]);
    
    scoreRef.current += newValue;
    if (newValue > highestRef.current) highestRef.current = newValue;
    onUpdateStats({ score: scoreRef.current, highestTile: highestRef.current });
    
    soundService.playMerge(newValue);

    if (newValue <= 2048) {
      const merged = spawnCircle(newX, newY, newValue);
      Matter.World.add(engineRef.current.world, merged);
    } else {
      scoreRef.current += newValue * 2;
      onUpdateStats({ score: scoreRef.current });
    }
  };

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create({ enableSleeping: false });
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        wireframes: false,
        background: 'transparent'
      }
    });

    const wallOptions = { isStatic: true, render: { visible: false } };
    const ground = Matter.Bodies.rectangle(GAME_WIDTH / 2, FLOOR_Y + 25, GAME_WIDTH, 50, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-25, GAME_HEIGHT / 2, 50, GAME_HEIGHT, wallOptions);
    const rightWall = Matter.Bodies.rectangle(GAME_WIDTH + 25, GAME_HEIGHT / 2, 50, GAME_HEIGHT, wallOptions);
    
    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label === 'circle' && bodyB.label === 'circle') {
          if (bodyA.plugin.value === bodyB.plugin.value) {
            handleMerge(bodyA, bodyB);
          }
        }
      });
    });

    Matter.Events.on(engine, 'afterUpdate', () => {
      const circles = engine.world.bodies.filter(b => b.label === 'circle' && !b.isStatic);
      const isOverflowing = circles.some(c => c.position.y < LOSE_LINE_Y && Math.abs(c.velocity.y) < 0.2);
      
      if (isOverflowing && !gameOverTimerRef.current) {
        gameOverTimerRef.current = window.setTimeout(() => {
          onUpdateStats({ isGameOver: true });
        }, 1000);
      } else if (!isOverflowing && gameOverTimerRef.current) {
        clearTimeout(gameOverTimerRef.current);
        gameOverTimerRef.current = null;
      }
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    engineRef.current = engine;
    renderRef.current = render;
    runnerRef.current = runner;

    const customRenderer = () => {
      const context = render.context;
      const bodies = Matter.Composite.allBodies(engine.world);
      
      context.font = 'bold 20px Inter, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      bodies.forEach(body => {
        if (body.label === 'circle') {
          const value = body.plugin.value;
          context.fillStyle = '#ffffff'; 
          context.fillText(value.toString(), body.position.x, body.position.y);
        }
      });

      context.beginPath();
      context.setLineDash([10, 5]);
      context.strokeStyle = 'rgba(255, 255, 255, 0.4)'; 
      context.lineWidth = 2;
      context.moveTo(0, LOSE_LINE_Y);
      context.lineTo(GAME_WIDTH, LOSE_LINE_Y);
      context.stroke();
      context.setLineDash([]);
      context.closePath();

      context.beginPath();
      context.strokeStyle = '#ffffff';
      context.lineWidth = 2;
      context.moveTo(0, FLOOR_Y - 1);
      context.lineTo(GAME_WIDTH, FLOOR_Y - 1);
      context.stroke();
      context.closePath();
    };

    Matter.Events.on(render, 'afterRender', customRenderer);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      if (gameOverTimerRef.current) clearTimeout(gameOverTimerRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isGameOver) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let x = 0;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
    } else {
      x = e.clientX - rect.left;
    }
    
    const radius = CIRCLE_DEFS[nextValue].radius;
    x = Math.max(radius, Math.min(GAME_WIDTH - radius, x));
    setMousePos({ x, y: SPAWN_Y });
  };

  const handleDrop = () => {
    if (isGameOver || !canDrop || !engineRef.current) return;
    
    soundService.playDrop();
    const circle = spawnCircle(mousePos.x, SPAWN_Y, nextValue);
    Matter.World.add(engineRef.current.world, circle);
    
    const nextIdx = Math.floor(Math.random() * NEXT_TILE_PROBS.length);
    const newValue = NEXT_TILE_PROBS[nextIdx];
    
    setIsPopping(true);
    setNextValue(newValue);
    setTimeout(() => setIsPopping(false), 200);
    
    setCanDrop(false);
    setTimeout(() => {
      setCanDrop(true);
    }, 150);
  };

  const currentDef = CIRCLE_DEFS[nextValue];

  return (
    <div className="relative cursor-crosshair select-none" onMouseMove={handleMouseMove} onClick={handleDrop} onTouchMove={handleMouseMove} onTouchEnd={handleDrop}>
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .preview-pulse {
          animation: subtle-pulse 2s infinite ease-in-out;
        }
        .preview-pop {
          animation: pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      
      {!isGameOver && (
        <div 
          className={`absolute pointer-events-none rounded-full flex items-center justify-center font-bold shadow-2xl ${isPopping ? 'preview-pop' : 'preview-pulse'}`}
          style={{
            left: mousePos.x - currentDef.radius,
            top: SPAWN_Y - currentDef.radius,
            width: currentDef.radius * 2,
            height: currentDef.radius * 2,
            backgroundColor: currentDef.color,
            borderColor: currentDef.borderColor,
            borderWidth: '6px',
            color: '#ffffff',
            opacity: 0.9,
            transition: 'background-color 0.2s, width 0.2s, height 0.2s, left 0.05s linear',
            boxShadow: `0 0 20px ${currentDef.color}66, 0 10px 30px rgba(0,0,0,0.4)`,
            fontSize: `${currentDef.radius * 0.8}px`,
            zIndex: 10
          }}
        >
          {nextValue}
        </div>
      )}

      <div ref={sceneRef} className="overflow-hidden bg-blue-950/20 backdrop-blur-sm rounded-xl shadow-2xl border-[6px] border-white/90" />
    </div>
  );
};

export default PhysicsGame;