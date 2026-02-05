/// Single exercise entry in a workout (custom or preset).
class WorkoutExercise {
  final String exerciseId;
  final int sets;
  final int workTime; // seconds
  final int restTime; // seconds

  const WorkoutExercise({
    required this.exerciseId,
    required this.sets,
    required this.workTime,
    required this.restTime,
  });

  Map<String, dynamic> toJson() => {
        'exerciseId': exerciseId,
        'sets': sets,
        'workTime': workTime,
        'restTime': restTime,
      };

  factory WorkoutExercise.fromJson(Map<String, dynamic> json) {
    return WorkoutExercise(
      exerciseId: json['exerciseId'] as String,
      sets: json['sets'] as int,
      workTime: json['workTime'] as int,
      restTime: json['restTime'] as int,
    );
  }

  WorkoutExercise copyWith({
    String? exerciseId,
    int? sets,
    int? workTime,
    int? restTime,
  }) {
    return WorkoutExercise(
      exerciseId: exerciseId ?? this.exerciseId,
      sets: sets ?? this.sets,
      workTime: workTime ?? this.workTime,
      restTime: restTime ?? this.restTime,
    );
  }
}
