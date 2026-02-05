/// Exercise from catalog (id, name, category, MET).
class Exercise {
  final String id;
  final String name;
  final String category;
  final double met;

  const Exercise({
    required this.id,
    required this.name,
    required this.category,
    required this.met,
  });
}

const List<String> exerciseCategories = [
  'Кардио', 'Силовые', 'Растяжка', 'Йога', 'HIIT', 'Пресс',
  'Ноги', 'Руки', 'Спина', 'Грудь',
];

final List<Exercise> exercises = [
  const Exercise(id: 'running', name: 'Бег на месте', category: 'Кардио', met: 8.0),
  const Exercise(id: 'jumping-jacks', name: 'Прыжки с разведением', category: 'Кардио', met: 8.0),
  const Exercise(id: 'high-knees', name: 'Высокие колени', category: 'Кардио', met: 8.0),
  const Exercise(id: 'burpees', name: 'Бёрпи', category: 'Кардио', met: 10.0),
  const Exercise(id: 'mountain-climbers', name: 'Альпинист', category: 'Кардио', met: 8.0),
  const Exercise(id: 'jump-rope', name: 'Скакалка', category: 'Кардио', met: 11.0),
  const Exercise(id: 'box-jumps', name: 'Прыжки на тумбу', category: 'Кардио', met: 8.0),
  const Exercise(id: 'push-ups', name: 'Отжимания', category: 'Силовые', met: 8.0),
  const Exercise(id: 'squats', name: 'Приседания', category: 'Силовые', met: 5.0),
  const Exercise(id: 'lunges', name: 'Выпады', category: 'Силовые', met: 5.0),
  const Exercise(id: 'deadlift', name: 'Становая тяга', category: 'Силовые', met: 6.0),
  const Exercise(id: 'shoulder-press', name: 'Жим плечами', category: 'Силовые', met: 5.0),
  const Exercise(id: 'bicep-curls', name: 'Сгибания на бицепс', category: 'Силовые', met: 4.0),
  const Exercise(id: 'tricep-dips', name: 'Отжимания на трицепс', category: 'Силовые', met: 5.0),
  const Exercise(id: 'crunches', name: 'Скручивания', category: 'Пресс', met: 3.8),
  const Exercise(id: 'plank', name: 'Планка', category: 'Пресс', met: 4.0),
  const Exercise(id: 'leg-raises', name: 'Подъём ног', category: 'Пресс', met: 3.5),
  const Exercise(id: 'russian-twist', name: 'Русский твист', category: 'Пресс', met: 4.0),
  const Exercise(id: 'bicycle-crunches', name: 'Велосипед', category: 'Пресс', met: 4.5),
  const Exercise(id: 'side-plank', name: 'Боковая планка', category: 'Пресс', met: 4.0),
  const Exercise(id: 'flutter-kicks', name: 'Ножницы', category: 'Пресс', met: 4.0),
  const Exercise(id: 'wall-sit', name: 'Стульчик у стены', category: 'Ноги', met: 3.5),
  const Exercise(id: 'calf-raises', name: 'Подъём на носки', category: 'Ноги', met: 2.8),
  const Exercise(id: 'sumo-squats', name: 'Сумо приседания', category: 'Ноги', met: 5.5),
  const Exercise(id: 'glute-bridge', name: 'Ягодичный мост', category: 'Ноги', met: 4.0),
  const Exercise(id: 'step-ups', name: 'Шаги на платформу', category: 'Ноги', met: 6.0),
  const Exercise(id: 'diamond-push-ups', name: 'Алмазные отжимания', category: 'Руки', met: 8.0),
  const Exercise(id: 'arm-circles', name: 'Круги руками', category: 'Руки', met: 3.0),
  const Exercise(id: 'pike-push-ups', name: 'Пайк отжимания', category: 'Руки', met: 6.0),
  const Exercise(id: 'superman', name: 'Супермен', category: 'Спина', met: 3.5),
  const Exercise(id: 'reverse-snow-angels', name: 'Обратные ангелы', category: 'Спина', met: 3.0),
  const Exercise(id: 'back-extensions', name: 'Гиперэкстензия', category: 'Спина', met: 4.0),
  const Exercise(id: 'wide-push-ups', name: 'Широкие отжимания', category: 'Грудь', met: 7.5),
  const Exercise(id: 'chest-dips', name: 'Отжимания на брусьях', category: 'Грудь', met: 8.0),
  const Exercise(id: 'incline-push-ups', name: 'Наклонные отжимания', category: 'Грудь', met: 6.0),
  const Exercise(id: 'forward-fold', name: 'Наклон вперёд', category: 'Растяжка', met: 2.5),
  const Exercise(id: 'quad-stretch', name: 'Растяжка квадрицепса', category: 'Растяжка', met: 2.3),
  const Exercise(id: 'hamstring-stretch', name: 'Растяжка бицепса бедра', category: 'Растяжка', met: 2.3),
  const Exercise(id: 'shoulder-stretch', name: 'Растяжка плеч', category: 'Растяжка', met: 2.0),
  const Exercise(id: 'hip-flexor', name: 'Растяжка бёдер', category: 'Растяжка', met: 2.5),
  const Exercise(id: 'downward-dog', name: 'Собака мордой вниз', category: 'Йога', met: 3.0),
  const Exercise(id: 'warrior-pose', name: 'Поза воина', category: 'Йога', met: 3.0),
  const Exercise(id: 'tree-pose', name: 'Поза дерева', category: 'Йога', met: 2.5),
  const Exercise(id: 'cobra', name: 'Кобра', category: 'Йога', met: 2.5),
  const Exercise(id: 'childs-pose', name: 'Поза ребёнка', category: 'Йога', met: 2.0),
  const Exercise(id: 'squat-jumps', name: 'Приседания с прыжком', category: 'HIIT', met: 9.0),
  const Exercise(id: 'lunge-jumps', name: 'Выпады с прыжком', category: 'HIIT', met: 9.0),
  const Exercise(id: 'tuck-jumps', name: 'Группировки', category: 'HIIT', met: 10.0),
  const Exercise(id: 'skaters', name: 'Конькобежец', category: 'HIIT', met: 8.0),
  const Exercise(id: 'sprint-in-place', name: 'Спринт на месте', category: 'HIIT', met: 11.0),
];

Exercise? getExerciseById(String id) {
  try {
    return exercises.firstWhere((e) => e.id == id);
  } catch (_) {
    return null;
  }
}

List<Exercise> getExercisesByCategory(String category) {
  return exercises.where((e) => e.category == category).toList();
}
