import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Scale, Dumbbell, Minus, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import GlassIcon from '@/components/ui/GlassIcon';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = () => {
    setInputValue(value.toString());
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="glass rounded-3xl p-5">
      <label className="text-caption text-muted-foreground block mb-4 text-center">
        {label}
      </label>
      <div className="flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
        >
          <Minus size={24} />
        </motion.button>
        
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-24 text-center text-display-sm text-extralight bg-transparent border-b-2 border-primary outline-none"
            min={min}
            max={max}
          />
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStartEdit}
            className="text-display-sm text-extralight px-4 py-2 rounded-xl hover:bg-card/50 transition-colors"
          >
            {value}
          </motion.button>
        )}
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
        >
          <Plus size={24} />
        </motion.button>
      </div>
    </div>
  );
};

const Onboarding: React.FC = () => {
  const { setProfile } = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    goal: 'maintain' as 'lose' | 'maintain' | 'gain',
  });

  const handleSubmit = () => {
    setProfile({
      ...formData,
      name: formData.name.trim(), // Sanitize whitespace
      dailyCalorieGoal: 0, // Will be calculated
    });
  };

  const goals = [
    { 
      value: 'lose', 
      label: 'Похудеть', 
      icon: <Flame size={24} className="text-primary" />, 
      desc: 'Сжигать больше калорий' 
    },
    { 
      value: 'maintain', 
      label: 'Поддержать форму', 
      icon: <Scale size={24} className="text-primary" />, 
      desc: 'Оставаться в тонусе' 
    },
    { 
      value: 'gain', 
      label: 'Набрать массу', 
      icon: <Dumbbell size={24} className="text-primary" />, 
      desc: 'Наращивать мышцы' 
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-safe-top pb-safe-bottom">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 flex flex-col"
      >
        {step === 0 && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <GlassIcon name="sparkles" size="lg" />
              <h1 className="text-display-sm text-extralight text-foreground">
                Привет!
              </h1>
            </div>
            <p className="text-body text-muted-foreground mb-8">
              Как тебя зовут?
            </p>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введи имя"
              className="w-full py-4 px-5 bg-card rounded-3xl text-foreground text-title outline-none border border-border focus:border-primary transition-colors"
            />
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-display-sm text-extralight text-foreground mb-2">
              О тебе
            </h1>
            <p className="text-body text-muted-foreground mb-8">
              Эти данные нужны для расчёта калорий
            </p>

            <div className="space-y-4">
              <NumberInput
                label="Возраст"
                value={formData.age}
                onChange={(age) => setFormData({ ...formData, age })}
                min={14}
                max={100}
              />

              <NumberInput
                label="Рост (см)"
                value={formData.height}
                onChange={(height) => setFormData({ ...formData, height })}
                min={140}
                max={220}
              />

              <NumberInput
                label="Вес (кг)"
                value={formData.weight}
                onChange={(weight) => setFormData({ ...formData, weight })}
                min={40}
                max={200}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-display-sm text-extralight text-foreground mb-2">
              Твоя цель
            </h1>
            <p className="text-body text-muted-foreground mb-8">
              Что хочешь достичь?
            </p>

            <div className="space-y-3">
              {goals.map((goal) => (
                <motion.button
                  key={goal.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, goal: goal.value as typeof formData.goal })}
                  className={`w-full p-5 rounded-3xl text-left transition-colors ${
                    formData.goal === goal.value
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'glass border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                      {goal.icon}
                    </div>
                    <div>
                      <p className="text-body text-foreground">{goal.label}</p>
                      <p className="text-caption text-muted-foreground">{goal.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="pt-4 pb-4">
        {step < 2 ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !formData.name.trim()}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-body disabled:opacity-50"
          >
            Далее
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-body"
          >
            Начать
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
