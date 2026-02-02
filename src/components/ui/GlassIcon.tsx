import React from 'react';
import { 
  Flame, 
  Scale, 
  Dumbbell, 
  Zap, 
  Heart, 
  Timer, 
  Target,
  Trophy,
  Sparkles,
  TrendingUp,
  Activity,
  Play,
  Calendar,
  Clock,
  Star,
  Medal,
  Hand
} from 'lucide-react';

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
  flame: Flame,
  scale: Scale,
  dumbbell: Dumbbell,
  zap: Zap,
  heart: Heart,
  timer: Timer,
  target: Target,
  trophy: Trophy,
  sparkles: Sparkles,
  trending: TrendingUp,
  activity: Activity,
  play: Play,
  calendar: Calendar,
  clock: Clock,
  star: Star,
  medal: Medal,
  wave: Activity,
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
  const IconComponent = iconMap[name] || Activity;
  
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
      <IconComponent 
        size={iconSizes[size]} 
        className="text-primary" 
        strokeWidth={1.5}
      />
    </div>
  );
};

export default GlassIcon;
