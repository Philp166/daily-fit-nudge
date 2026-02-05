import '../core/models/workout_exercise.dart';

/// Preset workout (matches web Workout: id, name, category, difficulty, exercises, totalDuration, estimatedCalories).
class Workout {
  final String id;
  final String name;
  final String category;
  final String difficulty; // 'Лёгкая' | 'Средняя' | 'Сложная'
  final List<WorkoutExercise> exercises;
  final int totalDuration; // minutes
  final int estimatedCalories;

  const Workout({
    required this.id,
    required this.name,
    required this.category,
    required this.difficulty,
    required this.exercises,
    required this.totalDuration,
    required this.estimatedCalories,
  });
}

/// Categories for filter (matches web workoutCategories).
const List<String> workoutCategories = [
  'Все',
  'Утренняя зарядка',
  'Кардио',
  'Силовая',
  'HIIT',
  'Растяжка',
  'Йога',
  'Для пресса',
  'Для ног',
  'Полное тело',
];

/// All 11 preset workouts from web data/workouts.ts.
final List<Workout> presetWorkouts = [
  Workout(
    id: 'morning-warmup',
    name: 'Утренняя разминка',
    category: 'Утренняя зарядка',
    difficulty: 'Лёгкая',
    totalDuration: 15,
    estimatedCalories: 85,
    exercises: [
      const WorkoutExercise(exerciseId: 'arm-circles', sets: 2, workTime: 30, restTime: 10),
      const WorkoutExercise(exerciseId: 'jumping-jacks', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'squats', sets: 2, workTime: 45, restTime: 15),
      const WorkoutExercise(exerciseId: 'forward-fold', sets: 2, workTime: 30, restTime: 10),
      const WorkoutExercise(exerciseId: 'high-knees', sets: 2, workTime: 30, restTime: 15),
    ],
  ),
  Workout(
    id: 'hiit-burner',
    name: 'HIIT Жиросжигание',
    category: 'HIIT',
    difficulty: 'Сложная',
    totalDuration: 25,
    estimatedCalories: 280,
    exercises: [
      const WorkoutExercise(exerciseId: 'burpees', sets: 4, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'squat-jumps', sets: 4, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'mountain-climbers', sets: 4, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'lunge-jumps', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'sprint-in-place', sets: 3, workTime: 30, restTime: 15),
    ],
  ),
  Workout(
    id: 'core-power',
    name: 'Мощный пресс',
    category: 'Для пресса',
    difficulty: 'Средняя',
    totalDuration: 20,
    estimatedCalories: 120,
    exercises: [
      const WorkoutExercise(exerciseId: 'plank', sets: 3, workTime: 45, restTime: 15),
      const WorkoutExercise(exerciseId: 'crunches', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'bicycle-crunches', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'leg-raises', sets: 3, workTime: 35, restTime: 15),
      const WorkoutExercise(exerciseId: 'russian-twist', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'flutter-kicks', sets: 2, workTime: 30, restTime: 10),
    ],
  ),
  Workout(
    id: 'leg-day',
    name: 'День ног',
    category: 'Для ног',
    difficulty: 'Средняя',
    totalDuration: 30,
    estimatedCalories: 200,
    exercises: [
      const WorkoutExercise(exerciseId: 'squats', sets: 4, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'lunges', sets: 3, workTime: 50, restTime: 20),
      const WorkoutExercise(exerciseId: 'sumo-squats', sets: 3, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'glute-bridge', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'wall-sit', sets: 3, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'calf-raises', sets: 3, workTime: 40, restTime: 15),
    ],
  ),
  Workout(
    id: 'full-body-strength',
    name: 'Сила всего тела',
    category: 'Силовая',
    difficulty: 'Средняя',
    totalDuration: 35,
    estimatedCalories: 250,
    exercises: [
      const WorkoutExercise(exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'squats', sets: 4, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'plank', sets: 3, workTime: 45, restTime: 15),
      const WorkoutExercise(exerciseId: 'lunges', sets: 3, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'tricep-dips', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'glute-bridge', sets: 3, workTime: 40, restTime: 15),
    ],
  ),
  Workout(
    id: 'cardio-blast',
    name: 'Кардио взрыв',
    category: 'Кардио',
    difficulty: 'Средняя',
    totalDuration: 25,
    estimatedCalories: 220,
    exercises: [
      const WorkoutExercise(exerciseId: 'jumping-jacks', sets: 4, workTime: 45, restTime: 15),
      const WorkoutExercise(exerciseId: 'high-knees', sets: 4, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'running', sets: 3, workTime: 60, restTime: 20),
      const WorkoutExercise(exerciseId: 'mountain-climbers', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'skaters', sets: 3, workTime: 40, restTime: 15),
    ],
  ),
  Workout(
    id: 'yoga-flow',
    name: 'Йога поток',
    category: 'Йога',
    difficulty: 'Лёгкая',
    totalDuration: 20,
    estimatedCalories: 70,
    exercises: [
      const WorkoutExercise(exerciseId: 'childs-pose', sets: 2, workTime: 60, restTime: 10),
      const WorkoutExercise(exerciseId: 'downward-dog', sets: 3, workTime: 45, restTime: 10),
      const WorkoutExercise(exerciseId: 'cobra', sets: 3, workTime: 30, restTime: 10),
      const WorkoutExercise(exerciseId: 'warrior-pose', sets: 2, workTime: 45, restTime: 10),
      const WorkoutExercise(exerciseId: 'tree-pose', sets: 2, workTime: 45, restTime: 10),
    ],
  ),
  Workout(
    id: 'stretch-recovery',
    name: 'Восстановление',
    category: 'Растяжка',
    difficulty: 'Лёгкая',
    totalDuration: 15,
    estimatedCalories: 40,
    exercises: [
      const WorkoutExercise(exerciseId: 'forward-fold', sets: 2, workTime: 45, restTime: 10),
      const WorkoutExercise(exerciseId: 'quad-stretch', sets: 2, workTime: 40, restTime: 10),
      const WorkoutExercise(exerciseId: 'hamstring-stretch', sets: 2, workTime: 40, restTime: 10),
      const WorkoutExercise(exerciseId: 'shoulder-stretch', sets: 2, workTime: 30, restTime: 10),
      const WorkoutExercise(exerciseId: 'hip-flexor', sets: 2, workTime: 45, restTime: 10),
    ],
  ),
  Workout(
    id: 'upper-body',
    name: 'Верх тела',
    category: 'Силовая',
    difficulty: 'Средняя',
    totalDuration: 25,
    estimatedCalories: 180,
    exercises: [
      const WorkoutExercise(exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'diamond-push-ups', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'pike-push-ups', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'tricep-dips', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'superman', sets: 3, workTime: 35, restTime: 15),
    ],
  ),
  Workout(
    id: 'quick-hiit',
    name: 'Быстрый HIIT',
    category: 'HIIT',
    difficulty: 'Сложная',
    totalDuration: 15,
    estimatedCalories: 180,
    exercises: [
      const WorkoutExercise(exerciseId: 'burpees', sets: 3, workTime: 30, restTime: 15),
      const WorkoutExercise(exerciseId: 'squat-jumps', sets: 3, workTime: 30, restTime: 15),
      const WorkoutExercise(exerciseId: 'tuck-jumps', sets: 3, workTime: 25, restTime: 15),
      const WorkoutExercise(exerciseId: 'sprint-in-place', sets: 3, workTime: 30, restTime: 15),
    ],
  ),
  Workout(
    id: 'full-body-blast',
    name: 'Полное тело экстрим',
    category: 'Полное тело',
    difficulty: 'Сложная',
    totalDuration: 40,
    estimatedCalories: 350,
    exercises: [
      const WorkoutExercise(exerciseId: 'burpees', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'push-ups', sets: 4, workTime: 45, restTime: 20),
      const WorkoutExercise(exerciseId: 'squat-jumps', sets: 3, workTime: 40, restTime: 20),
      const WorkoutExercise(exerciseId: 'plank', sets: 3, workTime: 45, restTime: 15),
      const WorkoutExercise(exerciseId: 'lunges', sets: 3, workTime: 50, restTime: 20),
      const WorkoutExercise(exerciseId: 'mountain-climbers', sets: 3, workTime: 40, restTime: 15),
      const WorkoutExercise(exerciseId: 'bicycle-crunches', sets: 3, workTime: 40, restTime: 15),
    ],
  ),
];

List<Workout> getWorkoutsByCategory(String category) {
  if (category == 'Все') return presetWorkouts;
  return presetWorkouts.where((w) => w.category == category).toList();
}

Workout? getWorkoutById(String id) {
  try {
    return presetWorkouts.firstWhere((w) => w.id == id);
  } catch (_) {
    return null;
  }
}
