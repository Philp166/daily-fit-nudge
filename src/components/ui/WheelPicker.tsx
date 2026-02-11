import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface WheelPickerColumnProps {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  itemHeight?: number;
}

const RUBBER_RESISTANCE = 0.35;
const FRICTION = 0.94;
const VELOCITY_STOP = 0.1;
const SENSITIVITY = 1.4;

const triggerHaptic = () => {
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch {}
};

const safeNum = (n: number, fallback: number) => (typeof n === 'number' && !Number.isNaN(n) ? n : fallback);

const WheelPickerColumn: React.FC<WheelPickerColumnProps> = ({
  values,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  itemHeight = 44,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const startYRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const animationRef = useRef<number>();
  const lastHapticIndexRef = useRef(-1);

  // Cyclic: repeat values 3 times, start in the middle copy
  const repeat = 3;
  const cyclic = values.length >= 3;
  const extValues = cyclic
    ? Array.from({ length: values.length * repeat }, (_, i) => values[i % values.length])
    : values;
  const baseOffset = cyclic ? values.length : 0;

  const safeValue = safeNum(value, values[0] ?? 0);
  const visibleCount = 5;
  const totalHeight = itemHeight * visibleCount;
  const centerIndex = Math.floor(visibleCount / 2);
  const centerY = centerIndex * itemHeight;
  const halfItem = itemHeight / 2;
  const offsetForIndex = (i: number) => centerY - i * itemHeight;
  const indexFromOffset = (o: number) => Math.round((centerY - o) / itemHeight);
  const maxOffset = offsetForIndex(0);
  const minOffset = extValues.length <= 1 ? maxOffset : offsetForIndex(extValues.length - 1);

  const applyRubber = (raw: number) => {
    if (Number.isNaN(raw)) return maxOffset;
    if (!cyclic) {
      if (raw > maxOffset) return maxOffset + (raw - maxOffset) * RUBBER_RESISTANCE;
      if (raw < minOffset) return minOffset + (raw - minOffset) * RUBBER_RESISTANCE;
    }
    return raw;
  };

  const wrapOffset = (o: number) => {
    if (!cyclic) return o;
    const topBound = offsetForIndex(0);
    const bottomBound = offsetForIndex(extValues.length - 1);
    const oneSetHeight = values.length * itemHeight;
    if (o > topBound) o -= oneSetHeight;
    if (o < bottomBound + oneSetHeight) o += oneSetHeight;
    return o;
  };

  const clampToBounds = (raw: number) => {
    if (cyclic) return raw;
    const n = Number.isNaN(raw) ? 0 : raw;
    return Math.max(minOffset, Math.min(maxOffset, n));
  };

  // Check if current index changed and trigger haptic
  const checkHaptic = (o: number) => {
    const idx = indexFromOffset(o);
    if (idx !== lastHapticIndexRef.current) {
      lastHapticIndexRef.current = idx;
      triggerHaptic();
    }
  };

  useEffect(() => {
    if (values.length === 0) return;
    const currentIndex = values.indexOf(safeValue);
    const idx = baseOffset + Math.max(0, currentIndex >= 0 ? currentIndex : 0);
    const o = offsetForIndex(idx);
    setOffset(o);
    offsetRef.current = o;
    lastHapticIndexRef.current = idx;
    if (innerRef.current) innerRef.current.style.transform = `translateY(${o}px)`;
  }, [safeValue, values, itemHeight]);

  const resolveValue = (index: number) => {
    const realIdx = cyclic ? ((index % values.length) + values.length) % values.length : index;
    return values[Math.max(0, Math.min(realIdx, values.length - 1))];
  };

  const snapToIndex = (index: number, withAnimation = true) => {
    if (values.length === 0) return;
    let safeIndex = safeNum(index, 0);
    if (cyclic) {
      // Wrap to middle set
      while (safeIndex < baseOffset) safeIndex += values.length;
      while (safeIndex >= baseOffset + values.length) safeIndex -= values.length;
    } else {
      safeIndex = Math.max(0, Math.min(safeIndex, extValues.length - 1));
    }
    const clampedIndex = Math.floor(safeIndex);
    const targetOffset = offsetForIndex(clampedIndex);

    if (withAnimation) {
      const startOffset = offsetRef.current;
      const distance = targetOffset - startOffset;
      const duration = Math.min(350, Math.abs(safeNum(distance, 0)) * 0.6) || 180;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = startOffset + distance * easeOut;
        offsetRef.current = current;
        if (innerRef.current) innerRef.current.style.transform = `translateY(${current}px)`;
        setOffset(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          const val = resolveValue(clampedIndex);
          if (typeof val === 'number' && !Number.isNaN(val)) onChange(val);
        }
      };
      animate();
    } else {
      offsetRef.current = targetOffset;
      setOffset(targetOffset);
      const val = resolveValue(clampedIndex);
      if (typeof val === 'number' && !Number.isNaN(val)) onChange(val);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
    velocityRef.current = 0;
    lastMoveTimeRef.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const now = Date.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    const deltaY = (currentY - startYRef.current) * SENSITIVITY;
    let newOffset = applyRubber(offsetRef.current + deltaY);
    if (cyclic) newOffset = wrapOffset(newOffset);
    offsetRef.current = newOffset;
    if (innerRef.current) innerRef.current.style.transform = `translateY(${newOffset}px)`;
    checkHaptic(newOffset);
    startYRef.current = currentY;
    velocityRef.current = dt ? deltaY / dt : 0;
    lastMoveTimeRef.current = now;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const o = offsetRef.current;
    const v = velocityRef.current;
    const idx = Math.max(0, Math.min(extValues.length - 1, indexFromOffset(o)));
    if (!cyclic && (o > maxOffset || o < minOffset)) {
      snapToIndex(idx, true);
      return;
    }
    if (Math.abs(v) < 2) {
      snapToIndex(idx, true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsDragging(true);
    startYRef.current = e.clientY;
    velocityRef.current = 0;
    lastMoveTimeRef.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentY = e.clientY;
    const now = Date.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    const deltaY = (currentY - startYRef.current) * SENSITIVITY;
    let newOffset = applyRubber(offsetRef.current + deltaY);
    if (cyclic) newOffset = wrapOffset(newOffset);
    offsetRef.current = newOffset;
    if (innerRef.current) innerRef.current.style.transform = `translateY(${newOffset}px)`;
    checkHaptic(newOffset);
    startYRef.current = currentY;
    velocityRef.current = dt ? deltaY / dt : 0;
    lastMoveTimeRef.current = now;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const o = offsetRef.current;
    const v = velocityRef.current;
    const idx = Math.max(0, Math.min(extValues.length - 1, indexFromOffset(o)));
    if (!cyclic && (o > maxOffset || o < minOffset)) {
      snapToIndex(idx, true);
      return;
    }
    if (Math.abs(v) < 2) {
      snapToIndex(idx, true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as unknown as (e: MouseEvent) => void);
      document.addEventListener('mouseup', handleMouseUp as unknown as () => void);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as unknown as (e: MouseEvent) => void);
        document.removeEventListener('mouseup', handleMouseUp as unknown as () => void);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) return;
    let v = velocityRef.current;
    if (Math.abs(v) < VELOCITY_STOP) return;

    const run = () => {
      v *= FRICTION;
      velocityRef.current = v;
      let o = offsetRef.current + v * SENSITIVITY;
      if (cyclic) {
        o = wrapOffset(o);
      } else {
        o = clampToBounds(o);
      }
      if (o !== offsetRef.current) {
        offsetRef.current = o;
        if (innerRef.current) innerRef.current.style.transform = `translateY(${o}px)`;
        checkHaptic(o);
      }
      if (Math.abs(v) >= VELOCITY_STOP) {
        animationRef.current = requestAnimationFrame(run);
      } else {
        const idx = Math.max(0, Math.min(extValues.length - 1, indexFromOffset(offsetRef.current)));
        snapToIndex(idx, true);
      }
    };
    animationRef.current = requestAnimationFrame(run);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden flex-1 min-w-[72px] flex flex-col items-center justify-center py-4"
      style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: totalHeight, width: '100%', maxWidth: 96 }}
      >
        <div
          className="absolute left-0 right-0 border-t border-b border-foreground/20 pointer-events-none z-10"
          style={{ top: centerY, height: itemHeight }}
        />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />

        <div
          ref={innerRef}
          className="flex flex-col"
          style={{ transform: `translateY(${offset}px)`, willChange: isDragging ? 'transform' : 'auto' }}
        >
          {extValues.map((val, index) => {
            const safeVal = safeNum(val, values[0] ?? 0);
            const itemOffset = index * itemHeight;
            const itemCenterY = offset + itemOffset + halfItem;
            const slotCenterY = centerY + halfItem;
            const distanceFromCenter = Math.abs(itemCenterY - slotCenterY);
            const opacity = Math.max(0.3, 1 - distanceFromCenter / (itemHeight * 2));
            const scale = Math.max(0.8, 1 - distanceFromCenter / (itemHeight * 3));
            return (
              <div
                key={index}
                className="flex items-center justify-center text-display-sm text-extralight select-none"
                style={{ height: itemHeight, opacity, transform: `scale(${scale})` }}
              >
                {formatValue(safeVal)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface WheelPickerProps {
  isOpen: boolean;
  onClose: () => void;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  formatValue?: (value: number) => string;
  unit?: string;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  formatValue,
  unit,
}) => {
  const safeMin = safeNum(min, 0);
  const safeMax = safeNum(max, 100);
  const values: number[] = [];
  for (let i = safeMin; i <= safeMax; i += step) {
    values.push(i);
  }
  const defaultValue = values.length ? values[0] : safeMin;
  const [localValue, setLocalValue] = useState(() => safeNum(value, defaultValue));

  // Block body scroll when picker is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const v = safeNum(value, defaultValue);
      setLocalValue(values.includes(v) ? v : defaultValue);
    }
  }, [isOpen, value, defaultValue]);

  const handleConfirm = () => {
    const v = safeNum(localValue, defaultValue);
    onChange(values.includes(v) ? v : defaultValue);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, localValue]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 right-0 bg-background rounded-t-3xl z-[9999] pb-safe-bottom"
            style={{ bottom: 0 }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <button
                type="button"
                onClick={onClose}
                className="text-body text-muted-foreground"
              >
                Отмена
              </button>
              <h3 className="text-body font-medium text-foreground">{label}</h3>
              <button
                type="button"
                onClick={handleConfirm}
                className="text-body text-primary font-medium"
              >
                Готово
              </button>
            </div>
            <div className="px-5 py-6">
              <div className="flex items-center justify-center gap-2 min-h-[260px]">
                <WheelPickerColumn
                  values={values}
                  value={safeNum(localValue, defaultValue)}
                  onChange={(v) => setLocalValue(safeNum(v, defaultValue))}
                  formatValue={formatValue}
                />
                {unit && (
                  <span className="text-display-sm text-extralight text-muted-foreground">
                    {unit}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

interface TimeWheelPickerProps {
  isOpen: boolean;
  onClose: () => void;
  value: number; // total seconds
  onChange: (value: number) => void;
  label: string;
  maxSeconds?: number;
  minSeconds?: number;
}

export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  label,
  maxSeconds = 59 * 60 + 59,
  minSeconds = 0,
}) => {
  const safeValue = safeNum(value, 0);
  const [localMinutes, setLocalMinutes] = useState(0);
  const [localSeconds, setLocalSeconds] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const total = Math.min(Math.max(0, safeValue), maxSeconds);
      setLocalMinutes(Math.floor(total / 60));
      setLocalSeconds(total % 60);
    }
  }, [isOpen, safeValue, maxSeconds]);

  // Block body scroll when picker is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const maxMinutes = Math.floor(maxSeconds / 60);
  const minutes = Array.from({ length: Math.min(maxMinutes + 1, 60) }, (_, i) => i);
  const seconds = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const m = safeNum(localMinutes, 0);
    const s = safeNum(localSeconds, 0);
    const total = Math.min(m * 60 + s, maxSeconds);
    onChange(Math.max(minSeconds, total));
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, localMinutes, localSeconds]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 right-0 bg-background rounded-t-3xl z-[9999] pb-safe-bottom"
            style={{ bottom: 0 }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <button
                type="button"
                onClick={onClose}
                className="text-body text-muted-foreground"
              >
                Отмена
              </button>
              <h3 className="text-body font-medium text-foreground">{label}</h3>
              <button
                type="button"
                onClick={handleConfirm}
                className="text-body text-primary font-medium"
              >
                Готово
              </button>
            </div>
            <div className="px-5 py-6">
              <div className="flex items-center justify-center gap-4 min-h-[260px]">
                <WheelPickerColumn
                  values={minutes}
                  value={safeNum(localMinutes, 0)}
                  onChange={(v) => setLocalMinutes(Math.max(0, Math.min(maxMinutes, safeNum(v, 0))))}
                  formatValue={(v) => safeNum(v, 0).toString().padStart(2, '0')}
                />
                <div className="flex items-center justify-center self-stretch min-h-[220px]" aria-hidden="true">
                  <span className="text-display-sm text-extralight text-muted-foreground">:</span>
                </div>
                <WheelPickerColumn
                  values={seconds}
                  value={safeNum(localSeconds, 0)}
                  onChange={(v) => setLocalSeconds(Math.max(0, Math.min(59, safeNum(v, 0))))}
                  formatValue={(v) => safeNum(v, 0).toString().padStart(2, '0')}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
