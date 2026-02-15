// ============================================
// ТИПЫ И ИНТЕРФЕЙСЫ ДЛЯ СИСТЕМЫ УПРАЖНЕНИЙ
// ============================================

/**
 * Основной тип активности
 */
export enum ActivityType {
  GYM = 'gym',              // Спортзал (силовые, тренажеры)
  COMBAT = 'combat',         // Единоборства
  ATHLETICS = 'athletics',   // Легкая атлетика
  AQUATIC = 'aquatic',       // Водные виды
  CYCLING = 'cycling',       // Велоспорт
  ROWING = 'rowing',         // Гребля
  GYMNASTICS = 'gymnastics', // Гимнастика
  TEAM_SPORTS = 'team_sports', // Командные игры
  TRIATHLON = 'triathlon',   // Триатлон
  FUNCTIONAL = 'functional', // Функциональный тренинг
}

/**
 * Группа мышц (для спортзала)
 */
export enum MuscleGroup {
  CHEST = 'chest',         // Грудь
  BACK = 'back',           // Спина
  LEGS = 'legs',           // Ноги
  SHOULDERS = 'shoulders', // Плечи
  BICEPS = 'biceps',       // Бицепс
  TRICEPS = 'triceps',     // Трицепс
  CORE = 'core',           // Пресс/кор
  CARDIO = 'cardio',       // Кардио
  FULL_BODY = 'full_body', // Все тело
}

/**
 * Спортивная дисциплина (для профильных упражнений)
 */
export enum SportDiscipline {
  // Легкая атлетика
  SPRINT = 'sprint',           // Спринт (100-400м)
  MIDDLE_DISTANCE = 'middle_distance', // Средние дистанции
  LONG_DISTANCE = 'long_distance',     // Длинные дистанции

  // Водные
  SWIMMING = 'swimming',       // Плавание

  // Единоборства
  BOXING = 'boxing',           // Бокс
  WRESTLING = 'wrestling',     // Борьба

  // Силовые
  WEIGHTLIFTING = 'weightlifting', // Тяжелая атлетика

  // Гимнастика
  ARTISTIC_GYM = 'artistic_gym', // Спортивная гимнастика

  // Командные
  SOCCER = 'soccer',           // Футбол
  BASKETBALL = 'basketball',   // Баскетбол

  // Другие
  TRACK_CYCLING = 'track_cycling', // Трек (велоспорт)
  ROAD_CYCLING = 'road_cycling',   // Шоссе (велоспорт)
  ROWING_SPORT = 'rowing_sport',   // Академическая гребля
  TRIATHLON_SPORT = 'triathlon_sport', // Триатлон
}

/**
 * Тип параметров упражнения
 */
export enum ParameterType {
  SETS_REPS = 'sets_reps',               // Подходы × Повторения
  SETS_REPS_WEIGHT = 'sets_reps_weight', // Подходы × Повторения + Вес
  DURATION = 'duration',                 // Только время
  DISTANCE_TIME = 'distance_time',       // Расстояние + Время
  DISTANCE = 'distance',                 // Только расстояние
  ROUNDS_DURATION = 'rounds_duration',   // Раунды × Время
}

/**
 * Уровень сложности
 */
export enum Difficulty {
  EASY = 'easy',       // Легкий
  MEDIUM = 'medium',   // Средний
  HARD = 'hard',       // Сложный
}

/**
 * Тип оборудования
 */
export enum Equipment {
  // Свободные веса
  BARBELL = 'barbell',
  DUMBBELL = 'dumbbell',
  KETTLEBELL = 'kettlebell',
  EZ_BAR = 'ez_bar',

  // Вес тела
  BODYWEIGHT = 'bodyweight',

  // Тренажеры
  MACHINE = 'machine',
  CABLE = 'cable',
  SMITH_MACHINE = 'smith_machine',

  // Кардио
  TREADMILL = 'treadmill',
  BIKE = 'bike',
  ROWER = 'rower',
  ELLIPTICAL = 'elliptical',
  STEPPER = 'stepper',

  // Другое
  BENCH = 'bench',
  PULL_UP_BAR = 'pull_up_bar',
  PARALLEL_BARS = 'parallel_bars',
  RINGS = 'rings',
  JUMP_ROPE = 'jump_rope',
  MEDICINE_BALL = 'medicine_ball',
  BOX = 'box',
  SLED = 'sled',
  BATTLE_ROPE = 'battle_rope',
  TRX = 'trx',
  NONE = 'none',
}

/**
 * МЕТ модификаторы для динамического расчета
 */
export interface METModifiers {
  byWeight?: {
    enabled: boolean;
    // Формула: baseMET + (weight_kg / bodyweight_kg) * modifier
    modifier: number;
  };
  bySpeed?: {
    enabled: boolean;
    // Таблица: скорость → MET
    speedTable: Array<{ speed: number; met: number }>;
  };
  byIntensity?: {
    enabled: boolean;
    // Легкая, средняя, высокая интенсивность
    intensityTable: { light: number; moderate: number; vigorous: number };
  };
}

/**
 * Дефолтные параметры упражнения
 */
export interface ExerciseDefaults {
  sets?: number;      // подходы
  reps?: number;      // повторения
  duration?: number;  // длительность (секунды)
  rest?: number;      // отдых между подходами (секунды)
  weight?: number;    // вес (кг)
  distance?: number;  // расстояние (метры)
  speed?: number;     // скорость (км/ч)
  intensity?: 'light' | 'moderate' | 'vigorous'; // интенсивность
}

/**
 * Основное упражнение
 */
export interface Exercise {
  // ===== Идентификация =====
  id: string;
  name: string;
  nameEn?: string; // английское название (опционально)
  emoji: string;

  // ===== Категоризация =====
  activityType: ActivityType;        // Основной тип
  muscleGroup?: MuscleGroup;          // Группа мышц (для GYM)
  discipline?: SportDiscipline;       // Спортивная дисциплина (опционально)

  // ===== Характеристики =====
  difficulty: Difficulty;
  equipment: Equipment;

  // ===== МЕТ для расчета калорий =====
  baseMET: number;                    // Базовый MET
  metModifiers?: METModifiers;        // Модификаторы MET

  // ===== Параметры упражнения =====
  parameterType: ParameterType;       // Какие параметры нужны
  defaults: ExerciseDefaults;         // Дефолтные значения

  // ===== Описание (опционально) =====
  description?: string;               // Краткое описание
  technique?: string;                 // Техника выполнения

  // ===== Теги для поиска =====
  tags?: string[];                    // ['explosive', 'power', 'legs']
}

/**
 * Упражнение в тренировке (создается пользователем)
 */
export interface WorkoutExercise {
  id: string;                  // Уникальный ID в тренировке
  exerciseId: string;          // Ссылка на базовое упражнение
  order: number;               // Порядок в тренировке

  // Параметры (заполняются пользователем)
  sets?: number;
  reps?: number;
  duration?: number;  // секунды
  rest: number;       // секунды между подходами
  weight?: number;    // кг
  distance?: number;  // метры
  speed?: number;     // км/ч
  intensity?: 'light' | 'moderate' | 'vigorous';

  // Расчетные значения (автоматически)
  estimatedCalories?: number;  // Рассчитанные калории
  estimatedDuration?: number;  // Общее время упражнения (секунды)
}

/**
 * Тренировка
 */
export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  createdAt: string;

  // Автоматически рассчитываемые
  totalDuration: number;      // Общее время (минуты)
  estimatedCalories: number;  // Общие калории
}

/**
 * Фильтры для поиска упражнений
 */
export interface ExerciseFilters {
  activityType?: ActivityType;
  muscleGroup?: MuscleGroup;
  discipline?: SportDiscipline;
  difficulty?: Difficulty;
  equipment?: Equipment;
  searchQuery?: string;
}
