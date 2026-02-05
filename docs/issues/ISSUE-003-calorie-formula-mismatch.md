# ISSUE-003: Разные формулы расчёта калорий на WEB и Flutter

## Status
**CLOSED - FIXED** ✅

## Resolution
Унифицирована формула на обеих платформах: `MET × weight × (time in hours)`

Flutter `calorie_service.dart` обновлён:
```dart
// Было: (met * weightKg * 3.5) / 200 / 60
// Стало: met * weightKg / 3600
static double caloriesPerSecond(double met, double weightKg) {
  return met * weightKg / 3600;
}
```

---

## Type
Bug

## Severity
High

## Platform
WEB + Flutter

## Description
WEB и Flutter используют разные формулы для расчёта сожжённых калорий. Это приводит к разным результатам на разных платформах при одинаковых тренировках.

## Repro Steps
1. Выполнить одинаковую тренировку на WEB и Flutter
2. Сравнить показатели сожжённых калорий

## Example Calculation
**Параметры:** MET=5, вес=70кг, время работы=60 секунд

### WEB (exercises.ts)
```ts
export const calculateCalories = (met, weightKg, durationMinutes) => {
  return met * weightKg * (durationMinutes / 60);
};
// Результат: 5 × 70 × (1/60) = 5.83 ккал
```

### Flutter (calorie_service.dart)
```dart
static double caloriesPerSecond(double met, double weightKg) {
  return (met * weightKg * 3.5) / 200 / 60;
}
// Результат: 5 × 70 × 3.5 / 200 = 6.125 ккал за минуту
```

## Expected
Одинаковые результаты на обеих платформах

## Actual
Разница ~5% при каждой тренировке

## Affected Files
- `src/data/exercises.ts` (функция calculateCalories)
- `mobile/lib/core/services/calorie_service.dart`

## Root Cause
Разные формулы:
- WEB: `MET × weight × (time/60)` — упрощённая
- Flutter: `(MET × weight × 3.5) / 200` — формула на основе VO2

## Fix Approach
1. Выбрать одну корректную формулу (рекомендуется MET-based: `MET × weight × hours`)
2. Применить её на обеих платформах
3. Добавить unit-тесты с известными значениями

## Impact
- Пользователи с несколькими устройствами видят разные цифры
- Недоверие к показателям приложения
