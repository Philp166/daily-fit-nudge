# 📚 База Упражнений Interfit

## 🏗️ Структура

```
src/data/exercises/
├── index.ts                 # Главный файл, объединяет все упражнения
│
├── gym/                     # Спортзал
│   ├── chest.ts            # Грудь (14 упражнений)
│   ├── back.ts             # Спина (15 упражнений)
│   ├── legs.ts             # Ноги (18 упражнений)
│   ├── shoulders.ts        # Плечи (12 упражнений)
│   ├── biceps.ts           # Бицепс (14 упражнений)
│   ├── triceps.ts          # Трицепс (11 упражнений)
│   ├── core.ts             # Пресс (12 упражнений)
│   └── cardio.ts           # Кардио (20 упражнений)
│
├── combat/                  # Единоборства
│   ├── boxing.ts           # Бокс (7 упражнений)
│   └── wrestling.ts        # Борьба (6 упражнений)
│
├── athletics/               # Легкая атлетика
│   ├── sprint.ts           # Спринт (13 упражнений)
│   ├── middle-distance.ts  # Средние дистанции (5 упражнений)
│   └── long-distance.ts    # Длинные дистанции (5 упражнений)
│
├── aquatic/                 # Водные виды
│   └── swimming.ts         # Плавание (7 упражнений)
│
├── cycling/                 # Велоспорт
│   ├── track.ts            # Трек (5 упражнений)
│   └── road.ts             # Шоссе (6 упражнений)
│
├── rowing/                  # Гребля
│   └── rowing.ts           # Академическая гребля (6 упражнений)
│
├── functional/              # Функциональный тренинг
│   └── hiit.ts             # HIIT (8 упражнений)
│
└── README.md               # Этот файл
```

## 📊 Текущая статистика

**Всего упражнений:** 184

**По категориям:**
- Спортзал (GYM): 116
  - Грудь: 14
  - Спина: 15
  - Ноги: 18
  - Плечи: 12
  - Бицепс: 14
  - Трицепс: 11
  - Пресс: 12
  - Кардио: 20
- Единоборства (COMBAT): 13
  - Бокс: 7
  - Борьба: 6
- Легкая атлетика (ATHLETICS): 23
  - Спринт: 13
  - Средние дистанции: 5
  - Длинные дистанции: 5
- Водные виды (AQUATIC): 7
  - Плавание: 7
- Велоспорт (CYCLING): 11
  - Шоссе: 6
  - Трек: 5
- Гребля (ROWING): 6
  - Академическая гребля: 6
- Функциональный (FUNCTIONAL): 8
  - HIIT: 8

## 🔧 Использование

### Импорт всех упражнений

```typescript
import { ALL_EXERCISES } from '@/data/exercises';
```

### Получение упражнения по ID

```typescript
import { getExerciseById } from '@/data/exercises';

const exercise = getExerciseById('barbell-bench-press');
```

### Фильтрация упражнений

```typescript
import { filterExercises } from '@/data/exercises';
import { ActivityType, MuscleGroup } from '@/types/exercise';

// Все упражнения на грудь
const chestExercises = filterExercises({
  activityType: ActivityType.GYM,
  muscleGroup: MuscleGroup.CHEST,
});

// Поиск по названию
const squats = filterExercises({
  searchQuery: 'приседания',
});
```

### Получение упражнений по категории

```typescript
import {
  getExercisesByActivity,
  getExercisesByMuscleGroup,
  getExercisesByDiscipline,
} from '@/data/exercises';
import { ActivityType, MuscleGroup, SportDiscipline } from '@/types/exercise';

// Все упражнения для спортзала
const gymExercises = getExercisesByActivity(ActivityType.GYM);

// Все упражнения на грудь
const chestExercises = getExercisesByMuscleGroup(MuscleGroup.CHEST);

// Все упражнения для бокса
const boxingExercises = getExercisesByDiscipline(SportDiscipline.BOXING);
```

### Поиск

```typescript
import { searchExercises } from '@/data/exercises';

const results = searchExercises('жим');
// Найдет: "Жим штанги лежа", "Жим гантелей лежа", "Жим в хаммере" и т.д.
```

### Расчет калорий

```typescript
import { calculateExerciseCalories } from '@/utils/exerciseCalculations';
import { getExerciseById } from '@/data/exercises';

const exercise = getExerciseById('barbell-bench-press')!;
const workoutExercise = {
  id: 'workout-ex-1',
  exerciseId: 'barbell-bench-press',
  order: 1,
  sets: 4,
  reps: 10,
  rest: 120,
  weight: 80,
  intensity: 'vigorous' as const,
};

const userWeight = 75; // кг
const calories = calculateExerciseCalories(exercise, workoutExercise, userWeight);
// Вернет: ~85 ккал
```

### Форматирование параметров

```typescript
import { formatExerciseParams } from '@/utils/exerciseCalculations';

const paramsString = formatExerciseParams(exercise, workoutExercise);
// Вернет: "4 × 10 • 80 кг"
```

## 📝 Добавление новых упражнений

### Шаг 1: Создать файл в нужной категории

Например, `src/data/exercises/gym/back.ts`:

```typescript
import type { Exercise } from '@/types/exercise';
import {
  ActivityType,
  MuscleGroup,
  Difficulty,
  Equipment,
  ParameterType,
} from '@/types/exercise';

export const backExercises: Exercise[] = [
  {
    id: 'pull-ups',
    name: 'Подтягивания',
    nameEn: 'Pull-ups',
    emoji: '🦾',
    activityType: ActivityType.GYM,
    muscleGroup: MuscleGroup.BACK,
    difficulty: Difficulty.MEDIUM,
    equipment: Equipment.PULL_UP_BAR,
    baseMET: 8.0,
    parameterType: ParameterType.SETS_REPS,
    defaults: {
      sets: 3,
      reps: 10,
      rest: 120,
    },
    description: 'Ширина спины',
    tags: ['compound', 'bodyweight', 'back-width'],
  },
  // ... другие упражнения
];
```

### Шаг 2: Импортировать в index.ts

```typescript
// В src/data/exercises/index.ts

import { backExercises } from './gym/back';

export const ALL_EXERCISES: Exercise[] = [
  // ...
  ...backExercises,
  // ...
];
```

## 🎨 Цветовая схема для UI

```typescript
import { MUSCLE_GROUP_META, ACTIVITY_TYPE_META } from '@/data/exercises';

// Получить цвет для группы мышц
const chestColor = MUSCLE_GROUP_META[MuscleGroup.CHEST].color; // '#F5941D'

// Получить emoji для типа активности
const gymEmoji = ACTIVITY_TYPE_META[ActivityType.GYM].emoji; // '🏋️'
```

## 🧮 Типы параметров упражнений

| ParameterType | Параметры | Пример |
|---------------|-----------|--------|
| `SETS_REPS` | подходы × повторения | Отжимания: 3 × 15 |
| `SETS_REPS_WEIGHT` | подходы × повторения + вес | Жим: 4 × 10 • 80 кг |
| `DURATION` | время | Планка: 60 сек |
| `DISTANCE_TIME` | расстояние + время | Бег: 5 км • 25:00 |
| `DISTANCE` | расстояние | Прыжки в длину: 8 попыток |
| `ROUNDS_DURATION` | раунды × время | Бокс: 3 раунда × 3 мин |

## 📈 Система MET (Metabolic Equivalent)

Базовые значения MET для расчета калорий:

- **Легкие упражнения:** 3.0-5.0 (ходьба, планка, изоляция)
- **Средние упражнения:** 5.0-8.0 (бег, силовые, базовые)
- **Интенсивные упражнения:** 8.0-12.0 (спринт, HIIT, гребля)
- **Максимальные:** 12.0+ (спринт 100м, интервалы)

### MET Модификаторы

**По интенсивности:**
```typescript
metModifiers: {
  byIntensity: {
    enabled: true,
    intensityTable: {
      light: 3.5,     // 30-50% 1RM
      moderate: 5.0,  // 50-70% 1RM
      vigorous: 6.5,  // 70%+ 1RM
    },
  },
}
```

**По скорости (кардио):**
```typescript
metModifiers: {
  bySpeed: {
    enabled: true,
    speedTable: [
      { speed: 4, met: 3.0 },   // Ходьба
      { speed: 8, met: 8.3 },   // Бег средний
      { speed: 12, met: 12.3 }, // Спринт
    ],
  },
}
```

## ✅ Правила добавления упражнений

1. **Уникальный ID:** Используй kebab-case, например `barbell-bench-press`
2. **Emoji:** Один релевантный emoji для визуализации
3. **MET значение:** Реальное значение из научных источников
4. **Дефолты:** Адекватные начальные значения для новичков
5. **Теги:** Минимум 2-3 тега для поиска
6. **Описание:** Краткое, одно предложение
7. **Без дубликатов:** Проверь, нет ли уже такого упражнения

## 🔍 Поиск по тегам

Примеры тегов:
- `compound` - базовое/многосуставное
- `isolation` - изолированное
- `explosive` - взрывное
- `power` - силовое
- `strength` - на силу
- `mass` - на массу
- `endurance` - на выносливость
- `cardio` - кардио
- `hiit` - высокоинтенсивное
- `plyometric` - плиометрика
- `bodyweight` - со своим весом
- `beginner` - для новичков
- `advanced` - для продвинутых

## 📚 Источники MET значений

- [Compendium of Physical Activities](https://sites.google.com/site/compendiumofphysicalactivities/)
- [ACSM Guidelines](https://www.acsm.org/)
- [NIH Exercise Guidelines](https://www.nhlbi.nih.gov/)
