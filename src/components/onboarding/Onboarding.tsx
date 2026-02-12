import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Onboarding: React.FC = () => {
  const { setProfile } = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    avatar: 'male-1',
    age: '',
    height: '',
    weight: '',
    goal: 'lose' as 'lose' | 'maintain' | 'gain',
  });

  // Refs for autofocus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);

  // Autofocus on mount and step change
  useEffect(() => {
    if (step === 0 && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (step === 3 && ageInputRef.current) {
      ageInputRef.current.focus();
    }
  }, [step]);

  const avatarOptions = [1, 2, 3, 4, 5, 6].map(n => `${formData.gender}-${n}`);

  const handleSubmit = () => {
    setProfile({
      name: formData.name.trim(),
      gender: formData.gender,
      avatar: formData.avatar,
      age: parseInt(formData.age) || 25,
      height: parseInt(formData.height) || 170,
      weight: parseInt(formData.weight) || 70,
      goal: formData.goal,
      dailyCalorieGoal: 0, // Will be calculated
    });
  };

  const goals = [
    {
      value: 'lose',
      label: 'Похудеть',
      icon: <Flame size={28} className="text-orange-500" />,
    },
    {
      value: 'maintain',
      label: 'Поддерживать форму',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
      ),
    },
    {
      value: 'gain',
      label: 'Набрать массу',
      icon: <TrendingUp size={28} className="text-blue-500" />,
    },
  ];

  const isStepValid = () => {
    if (step === 0) return formData.name.trim().length > 0;
    if (step === 3) return formData.age && formData.height && formData.weight;
    return true;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-safe-top pb-safe-bottom" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === step ? 'bg-blue-500 w-6' : i < step ? 'bg-blue-300' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col justify-center"
      >
        {/* Step 0: Name */}
        {step === 0 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
              Как вас зовут?
            </h1>

            <input
              ref={nameInputRef}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && formData.name.trim()) {
                  setStep(step + 1);
                }
              }}
              placeholder="Введите имя"
              className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
            />
          </>
        )}

        {/* Step 1: Gender */}
        {step === 1 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
              Ваш пол
            </h1>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'male', avatar: 'male-1' })}
                className={`w-full py-6 px-6 rounded-3xl text-left transition-all flex items-center gap-4 text-lg font-medium ${
                  formData.gender === 'male'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-700'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="text-3xl">♂</span>
                <span>Мужской</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'female', avatar: 'female-1' })}
                className={`w-full py-6 px-6 rounded-3xl text-left transition-all flex items-center gap-4 text-lg font-medium ${
                  formData.gender === 'female'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-700'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="text-3xl">♀</span>
                <span>Женский</span>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Avatar */}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
              Выберите аватар
            </h1>

            <div className="grid grid-cols-3 gap-6">
              {avatarOptions.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: av })}
                  className={`aspect-square rounded-full overflow-hidden transition-all ${
                    formData.avatar === av
                      ? 'ring-4 ring-blue-500'
                      : 'ring-0'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}avatars/${av}.png`}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Personal Data */}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3 text-center">
              Расскажите о себе
            </h1>
            <p className="text-gray-500 mb-12 text-center">
              Эти данные нужны для расчета калорий
            </p>

            <div className="space-y-4">
              <input
                ref={ageInputRef}
                type="number"
                inputMode="numeric"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Возраст"
                className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
              />

              <input
                type="number"
                inputMode="numeric"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="Рост"
                className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
              />

              <input
                type="number"
                inputMode="numeric"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Вес"
                className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
              />
            </div>
          </>
        )}

        {/* Step 4: Goal */}
        {step === 4 && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
              Ваша цель
            </h1>

            <div className="space-y-4">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: goal.value as typeof formData.goal })}
                  className={`w-full py-6 px-6 rounded-3xl text-left transition-all flex items-center gap-4 text-lg font-medium ${
                    formData.goal === goal.value
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center justify-center w-12 h-12">
                    {goal.icon}
                  </div>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="pt-6 pb-6">
        <button
          type="button"
          onClick={() => {
            if (step < 4) {
              setStep(step + 1);
            } else {
              handleSubmit();
            }
          }}
          disabled={!isStepValid()}
          className="w-full py-5 rounded-full bg-blue-500 text-white text-lg font-semibold disabled:opacity-40 active:scale-[0.98] transition-all shadow-sm"
          style={{ touchAction: 'manipulation' }}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
