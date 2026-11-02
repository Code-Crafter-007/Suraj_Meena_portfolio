
'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';
import styles from './Footer.module.css';

const LETTERS = ['S', 'U', 'R', 'A', 'J'];

interface LetterBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVelocity: number;
  baseX: number;
  baseY: number;
  width: number;
  height: number;
  awake: boolean;
}

const GRAVITY = 1900;
const AIR_RESISTANCE = 0.995;
const FLOOR_BOUNCE = 0.25;
const WALL_BOUNCE = 0.4;
const JUMP_IMPULSE = 1800;
const INTERACTION_RADIUS = 190;

export const InteractiveWordmark: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodies = useRef<LetterBody[]>([]);

  const animationRef = useRef<number | null>(null);
  const previousTime = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });

  const shouldReduceMotion = useReducedMotion();

  // Individual motion values
  const x0 = useMotionValue(0);
  const x1 = useMotionValue(0);
  const x2 = useMotionValue(0);
  const x3 = useMotionValue(0);
  const x4 = useMotionValue(0);

  const y0 = useMotionValue(0);
  const y1 = useMotionValue(0);
  const y2 = useMotionValue(0);
  const y3 = useMotionValue(0);
  const y4 = useMotionValue(0);

  const r0 = useMotionValue(0);
  const r1 = useMotionValue(0);
  const r2 = useMotionValue(0);
  const r3 = useMotionValue(0);
  const r4 = useMotionValue(0);

  const xValues = [x0, x1, x2, x3, x4];
  const yValues = [y0, y1, y2, y3, y4];
  const rotationValues = [r0, r1, r2, r3, r4];

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    previousTime.current = 0;
  }, []);

  // Measure letters in coordinates relative to the physics container
  const measureLetters = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    bodies.current = letterRefs.current.map((el) => {
      if (!el) {
        return {
          x: 0, y: 0, vx: 0, vy: 0,
          rotation: 0, angularVelocity: 0,
          baseX: 0, baseY: 0,
          width: 0, height: 0, awake: false,
        };
      }

      const rect = el.getBoundingClientRect();

      return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotation: 0,
        angularVelocity: 0,
        baseX: rect.left + rect.width / 2 - containerRect.left,
        baseY: rect.top + rect.height / 2 - containerRect.top,
        width: rect.width,
        height: rect.height,
        awake: false,
      };
    });
  }, []);

  // Physical simulation
  const animate = useCallback((time: number) => {
    const container = containerRef.current;

    if (!container) {
      animationRef.current = null;
      return;
    }

    const dt = Math.min(
      (time - (previousTime.current || time)) / 1000,
      0.025
    );

    previousTime.current = time;

    const rect = container.getBoundingClientRect();
    const list = bodies.current;

    let active = false;

    list.forEach((body, index) => {
      if (!body.awake) return;

      const halfWidth = body.width / 2;
      const halfHeight = body.height / 2;

      // Local boundaries: plenty of room above the resting letters.
      const minX = halfWidth - body.baseX;
      const maxX = rect.width - halfWidth - body.baseX;

      const minY = -Math.min(250, Math.max(130, rect.height - halfHeight));
      const maxY = 20;

      // Gravity and air resistance
      body.vy += GRAVITY * dt;
      body.vx *= AIR_RESISTANCE;
      body.vy *= AIR_RESISTANCE;

      // Update position and rotation
      body.x += body.vx * dt;
      body.y += body.vy * dt;

      body.rotation += body.angularVelocity * dt;
      body.angularVelocity *= 0.985;

      // Horizontal boundaries
      if (body.x < minX) {
        body.x = minX;
        body.vx = Math.abs(body.vx) * WALL_BOUNCE;
        body.angularVelocity += 20;
      }

      if (body.x > maxX) {
        body.x = maxX;
        body.vx = -Math.abs(body.vx) * WALL_BOUNCE;
        body.angularVelocity -= 20;
      }

      // Upper boundary
      if (body.y < minY) {
        body.y = minY;
        body.vy = Math.abs(body.vy) * 0.3;
      }

      // Lower boundary
      if (body.y > maxY) {
        body.y = maxY;

        if (Math.abs(body.vy) > 55) {
          body.vy = -body.vy * FLOOR_BOUNCE;
        } else {
          body.vy = 0;
        }

        body.vx *= 0.9;
        body.angularVelocity *= 0.8;
      }

      xValues[index].set(body.x);
      yValues[index].set(body.y);
      rotationValues[index].set(body.rotation);

      // Settle naturally at the final position
      if (
        Math.abs(body.vx) < 3 &&
        Math.abs(body.vy) < 3 &&
        Math.abs(body.angularVelocity) < 2 &&
        body.y >= maxY - 0.5
      ) {
        body.vx = 0;
        body.vy = 0;
        body.angularVelocity = 0;
        body.awake = false;
      } else {
        active = true;
      }
    });

    // Basic letter collision response
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];

        if (!a.awake && !b.awake) continue;

        const dx = (b.baseX + b.x) - (a.baseX + a.x);
        const dy = (b.baseY + b.y) - (a.baseY + a.y);

        const distance = Math.hypot(dx, dy) || 0.001;

        const radiusA = Math.min(a.width, a.height) * 0.3;
        const radiusB = Math.min(b.width, b.height) * 0.3;
        const minDistance = radiusA + radiusB;

        if (distance < minDistance) {
          const overlap = minDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;

          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;

          b.x += nx * overlap * 0.5;
          b.y += ny * overlap * 0.5;

          a.vx -= nx * 45;
          a.vy -= ny * 45;

          b.vx += nx * 45;
          b.vy += ny * 45;

          a.awake = true;
          b.awake = true;
          active = true;
        }
      }
    }

    // Apply positions again after collision response
    list.forEach((body, index) => {
      xValues[index].set(body.x);
      yValues[index].set(body.y);
      rotationValues[index].set(body.rotation);
    });

    if (active) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = null;
      previousTime.current = 0;
    }
  }, [xValues, yValues, rotationValues]);

  const startAnimation = useCallback(() => {
    if (animationRef.current === null) {
      previousTime.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Initial measurements and resize handling
  useEffect(() => {
    if (shouldReduceMotion) return;

    const frame = requestAnimationFrame(measureLetters);

    const handleResize = () => {
      stopAnimation();
      measureLetters();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      stopAnimation();
    };
  }, [measureLetters, shouldReduceMotion, stopAnimation]);

  // Cursor applies physical force rather than a hover animation
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || e.pointerType !== 'mouse') return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const now = performance.now();
      const previous = lastPointer.current;
      const elapsed = Math.max((now - previous.time) / 1000, 0.001);

      const pointerVX = Math.max(
        -1800,
        Math.min(1800, (pointerX - previous.x) / elapsed)
      );

      const pointerVY = Math.max(
        -1800,
        Math.min(1800, (pointerY - previous.y) / elapsed)
      );

      lastPointer.current = {
        x: pointerX,
        y: pointerY,
        time: now,
      };

      bodies.current.forEach((body) => {
        const centerX = body.baseX + body.x;
        const centerY = body.baseY + body.y;

        const dx = centerX - pointerX;
        const dy = centerY - pointerY;

        const distance = Math.hypot(dx, dy) || 0.001;

        if (distance > INTERACTION_RADIUS) return;

        const proximity = 1 - distance / INTERACTION_RADIUS;
        const power = Math.pow(proximity, 1.4);

        const nx = dx / distance;
        const ny = dy / distance;

        // Strong upward impulse
        body.vy -= JUMP_IMPULSE * power;

        // Sideways movement away from cursor
        body.vx += nx * 400 * power;
        body.vx -= pointerVX * 0.1 * power;

        // Slight vertical cursor influence
        body.vy -= pointerVY * 0.04 * power;

        // Rotation impulse
        body.angularVelocity +=
          (nx * 140 + pointerVX * 0.018) * power;

        // Extra jump when cursor is very close
        if (distance < 65) {
          body.vy -= 220 * power;
          body.vx += nx * 100 * power;
        }

        body.awake = true;
      });

      startAnimation();
    },
    [shouldReduceMotion, startAnimation]
  );

  return (
    <div
      ref={containerRef}
      className={styles.wordmarkWrap}
      onPointerMove={handlePointerMove}
      role="img"
      aria-label="SURAJ"
    >
      <div className={styles.wordmark}>
        {LETTERS.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            className={styles.interactiveLetter}
            style={{
              x: shouldReduceMotion ? 0 : xValues[index],
              y: shouldReduceMotion ? 0 : yValues[index],
              rotate: shouldReduceMotion ? 0 : rotationValues[index],
            }}
            aria-hidden="true"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};
