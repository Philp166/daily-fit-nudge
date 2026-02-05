import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/user_provider.dart';
import '../../core/models/workout_exercise.dart';
import '../../core/services/calorie_service.dart';
import '../../data/exercises.dart';

class WorkoutTimerScreen extends StatefulWidget {
  final String workoutName;
  final List<WorkoutExercise> exercises;
  final double weightKg;

  const WorkoutTimerScreen({
    super.key,
    required this.workoutName,
    required this.exercises,
    required this.weightKg,
  });

  @override
  State<WorkoutTimerScreen> createState() => _WorkoutTimerScreenState();
}

class _WorkoutTimerScreenState extends State<WorkoutTimerScreen>
    with WidgetsBindingObserver {
  Timer? _timer;
  bool _isWork = true;
  int _exerciseIndex = 0;
  int _setIndex = 0;
  bool _running = false;
  double _totalCalories = 0;
  bool _complete = false;

  // Timestamp-based timing for background support
  DateTime? _phaseEndTime;
  DateTime? _phaseStartTime;
  DateTime? _lastCalorieUpdateTime; // Prevent double counting
  int _pausedSecondsLeft = 0;

  WorkoutExercise get _currentExercise => widget.exercises[_exerciseIndex];
  Exercise? get _currentExerciseMeta => getExerciseById(_currentExercise.exerciseId);

  int get _secondsLeft {
    if (!_running || _phaseEndTime == null) {
      return _pausedSecondsLeft;
    }
    final remaining = _phaseEndTime!.difference(DateTime.now()).inSeconds;
    return remaining > 0 ? remaining : 0;
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _pausedSecondsLeft = _currentExercise.workTime;
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _timer?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _running) {
      _recalculateStateFromTimestamp();
    }
  }

  void _recalculateStateFromTimestamp() {
    if (_phaseEndTime == null || _phaseStartTime == null) return;

    // Calculate calories from _lastCalorieUpdateTime to avoid double counting
    final calorieStartTime = _lastCalorieUpdateTime ?? _phaseStartTime!;

    while (_phaseEndTime!.isBefore(DateTime.now())) {
      // Add calories for completed work phase (only from calorieStartTime)
      if (_isWork) {
        final meta = _currentExerciseMeta;
        if (meta != null) {
          final start = calorieStartTime.isAfter(_phaseStartTime!) ? calorieStartTime : _phaseStartTime!;
          final phaseDuration = _phaseEndTime!.difference(start).inSeconds;
          if (phaseDuration > 0) {
            _totalCalories += CalorieService.caloriesBurned(meta.met, widget.weightKg, phaseDuration);
          }
        }
        _isWork = false;
        _phaseStartTime = _phaseEndTime;
        _phaseEndTime = _phaseEndTime!.add(Duration(seconds: _currentExercise.restTime));
        _lastCalorieUpdateTime = _phaseStartTime; // Reset for next work phase
      } else {
        _setIndex++;
        if (_setIndex >= _currentExercise.sets) {
          _setIndex = 0;
          _exerciseIndex++;
          if (_exerciseIndex >= widget.exercises.length) {
            _timer?.cancel();
            _running = false;
            _complete = true;
            _phaseEndTime = null;
            _phaseStartTime = null;
            _lastCalorieUpdateTime = null;
            setState(() {});
            _saveSession();
            return;
          }
        }
        _isWork = true;
        _phaseStartTime = _phaseEndTime;
        _phaseEndTime = _phaseEndTime!.add(Duration(seconds: widget.exercises[_exerciseIndex].workTime));
        _lastCalorieUpdateTime = _phaseStartTime; // Start tracking for new work phase
      }
    }

    // Add partial calories for current work phase
    if (_isWork && _lastCalorieUpdateTime != null) {
      final meta = _currentExerciseMeta;
      if (meta != null) {
        final elapsed = DateTime.now().difference(_lastCalorieUpdateTime!).inSeconds;
        if (elapsed > 0) {
          _totalCalories += CalorieService.caloriesBurned(meta.met, widget.weightKg, elapsed);
          _lastCalorieUpdateTime = DateTime.now();
        }
      }
    }
    setState(() {});
  }

  void _tick() {
    // Add calories for time since last update (prevents double counting)
    if (_isWork && _lastCalorieUpdateTime != null) {
      final meta = _currentExerciseMeta;
      if (meta != null) {
        final elapsed = DateTime.now().difference(_lastCalorieUpdateTime!).inSeconds;
        if (elapsed > 0) {
          _totalCalories += CalorieService.caloriesBurned(meta.met, widget.weightKg, elapsed);
          _lastCalorieUpdateTime = DateTime.now();
        }
      }
    }
    final remaining = _secondsLeft;
    if (remaining <= 0) {
      if (_isWork) {
        _isWork = false;
        _phaseStartTime = DateTime.now();
        _phaseEndTime = DateTime.now().add(Duration(seconds: _currentExercise.restTime));
        _lastCalorieUpdateTime = null; // Stop calorie tracking during rest
      } else {
        _setIndex++;
        if (_setIndex >= _currentExercise.sets) {
          _setIndex = 0;
          _exerciseIndex++;
          if (_exerciseIndex >= widget.exercises.length) {
            _timer?.cancel();
            _running = false;
            _complete = true;
            _phaseEndTime = null;
            _phaseStartTime = null;
            _lastCalorieUpdateTime = null;
            setState(() {});
            _saveSession();
            return;
          }
        }
        _isWork = true;
        _phaseStartTime = DateTime.now();
        _phaseEndTime = DateTime.now().add(Duration(seconds: widget.exercises[_exerciseIndex].workTime));
        _lastCalorieUpdateTime = DateTime.now(); // Start calorie tracking for new work phase
      }
    }
    setState(() {});
  }

  void _saveSession() {
    final totalSeconds = widget.exercises.fold<int>(0, (s, e) {
      return s + e.sets * (e.workTime + e.restTime);
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = context.read<UserProvider>();
      user.addWorkoutSession(
        name: widget.workoutName,
        duration: totalSeconds ~/ 60,
        actualWorkTime: widget.exercises.fold<int>(0, (s, e) => s + e.sets * e.workTime),
        caloriesBurned: _totalCalories,
        exercisesCount: widget.exercises.length,
        setsCount: widget.exercises.fold<int>(0, (s, e) => s + e.sets),
      );
    });
  }

  void _toggle() {
    if (_running) {
      _timer?.cancel();
      _pausedSecondsLeft = _secondsLeft;
      // Save calories for time since last update when pausing
      if (_isWork && _lastCalorieUpdateTime != null) {
        final meta = _currentExerciseMeta;
        if (meta != null) {
          final elapsed = DateTime.now().difference(_lastCalorieUpdateTime!).inSeconds;
          if (elapsed > 0) {
            _totalCalories += CalorieService.caloriesBurned(meta.met, widget.weightKg, elapsed);
          }
        }
      }
      _phaseEndTime = null;
      _phaseStartTime = null;
      _lastCalorieUpdateTime = null;
    } else {
      _phaseStartTime = DateTime.now();
      _phaseEndTime = DateTime.now().add(Duration(seconds: _pausedSecondsLeft));
      if (_isWork) {
        _lastCalorieUpdateTime = DateTime.now();
      }
      _timer = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
    }
    _running = !_running;
    setState(() {});
  }

  void _skip() {
    if (_isWork) {
      // Add remaining calories for skipped portion
      _totalCalories += CalorieService.caloriesBurned(
        _currentExerciseMeta?.met ?? 5,
        widget.weightKg,
        _secondsLeft,
      );
      _lastCalorieUpdateTime = null; // Reset to avoid double counting
    }
    // Set phase to end now
    _phaseEndTime = DateTime.now();
    _tick();
  }

  @override
  Widget build(BuildContext context) {
    if (_complete) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.celebration, size: 80, color: Colors.green),
                  const SizedBox(height: 24),
                  Text(
                    'Отлично!',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  const Text('Тренировка завершена'),
                  const SizedBox(height: 24),
                  Text(
                    '${_totalCalories.round()} ккал сожжено',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 32),
                  FilledButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Готово'),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final isWork = _isWork;
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.workoutName),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: Container(
              color: isWork ? Colors.blue.shade900 : Colors.green.shade900,
              child: SafeArea(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      isWork ? 'РАБОТА' : 'ОТДЫХ',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _currentExerciseMeta?.name ?? _currentExercise.exerciseId,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: Colors.white70,
                          ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      '${_secondsLeft ~/ 60}:${(_secondsLeft % 60).toString().padLeft(2, '0')}',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.white,
                            fontFeatures: [const FontFeature.tabularFigures()],
                          ),
                    ),
                    Text(
                      'Упражнение ${_exerciseIndex + 1}/${widget.exercises.length} · Подход ${_setIndex + 1}/${_currentExercise.sets}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.white70,
                          ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      '${_totalCalories.round()} ккал',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: Colors.white70,
                          ),
                    ),
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton.filled(
                          onPressed: _toggle,
                          icon: Icon(_running ? Icons.pause : Icons.play_arrow),
                          iconSize: 48,
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: isWork ? Colors.blue : Colors.green,
                          ),
                        ),
                        const SizedBox(width: 24),
                        IconButton.filled(
                          onPressed: _skip,
                          icon: const Icon(Icons.skip_next),
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.white24,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
