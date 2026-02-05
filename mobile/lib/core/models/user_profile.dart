/// User profile from onboarding and profile screen.
class UserProfile {
  final String name;
  final int age;
  final int height; // cm
  final double weight; // kg
  final String goal; // 'lose' | 'maintain' | 'gain'
  final int dailyCalorieGoal;

  const UserProfile({
    required this.name,
    required this.age,
    required this.height,
    required this.weight,
    required this.goal,
    required this.dailyCalorieGoal,
  });

  UserProfile copyWith({
    String? name,
    int? age,
    int? height,
    double? weight,
    String? goal,
    int? dailyCalorieGoal,
  }) {
    return UserProfile(
      name: name ?? this.name,
      age: age ?? this.age,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      goal: goal ?? this.goal,
      dailyCalorieGoal: dailyCalorieGoal ?? this.dailyCalorieGoal,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'age': age,
        'height': height,
        'weight': weight,
        'goal': goal,
        'dailyCalorieGoal': dailyCalorieGoal,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] as String,
      age: json['age'] as int,
      height: json['height'] as int,
      weight: (json['weight'] as num).toDouble(),
      goal: json['goal'] as String,
      dailyCalorieGoal: json['dailyCalorieGoal'] as int,
    );
  }
}
