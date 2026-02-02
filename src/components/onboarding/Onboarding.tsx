import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Scale, Dumbbell, Minus, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

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
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
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
              <div className="glass rounded-3xl p-5">
                <label className="text-caption text-muted-foreground block mb-4 text-center">
                  Возраст
                </label>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, age: Math.max(14, formData.age - 1) })}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                  >
                    <Minus size={24} />
                  </motion.button>
                  <span className="text-display-sm text-extralight">{formData.age}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, age: Math.min(100, formData.age + 1) })}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <label className="text-caption text-muted-foreground block mb-4 text-center">
                  Рост (см)
                </label>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, height: Math.max(140, formData.height - 1) })}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                  >
                    <Minus size={24} />
                  </motion.button>
                  <span className="text-display-sm text-extralight">{formData.height}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, height: Math.min(220, formData.height + 1) })}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <label className="text-caption text-muted-foreground block mb-4 text-center">
                  Вес (кг)
                </label>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, weight: Math.max(40, formData.weight - 1) })}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                  >
                    <Minus size={24} />
                  </motion.button>
                  <span className="text-display-sm text-extralight">{formData.weight}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, weight: Math.min(150, formData.weight + 1) })}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center"
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>
              </div>
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
