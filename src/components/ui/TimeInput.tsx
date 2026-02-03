import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface TimeInputProps {
  value: number; // total seconds
  onChange: (value: number) => void;
  label: string;
  maxSeconds?: number; // max in seconds (default 3600 = 1 hour)
  minSeconds?: number; // min in seconds (default 0)
  showHours?: boolean;
}

export const formatTimeDisplay = (totalSeconds: number, showHours = false): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (showHours || hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatTimeCompact = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  } else if (minutes > 0) {
    return `${minutes}м ${seconds}с`;
  }
  return `${seconds}с`;
};

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  maxSeconds = 3600,
  minSeconds = 0,
  showHours = false,
}) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  const [editingField, setEditingField] = useState<'hours' | 'minutes' | 'seconds' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const updateTime = (h: number, m: number, s: number) => {
    const total = h * 3600 + m * 60 + s;
    onChange(Math.max(minSeconds, Math.min(maxSeconds, total)));
  };

  const handleFieldClick = (field: 'hours' | 'minutes' | 'seconds', currentValue: number) => {
    setEditingField(field);
    setInputValue(currentValue.toString());
  };

  const handleBlur = () => {
    if (editingField) {
      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) {
        let h = hours, m = minutes, s = seconds;
        if (editingField === 'hours') {
          h = Math.max(0, Math.min(23, parsed));
        } else if (editingField === 'minutes') {
          m = Math.max(0, Math.min(59, parsed));
        } else {
          s = Math.max(0, Math.min(59, parsed));
        }
        updateTime(h, m, s);
      }
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const increment = (amount: number) => {
    onChange(Math.min(maxSeconds, Math.max(minSeconds, value + amount)));
  };

  const showHoursField = showHours || hours > 0 || maxSeconds >= 3600;

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-caption text-muted-foreground mb-3 text-center">{label}</p>
      <div className="flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => increment(-5)}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
        >
          <Minus size={24} />
        </motion.button>

        <div className="flex items-center gap-1">
          {showHoursField && (
            <>
              {editingField === 'hours' ? (
                <input
                  ref={inputRef}
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-12 text-center text-display-sm text-extralight bg-transparent outline-none border-b-2 border-primary"
                  min={0}
                  max={23}
                />
              ) : (
                <span
                  onClick={() => handleFieldClick('hours', hours)}
                  className="text-display-sm text-extralight cursor-pointer hover:text-primary transition-colors"
                >
                  {hours.toString().padStart(2, '0')}
                </span>
              )}
              <span className="text-display-sm text-extralight text-muted-foreground">:</span>
            </>
          )}

          {editingField === 'minutes' ? (
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-12 text-center text-display-sm text-extralight bg-transparent outline-none border-b-2 border-primary"
              min={0}
              max={59}
            />
          ) : (
            <span
              onClick={() => handleFieldClick('minutes', minutes)}
              className="text-display-sm text-extralight cursor-pointer hover:text-primary transition-colors"
            >
              {minutes.toString().padStart(2, '0')}
            </span>
          )}

          <span className="text-display-sm text-extralight text-muted-foreground">:</span>

          {editingField === 'seconds' ? (
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-12 text-center text-display-sm text-extralight bg-transparent outline-none border-b-2 border-primary"
              min={0}
              max={59}
            />
          ) : (
            <span
              onClick={() => handleFieldClick('seconds', seconds)}
              className="text-display-sm text-extralight cursor-pointer hover:text-primary transition-colors"
            >
              {seconds.toString().padStart(2, '0')}
            </span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => increment(5)}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
        >
          <Plus size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default TimeInput;
