import 'workout_exercise.dart';

/// User-created or favorited workout.
class CustomWorkout {
  final String id;
  final String name;
  final List<WorkoutExercise> exercises;
  final bool isFavorite;
  final DateTime createdAt;

  const CustomWorkout({
    required this.id,
    required this.name,
    required this.exercises,
    required this.isFavorite,
    required this.createdAt,
  });

  int get totalDurationMinutes {
    int total = 0;
    for (final e in exercises) {
      total += e.sets * (e.workTime + e.restTime);
    }
    return total ~/ 60;
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'exercises': exercises.map((e) => e.toJson()).toList(),
        'isFavorite': isFavorite,
        'createdAt': createdAt.toIso8601String(),
      };

  factory CustomWorkout.fromJson(Map<String, dynamic> json) {
    return CustomWorkout(
      id: json['id'] as String,
      name: json['name'] as String,
      exercises: (json['exercises'] as List<dynamic>)
          .map((e) => WorkoutExercise.fromJson(e as Map<String, dynamic>))
          .toList(),
      isFavorite: json['isFavorite'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  CustomWorkout copyWith({
    String? id,
    String? name,
    List<WorkoutExercise>? exercises,
    bool? isFavorite,
    DateTime? createdAt,
  }) {
    return CustomWorkout(
      id: id ?? this.id,
      name: name ?? this.name,
      exercises: exercises ?? this.exercises,
      isFavorite: isFavorite ?? this.isFavorite,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
