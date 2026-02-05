/// Daily burn goal and workout calories (MET × weight × time).
class CalorieService {
  /// Daily burn goal by weight and goal (lose/maintain/gain).
  /// lose: 400-600, maintain: 300-450, gain: 200-350 kcal/day.
  static int dailyBurnGoal(double weightKg, String goal) {
    final baseGoal = weightKg * 4;
    switch (goal) {
      case 'lose':
        return (baseGoal * 1.5).clamp(400.0, 600.0).round();
      case 'gain':
        return (baseGoal * 0.8).clamp(200.0, 350.0).round();
      default:
        return baseGoal.clamp(300.0, 450.0).round();
    }
  }

  /// Calories per second during work phase.
  /// Formula: MET × weight × (time in hours)
  /// Per second: MET × weight / 3600
  static double caloriesPerSecond(double met, double weightKg) {
    return met * weightKg / 3600;
  }

  /// Total calories for a duration in seconds at given MET and weight.
  /// Formula: MET × weight × (durationSeconds / 3600)
  static double caloriesBurned(double met, double weightKg, int durationSeconds) {
    return met * weightKg * durationSeconds / 3600;
  }
}
