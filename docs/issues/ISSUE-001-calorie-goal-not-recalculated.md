# ISSUE-001: dailyCalorieGoal не пересчитывается при изменении веса/цели

## Status
**CLOSED - FALSE POSITIVE** ✅

## Resolution
При детальном анализе обнаружено, что код работает корректно:
- WEB: `setProfile` в `UserContext.tsx` (строки 135-138) **пересчитывает** `dailyCalorieGoal`
- Flutter: `setProfile` в `user_provider.dart` (строки 46-51) **пересчитывает** через `CalorieService.dailyBurnGoal`

Переданное старое значение просто перезаписывается вычисленным. Баг отсутствует.

---

## Type
Bug (Invalid)

## Severity
~~Blocker~~ N/A

## Platform
WEB + Flutter

## Description
~~При редактировании профиля (изменение веса или цели) значение `dailyCalorieGoal` не пересчитывается. Пользователь видит устаревшую цель калорий, что делает трекинг прогресса некорректным.~~

**Фактически:** Код работает правильно, `setProfile` выполняет пересчёт автоматически.

## Repro Steps
1. Зарегистрироваться с весом 70 кг, цель "Поддержать форму"
2. Проверить dailyCalorieGoal на дашборде (должно быть ~280 ккал)
3. Перейти в Профиль → Редактировать
4. Изменить вес на 90 кг
5. Сохранить

## Expected
dailyCalorieGoal пересчитывается: `90 × 4 = 360 ккал` (для maintain)

## Actual
dailyCalorieGoal остаётся 280 ккал (старое значение)

## Affected Files
- `src/components/profile/ProfileView.tsx` (строки 23-28)
- `mobile/lib/features/profile/profile_screen.dart` (строки 68-77)

## Root Cause
При сохранении профиля передаётся старое значение `profile.dailyCalorieGoal` вместо вызова функции пересчёта.

### WEB (ProfileView.tsx:23-28)
```tsx
const handleSave = () => {
  setProfile({
    ...editData,
    dailyCalorieGoal: profile.dailyCalorieGoal, // ❌ BUG
  } as typeof profile);
  setIsEditing(false);
};
```

### Flutter (profile_screen.dart:68-77)
```dart
user.setProfile(UserProfile(
  ...
  dailyCalorieGoal: profile.dailyCalorieGoal, // ❌ BUG
));
```

## Fix Approach
1. WEB: Вызвать `calculateDailyBurnGoal(editData.weight, editData.goal)` вместо `profile.dailyCalorieGoal`
2. Flutter: Использовать `CalorieService.dailyBurnGoal(weight, goal)` при сохранении

## Impact
- Все пользователи, изменяющие вес после регистрации
- Неверный расчёт прогресса на дашборде и в анализе недели
