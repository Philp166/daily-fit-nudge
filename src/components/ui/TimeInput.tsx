import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TimeWheelPicker } from './WheelPicker';

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

  // Format ЧЧ:ММ:СС (consistent with Timer Background Rule)
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  maxSeconds = 59 * 60 + 59,
  minSeconds = 0,
  showHours = false,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
      <div className="glass rounded-3xl p-5">
        <p className="text-caption text-muted-foreground mb-4 text-center">{label}</p>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="w-full text-display-sm text-extralight text-foreground px-4 py-3 rounded-xl hover:bg-muted transition-colors flex items-center justify-center active:scale-[0.98]"
          style={{ touchAction: 'manipulation' }}
        >
          {displayTime}
        </button>
      </div>
      <TimeWheelPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        value={value}
        onChange={onChange}
        label={label}
        maxSeconds={maxSeconds}
        minSeconds={minSeconds}
      />
    </>
  );
};

export default TimeInput;
