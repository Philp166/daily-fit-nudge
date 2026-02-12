import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [validationErrors, setValidationErrors] = useState<{
    age: 'min' | 'max' | null;
    height: 'min' | 'max' | null;
    weight: 'min' | 'max' | null;
  }>({
    age: null,
    height: null,
    weight: null,
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

  // Clamp number to range
  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const handleNumberInput = (field: 'age' | 'height' | 'weight', value: string) => {
    // Allow empty string or valid number
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, [field]: value });

      // Check if value is outside valid range
      const numValue = parseInt(value) || 0;
      let errorType: 'min' | 'max' | null = null;

      if (field === 'age') {
        if (numValue > 0 && numValue < 6) errorType = 'min';
        else if (numValue > 150) errorType = 'max';
      } else if (field === 'height') {
        if (numValue > 0 && numValue < 100) errorType = 'min';
        else if (numValue > 250) errorType = 'max';
      } else if (field === 'weight') {
        if (numValue > 0 && numValue < 20) errorType = 'min';
        else if (numValue > 280) errorType = 'max';
      }

      setValidationErrors({ ...validationErrors, [field]: errorType });
    }
  };

  const handleSubmit = () => {
    // Clamp values to valid ranges
    const age = clamp(parseInt(formData.age) || 25, 6, 150);
    const height = clamp(parseInt(formData.height) || 170, 100, 250);
    const weight = clamp(parseInt(formData.weight) || 70, 20, 280);

    setProfile({
      name: formData.name.trim(),
      gender: formData.gender,
      avatar: formData.avatar,
      age,
      height,
      weight,
      goal: formData.goal,
      dailyCalorieGoal: 0, // Will be calculated
    });
  };

  const goals = [
    {
      value: 'lose',
      label: 'Похудеть',
      icon: '🔥',
    },
    {
      value: 'maintain',
      label: 'Поддерживать форму',
      icon: '💪',
    },
    {
      value: 'gain',
      label: 'Набрать массу',
      icon: '📈',
    },
  ];

  const isStepValid = () => {
    if (step === 0) return formData.name.trim().length > 0;
    if (step === 3) {
      const age = parseInt(formData.age);
      const height = parseInt(formData.height);
      const weight = parseInt(formData.weight);
      return age >= 6 && age <= 150 && height >= 100 && height <= 250 && weight >= 20 && weight <= 280;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-8 px-6" style={{ paddingTop: 'max(env(safe-area-inset-top, 20px), 20px)' }}>
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
        className="flex-1 flex flex-col justify-center px-6"
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
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  formData.gender === 'male' ? 'bg-white' : 'bg-white/50'
                }`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="14" r="6"/>
                    <line x1="14.5" y1="9.5" x2="20" y2="4"/>
                    <line x1="17" y1="4" x2="20" y2="4"/>
                    <line x1="20" y1="4" x2="20" y2="7"/>
                  </svg>
                </div>
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
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  formData.gender === 'female' ? 'bg-white' : 'bg-white/50'
                }`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/>
                    <line x1="12" y1="14" x2="12" y2="21"/>
                    <line x1="9" y1="18" x2="15" y2="18"/>
                  </svg>
                </div>
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
              <div>
                <input
                  ref={ageInputRef}
                  type="number"
                  inputMode="numeric"
                  min="6"
                  max="150"
                  value={formData.age}
                  onChange={(e) => handleNumberInput('age', e.target.value)}
                  placeholder="Возраст"
                  className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
                />
                {validationErrors.age === 'min' && (
                  <p className="text-red-500 text-sm mt-2 px-2">Минимум: 6</p>
                )}
                {validationErrors.age === 'max' && (
                  <p className="text-red-500 text-sm mt-2 px-2">Максимум: 150</p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  inputMode="numeric"
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={(e) => handleNumberInput('height', e.target.value)}
                  placeholder="Рост"
                  className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
                />
                {validationErrors.height === 'min' && (
                  <p className="text-red-500 text-sm mt-2 px-2">Минимум: 100</p>
                )}
                {validationErrors.height === 'max' && (
                  <p className="text-red-500 text-sm mt-2 px-2">Максимум: 250</p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  inputMode="numeric"
                  min="20"
                  max="280"
                  value={formData.weight}
                  onChange={(e) => handleNumberInput('weight', e.target.value)}
                  placeholder="Вес"
                  className="w-full py-5 px-6 bg-gray-100 rounded-3xl text-gray-900 text-lg outline-none focus:bg-gray-200 transition-colors"
                />
                {validationErrors.weight === 'min' && (
                  <p className="text-red-500 text-sm mt-2 px-2">Минимум: 20</p>
                )}
                {validationErrors.weight === 'max' && (
                  <p className="text-red-500 text-sm mt-2 px-2">Максимум: 280</p>
                )}
              </div>
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
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    formData.goal === goal.value ? 'bg-white' : 'bg-white/50'
                  }`}>
                    <span className="text-2xl">{goal.icon}</span>
                  </div>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="pt-6 px-6 pb-8">
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
