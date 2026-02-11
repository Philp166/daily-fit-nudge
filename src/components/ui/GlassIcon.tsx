import React from 'react';
import {
  Scale,
  Timer,
  Target,
  Trophy,
  Sparkles,
  TrendingUp,
  Play,
  Calendar,
  Star,
  Medal,
  Hand
} from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';
import LightningIcon from '@/components/ui/LightningIcon';
import FlameIcon from '@/components/ui/FlameIcon';
import HeartIcon from '@/components/ui/HeartIcon';
import ActivityIcon from '@/components/ui/ActivityIcon';
import ClockIcon from '@/components/ui/ClockIcon';

export type IconName = 
  | 'flame' 
  | 'scale' 
  | 'dumbbell' 
  | 'zap' 
  | 'heart' 
  | 'timer'
  | 'target'
  | 'trophy'
  | 'sparkles'
  | 'trending'
  | 'activity'
  | 'play'
  | 'calendar'
  | 'clock'
  | 'star'
  | 'medal'
  | 'wave'
  | 'hand';

interface GlassIconProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const iconMap = {
  scale: Scale,
  timer: Timer,
  target: Target,
  trophy: Trophy,
  sparkles: Sparkles,
  trending: TrendingUp,
  play: Play,
  calendar: Calendar,
  star: Star,
  medal: Medal,
  hand: Hand,
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const GlassIcon: React.FC<GlassIconProps> = ({ name, size = 'md', className = '' }) => {
  const isCustomIcon = name === 'dumbbell' || name === 'zap' || name === 'flame' || name === 'heart' || name === 'activity' || name === 'wave' || name === 'clock';
  const IconComponent = isCustomIcon ? null : (iconMap[name as keyof typeof iconMap] || null);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-xl
        glass
        flex items-center justify-center
        ${className}
      `}
    >
      {name === 'dumbbell' ? (
        <DumbbellIcon size={iconSizes[size]} />
      ) : name === 'zap' ? (
        <LightningIcon size={iconSizes[size]} />
      ) : name === 'flame' ? (
        <FlameIcon size={iconSizes[size]} />
      ) : name === 'heart' ? (
        <HeartIcon size={iconSizes[size]} />
      ) : name === 'activity' || name === 'wave' ? (
        <ActivityIcon size={iconSizes[size]} />
      ) : name === 'clock' ? (
        <ClockIcon size={iconSizes[size]} />
      ) : (
        IconComponent && <IconComponent
          size={iconSizes[size]}
          className="text-primary"
          strokeWidth={1.5}
        />
      )}
    </div>
  );
};

export default GlassIcon;
