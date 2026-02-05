# ISSUE-002: Таймер не работает в фоне (Flutter)

## Status
**CLOSED - FIXED** ✅

## Resolution
Реализован timestamp-based подход с `WidgetsBindingObserver`:

1. **SimpleTimerRunScreen** и **WorkoutTimerScreen** теперь используют `_phaseEndTime` вместо декремента
2. При возврате из фона вызывается `didChangeAppLifecycleState` → `_recalculateStateFromTimestamp()`
3. Пропущенные фазы обрабатываются в цикле, калории считаются корректно
4. `_lastCalorieUpdateTime` предотвращает двойной подсчёт калорий

Ключевые изменения:
```dart
class _WorkoutTimerScreenState extends State<WorkoutTimerScreen>
    with WidgetsBindingObserver {
  DateTime? _phaseEndTime;
  DateTime? _lastCalorieUpdateTime;

  int get _secondsLeft {
    if (!_running || _phaseEndTime == null) return _pausedSecondsLeft;
    return _phaseEndTime!.difference(DateTime.now()).inSeconds.clamp(0, 9999);
  }

  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _running) {
      _recalculateStateFromTimestamp();
    }
  }
}
```

---

## Type
Bug

## Severity
Blocker

## Platform
Flutter

## Description
При сворачивании приложения во время тренировки таймер останавливается. Это нарушает Non-Negotiable правило "Timer Background Rule" из AGENTS.md.

## Repro Steps
1. Запустить тренировку в Flutter приложении
2. Дождаться начала отсчёта (например, 00:30)
3. Свернуть приложение (нажать Home)
4. Подождать 30 секунд
5. Вернуться в приложение

## Expected
Таймер показывает 00:00 или перешёл к следующей фазе (отдых/следующий подход)

## Actual
Таймер показывает то же время (00:30), как будто был на паузе

## Affected Files
- `mobile/lib/features/workouts/workout_timer_screen.dart`
- `mobile/lib/features/timer/simple_timer_screen.dart`

## Root Cause
Используется стандартный `Timer.periodic`, который приостанавливается системой при переходе приложения в background.

```dart
_timer = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
```

## Fix Approach (из AGENTS.md - Timer Background Rule)
1. Сохранять timestamp начала каждой фазы в хранилище
2. При возврате в приложение вычислять прошедшее время
3. Либо использовать flutter_local_notifications / workmanager для background tasks
4. Восстанавливать состояние таймера корректно

## Non-Negotiable Rule (AGENTS.md)
> **Timer Background Rule:** Таймер должен работать в фоне и восстанавливать состояние при возврате.
> - При сворачивании приложения таймер продолжает отсчёт
> - При возврате — восстановление текущего состояния
> - Таймер не должен "терять секунды" при переключении приложений

## Impact
- Все пользователи, получающие уведомления/звонки во время тренировки
- Основной user flow тренировки нарушен
