/// Completed workout session record.
class WorkoutSession {
  final String id;
  final String name;
  final int duration; // minutes
  final int actualWorkTime; // seconds
  final double caloriesBurned;
  final int exercisesCount;
  final int setsCount;
  final DateTime completedAt;

  const WorkoutSession({
    required this.id,
    required this.name,
    required this.duration,
    required this.actualWorkTime,
    required this.caloriesBurned,
    required this.exercisesCount,
    required this.setsCount,
    required this.completedAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'duration': duration,
        'actualWorkTime': actualWorkTime,
        'caloriesBurned': caloriesBurned,
        'exercisesCount': exercisesCount,
        'setsCount': setsCount,
        'completedAt': completedAt.toIso8601String(),
      };

  factory WorkoutSession.fromJson(Map<String, dynamic> json) {
    return WorkoutSession(
      id: json['id'] as String,
      name: json['name'] as String,
      duration: json['duration'] as int,
      actualWorkTime: json['actualWorkTime'] as int,
      caloriesBurned: (json['caloriesBurned'] as num).toDouble(),
      exercisesCount: json['exercisesCount'] as int,
      setsCount: json['setsCount'] as int,
      completedAt: DateTime.parse(json['completedAt'] as String),
    );
  }
}
