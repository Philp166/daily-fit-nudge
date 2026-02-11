import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import DumbbellIcon from '@/components/ui/DumbbellIcon';
import FlameIcon from '@/components/ui/FlameIcon';
import { useUser } from '@/contexts/UserContext';
import GlassIcon from '@/components/ui/GlassIcon';
import { WheelPicker } from '@/components/ui/WheelPicker';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max, label, unit }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
        <label className="text-caption text-muted-foreground block mb-4 text-center">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="w-full text-display-sm text-extralight px-4 py-3 rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
          style={{ touchAction: 'manipulation' }}
        >
          <span className="text-foreground">{value}</span>
          {unit && <span className="text-muted-foreground">{unit}</span>}
        </button>
      </div>
      <WheelPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        label={label}
        unit={unit}
      />
    </>
  );
};

const Onboarding: React.FC = () => {
  const { setProfile } = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    avatar: 'male-1',
    age: 25,
    height: 170,
    weight: 70,
    goal: 'maintain' as 'lose' | 'maintain' | 'gain',
  });

  const avatarOptions = [1, 2, 3, 4, 5, 6].map(n => `${formData.gender}-${n}`);

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
      icon: <FlameIcon size={24} />,
      desc: 'Сжигать больше калорий'
    },
    {
      value: 'maintain',
      label: 'Поддержать форму',
      icon: <Scale size={24} className="text-foreground/70" />,
      desc: 'Оставаться в тонусе'
    },
    {
      value: 'gain',
      label: 'Набрать массу',
      icon: <DumbbellIcon size={24} />,
      desc: 'Наращивать мышцы'
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-safe-top pb-safe-bottom">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-6">
        {[0, 1, 2, 3, 4].map((i) => (
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
        className="flex-1 flex flex-col justify-center"
      >
        {step === 0 && (
          <>
            <div className="flex flex-col items-center mb-3">
              <picture>
                <source srcSet={`${import.meta.env.BASE_URL}hello.webp`} type="image/webp" />
                <img
                  src={`${import.meta.env.BASE_URL}hello.png`}
                  alt=""
                  width={120}
                  height={120}
                  className="mb-2"
                  style={{ objectFit: 'contain' }}
                  draggable={false}
                />
              </picture>
              <h1 className="text-display-sm text-extralight text-foreground">
                Привет!
              </h1>
            </div>
            <p className="text-body text-muted-foreground mb-4">
              Как тебя зовут?
            </p>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && formData.name.trim()) {
                  setStep(step + 1);
                }
              }}
              placeholder="Введи имя"
              className="w-full py-4 px-5 bg-card rounded-3xl text-foreground text-title outline-none border-2 border-border focus:border-primary transition-colors shadow-sm"
            />
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-display-sm text-extralight text-foreground mb-2">
              Твой пол
            </h1>
            <p className="text-body text-muted-foreground mb-8">
              Нужно для точного расчёта калорий
            </p>

            <div className="space-y-3">
              {([
                { value: 'male', label: 'Мужской', emoji: '♂' },
                { value: 'female', label: 'Женский', emoji: '♀' },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: option.value, avatar: `${option.value}-1` })}
                  className={`w-full p-5 rounded-3xl text-left transition-all active:scale-[0.98] ${
                    formData.gender === option.value
                      ? 'bg-primary/20 border-2 border-primary shadow-md'
                      : 'bg-card border-2 border-transparent shadow-sm'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <span className="text-2xl">{option.emoji}</span>
                    </div>
                    <p className="text-body text-foreground">{option.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-display-sm text-extralight text-foreground mb-2">
              Твой аватар
            </h1>
            <p className="text-body text-muted-foreground mb-8">
              Выбери персонажа
            </p>

            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: av })}
                  className={`aspect-square rounded-full overflow-hidden border-4 transition-all active:scale-[0.95] ${
                    formData.avatar === av
                      ? 'border-primary shadow-lg scale-105'
                      : 'border-transparent'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}avatars/${av}.webp`}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
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
                unit="лет"
              />

              <NumberInput
                label="Рост"
                value={formData.height}
                onChange={(height) => setFormData({ ...formData, height })}
                min={140}
                max={220}
                unit="см"
              />

              <NumberInput
                label="Вес"
                value={formData.weight}
                onChange={(weight) => setFormData({ ...formData, weight })}
                min={40}
                max={200}
                unit="кг"
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-display-sm text-extralight text-foreground mb-2">
              Твоя цель
            </h1>
            <p className="text-body text-muted-foreground mb-8">
              Что хочешь достичь?
            </p>

            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: goal.value as typeof formData.goal })}
                  className={`w-full p-5 rounded-3xl text-left transition-all active:scale-[0.98] ${
                    formData.goal === goal.value
                      ? 'bg-primary/20 border-2 border-primary shadow-md'
                      : 'bg-card border-2 border-transparent shadow-sm'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      {goal.icon}
                    </div>
                    <div>
                      <p className="text-body text-foreground">{goal.label}</p>
                      <p className="text-caption text-muted-foreground">{goal.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="pt-4 pb-4">
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !formData.name.trim()}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold disabled:opacity-50 active:scale-[0.98] transition-transform shadow-lg"
            style={{ touchAction: 'manipulation' }}
          >
            Далее
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold active:scale-[0.98] transition-transform shadow-lg"
            style={{ touchAction: 'manipulation' }}
          >
            Начать
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
