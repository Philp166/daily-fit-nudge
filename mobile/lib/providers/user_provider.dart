import 'package:flutter/foundation.dart';
import '../core/models/user_profile.dart';
import '../core/models/workout_session.dart';
import '../core/models/workout_exercise.dart';
import '../core/models/custom_workout.dart';
import '../core/services/storage_service.dart';
import '../core/services/calorie_service.dart';

class UserProvider with ChangeNotifier {
  final StorageService _storage;

  UserProfile? _profile;
  int _todayCalories = 0;
  List<WorkoutSession> _sessions = [];
  List<CustomWorkout> _customWorkouts = [];
  bool _loaded = false;

  UserProvider(this._storage) {
    _load();
  }

  bool get loaded => _loaded;
  UserProfile? get profile => _profile;
  bool get isOnboarded => _profile != null;
  int get todayCalories => _todayCalories;
  List<WorkoutSession> get sessions => List.unmodifiable(_sessions);
  List<CustomWorkout> get customWorkouts => List.unmodifiable(_customWorkouts);

  void _load() {
    _profile = _storage.getProfile();
    _todayCalories = _storage.getTodayCalories();
    _sessions = _storage.getSessions();
    _customWorkouts = _storage.getCustomWorkouts();
    _ensureCaloriesDate();
    _loaded = true;
    notifyListeners();
  }

  void _ensureCaloriesDate() {
    final saved = _storage.getTodayCalories();
    if (saved != _todayCalories) {
      _todayCalories = saved;
    }
  }

  Future<void> setProfile(UserProfile p) async {
    final dailyGoal = CalorieService.dailyBurnGoal(p.weight, p.goal);
    _profile = p.copyWith(dailyCalorieGoal: dailyGoal);
    await _storage.setProfile(_profile!);
    notifyListeners();
  }

  Future<void> completeOnboarding(String name, double weight, String goal) async {
    final dailyGoal = CalorieService.dailyBurnGoal(weight, goal);
    _profile = UserProfile(
      name: name,
      age: 25,
      height: 170,
      weight: weight,
      goal: goal,
      dailyCalorieGoal: dailyGoal,
    );
    await _storage.setProfile(_profile!);
    notifyListeners();
  }

  Future<void> addCalories(double calories) async {
    _todayCalories = (_todayCalories + calories).round();
    await _storage.setTodayCalories(_todayCalories);
    notifyListeners();
  }

  Future<void> addWorkoutSession({
    required String name,
    required int duration,
    required int actualWorkTime,
    required double caloriesBurned,
    required int exercisesCount,
    required int setsCount,
  }) async {
    final session = WorkoutSession(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      duration: duration,
      actualWorkTime: actualWorkTime,
      caloriesBurned: caloriesBurned,
      exercisesCount: exercisesCount,
      setsCount: setsCount,
      completedAt: DateTime.now(),
    );
    _sessions.insert(0, session);
    await _storage.setSessions(_sessions);
    _todayCalories = (_todayCalories + caloriesBurned).round();
    await _storage.setTodayCalories(_todayCalories);
    notifyListeners();
  }

  List<WorkoutSession> getTodaySessions() {
    final today = DateTime.now();
    final start = DateTime(today.year, today.month, today.day);
    return _sessions.where((s) => s.completedAt.isAfter(start)).toList();
  }

  ({int current, int goal}) getWeekProgress() {
    final now = DateTime.now();
    var start = now.subtract(Duration(days: now.weekday - 1));
    start = DateTime(start.year, start.month, start.day);
    final weekSessions =
        _sessions.where((s) => s.completedAt.isAfter(start)).toList();
    final current = weekSessions.fold<int>(
        0, (sum, s) => sum + s.caloriesBurned.round());
    final goal = (profile?.dailyCalorieGoal ?? 300) * 7;
    return (current: current, goal: goal);
  }

  Future<void> addCustomWorkout({
    required String name,
    required List<WorkoutExercise> exercises,
    bool isFavorite = false,
  }) async {
    final id = DateTime.now().millisecondsSinceEpoch.toString();
    final workout = CustomWorkout(
      id: id,
      name: name,
      exercises: exercises,
      isFavorite: isFavorite,
      createdAt: DateTime.now(),
    );
    _customWorkouts.insert(0, workout);
    await _storage.setCustomWorkouts(_customWorkouts);
    notifyListeners();
  }

  Future<void> toggleFavorite(String workoutId) async {
    _customWorkouts = _customWorkouts.map((w) {
      if (w.id == workoutId) return w.copyWith(isFavorite: !w.isFavorite);
      return w;
    }).toList();
    await _storage.setCustomWorkouts(_customWorkouts);
    notifyListeners();
  }

  Future<void> deleteCustomWorkout(String workoutId) async {
    _customWorkouts = _customWorkouts.where((w) => w.id != workoutId).toList();
    await _storage.setCustomWorkouts(_customWorkouts);
    notifyListeners();
  }

  Future<void> updateCustomWorkout(String id, CustomWorkout updated) async {
    final i = _customWorkouts.indexWhere((w) => w.id == id);
    if (i >= 0) {
      _customWorkouts = List.from(_customWorkouts)..[i] = updated;
      await _storage.setCustomWorkouts(_customWorkouts);
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _storage.clearAll();
    _profile = null;
    _todayCalories = 0;
    _sessions = [];
    _customWorkouts = [];
    notifyListeners();
  }
}
