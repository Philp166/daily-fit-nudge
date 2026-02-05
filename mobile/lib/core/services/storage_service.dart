import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile.dart';
import '../models/workout_session.dart';
import '../models/custom_workout.dart';

class StorageService {
  static const _keyProfile = 'interfit_profile';
  static const _keyTodayCalories = 'interfit_today_calories';
  static const _keyCaloriesDate = 'interfit_calories_date';
  static const _keySessions = 'interfit_sessions';
  static const _keyCustomWorkouts = 'interfit_custom_workouts';

  final SharedPreferences _prefs;

  StorageService(this._prefs);

  UserProfile? getProfile() {
    final s = _prefs.getString(_keyProfile);
    if (s == null) return null;
    return UserProfile.fromJson(
        jsonDecode(s) as Map<String, dynamic>);
  }

  Future<void> setProfile(UserProfile profile) async {
    await _prefs.setString(
        _keyProfile, jsonEncode(profile.toJson()));
  }

  int getTodayCalories() {
    final today = DateTime.now().toIso8601String().substring(0, 10);
    final savedDate = _prefs.getString(_keyCaloriesDate);
    if (savedDate != today) return 0;
    return _prefs.getInt(_keyTodayCalories) ?? 0;
  }

  Future<void> setTodayCalories(int value) async {
    final today = DateTime.now().toIso8601String().substring(0, 10);
    await _prefs.setString(_keyCaloriesDate, today);
    await _prefs.setInt(_keyTodayCalories, value);
  }

  List<WorkoutSession> getSessions() {
    final s = _prefs.getString(_keySessions);
    if (s == null) return [];
    final list = jsonDecode(s) as List<dynamic>;
    return list
        .map((e) =>
            WorkoutSession.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> setSessions(List<WorkoutSession> sessions) async {
    await _prefs.setString(
        _keySessions,
        jsonEncode(sessions.map((e) => e.toJson()).toList()));
  }

  List<CustomWorkout> getCustomWorkouts() {
    final s = _prefs.getString(_keyCustomWorkouts);
    if (s == null) return [];
    final list = jsonDecode(s) as List<dynamic>;
    return list
        .map((e) =>
            CustomWorkout.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> setCustomWorkouts(List<CustomWorkout> workouts) async {
    await _prefs.setString(
        _keyCustomWorkouts,
        jsonEncode(workouts.map((e) => e.toJson()).toList()));
  }

  Future<void> clearAll() async {
    await _prefs.remove(_keyProfile);
    await _prefs.remove(_keyTodayCalories);
    await _prefs.remove(_keyCaloriesDate);
    await _prefs.remove(_keySessions);
    await _prefs.remove(_keyCustomWorkouts);
  }
}
