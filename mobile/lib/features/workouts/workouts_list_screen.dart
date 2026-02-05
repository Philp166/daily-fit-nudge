import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/user_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/glass.dart';
import '../../core/models/custom_workout.dart';
import '../../data/workouts.dart';
import 'workout_timer_screen.dart';
import 'workout_constructor_screen.dart';

/// Full-screen list matching web WorkoutsList: tabs Готовые/Избранное, categories, preset cards with difficulty, Edit.
class WorkoutsListScreen extends StatefulWidget {
  const WorkoutsListScreen({super.key});

  @override
  State<WorkoutsListScreen> createState() => _WorkoutsListScreenState();
}

class _WorkoutsListScreenState extends State<WorkoutsListScreen> {
  String _selectedCategory = 'Все';
  bool _tabPreset = true; // true = Готовые, false = Избранное

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Тренировки', style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                    style: IconButton.styleFrom(
                      backgroundColor: AppColors.glassBg,
                      foregroundColor: AppColors.foreground,
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: _Tabs(
                preset: _tabPreset,
                onPreset: () => setState(() => _tabPreset = true),
                onFavorites: () => setState(() => _tabPreset = false),
                favoritesCount: context.watch<UserProvider>().customWorkouts.where((w) => w.isFavorite).length,
              ),
            ),
            if (_tabPreset) ...[
              const SizedBox(height: 16),
              SizedBox(
                height: 40,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  children: workoutCategories.map((c) {
                    final selected = _selectedCategory == c;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () => setState(() => _selectedCategory = c),
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: selected ? AppColors.primary : AppColors.glassBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.glassBorder),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              c,
                              style: theme.bodySmall?.copyWith(
                                color: selected ? AppColors.primaryForeground : AppColors.foreground.withValues(alpha: 0.7),
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
            const SizedBox(height: 16),
            Expanded(
              child: _tabPreset ? _PresetList(selectedCategory: _selectedCategory) : const _FavoritesList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _Tabs extends StatelessWidget {
  final bool preset;
  final VoidCallback onPreset;
  final VoidCallback onFavorites;
  final int favoritesCount;

  const _Tabs({
    required this.preset,
    required this.onPreset,
    required this.onFavorites,
    required this.favoritesCount,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Glass(
      padding: const EdgeInsets.all(4),
      borderRadius: 16,
      child: Row(
        children: [
          Expanded(
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onPreset,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: preset ? AppColors.primary : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'Готовые',
                    style: theme.bodySmall?.copyWith(
                      color: preset ? AppColors.primaryForeground : AppColors.mutedForeground,
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onFavorites,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: !preset ? AppColors.primary : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.star, size: 14, color: !preset ? AppColors.primaryForeground : AppColors.mutedForeground),
                      const SizedBox(width: 6),
                      Text(
                        'Избранное',
                        style: theme.bodySmall?.copyWith(
                          color: !preset ? AppColors.primaryForeground : AppColors.mutedForeground,
                        ),
                      ),
                      if (favoritesCount > 0) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.foreground.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '$favoritesCount',
                            style: theme.labelSmall?.copyWith(color: AppColors.foreground),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PresetList extends StatelessWidget {
  final String selectedCategory;

  const _PresetList({required this.selectedCategory});

  @override
  Widget build(BuildContext context) {
    final list = getWorkoutsByCategory(selectedCategory);
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
      itemCount: list.length,
      itemBuilder: (context, i) {
        final w = list[i];
        return _PresetCard(
          workout: w,
          onTap: () => _startPreset(context, w),
          onEdit: () => _editPreset(context, w),
        );
      },
    );
  }

  void _startPreset(BuildContext context, Workout w) {
    final user = context.read<UserProvider>();
    Navigator.pop(context);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => WorkoutTimerScreen(
          workoutName: w.name,
          exercises: w.exercises,
          weightKg: user.profile?.weight ?? 70,
        ),
      ),
    );
  }

  void _editPreset(BuildContext context, Workout w) {
    final editAsCustom = CustomWorkout(
      id: w.id,
      name: w.name,
      exercises: List.from(w.exercises),
      isFavorite: false,
      createdAt: DateTime.now(),
    );
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => WorkoutConstructorScreen(editWorkout: editAsCustom),
      ),
    );
  }
}

class _PresetCard extends StatelessWidget {
  final Workout workout;
  final VoidCallback onTap;
  final VoidCallback onEdit;

  const _PresetCard({
    required this.workout,
    required this.onTap,
    required this.onEdit,
  });

  Color _difficultyColor() {
    switch (workout.difficulty) {
      case 'Лёгкая':
        return Colors.green;
      case 'Средняя':
        return Colors.amber;
      case 'Сложная':
        return Colors.red;
      default:
        return AppColors.mutedForeground;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24),
          child: Glass(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            workout.name,
                            style: theme.bodyLarge?.copyWith(color: AppColors.foreground),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _difficultyColor().withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              workout.difficulty,
                              style: theme.labelSmall?.copyWith(color: _difficultyColor()),
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: onEdit,
                      icon: Icon(Icons.edit_outlined, size: 18, color: AppColors.mutedForeground),
                      style: IconButton.styleFrom(backgroundColor: AppColors.glassBg),
                    ),
                    Icon(Icons.chevron_right, size: 20, color: AppColors.mutedForeground),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(Icons.schedule, size: 14, color: AppColors.mutedForeground),
                    const SizedBox(width: 4),
                    Text('${workout.totalDuration} мин', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                    const SizedBox(width: 16),
                    Icon(Icons.local_fire_department, size: 14, color: AppColors.mutedForeground),
                    const SizedBox(width: 4),
                    Text('${workout.estimatedCalories} ккал', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                    const SizedBox(width: 16),
                    Icon(Icons.checklist_rounded, size: 14, color: AppColors.mutedForeground),
                    const SizedBox(width: 4),
                    Text('${workout.exercises.length} упр.', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FavoritesList extends StatelessWidget {
  const _FavoritesList();

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, user, _) {
        final favorites = user.customWorkouts.where((w) => w.isFavorite).toList();
        if (favorites.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Glass(
                    padding: const EdgeInsets.all(24),
                    child: Icon(Icons.star, size: 32, color: AppColors.primary),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Нет избранных тренировок',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.mutedForeground),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Создай тренировку в конструкторе и добавь в избранное',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.mutedForeground),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        }
        return ListView.builder(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
          itemCount: favorites.length,
          itemBuilder: (context, i) {
            final w = favorites[i];
            final totalMin = (w.exercises.fold<int>(0, (s, e) => s + (e.workTime + e.restTime) * e.sets) / 60).round();
            return _FavoriteCard(
              workout: w,
              totalMinutes: totalMin,
              onStart: () => _startCustom(context, user, w),
              onUnfavorite: () => user.toggleFavorite(w.id),
            );
          },
        );
      },
    );
  }

  void _startCustom(BuildContext context, UserProvider user, CustomWorkout w) {
    Navigator.pop(context);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => WorkoutTimerScreen(
          workoutName: w.name,
          exercises: w.exercises,
          weightKg: user.profile?.weight ?? 70,
        ),
      ),
    );
  }
}

class _FavoriteCard extends StatelessWidget {
  final CustomWorkout workout;
  final int totalMinutes;
  final VoidCallback onStart;
  final VoidCallback onUnfavorite;

  const _FavoriteCard({
    required this.workout,
    required this.totalMinutes,
    required this.onStart,
    required this.onUnfavorite,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Glass(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.glassBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.glassBorder),
                  ),
                  child: Icon(Icons.fitness_center, size: 20, color: AppColors.primary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(workout.name, style: theme.bodyLarge?.copyWith(color: AppColors.foreground)),
                      Text('${workout.exercises.length} упражнений', style: theme.labelSmall?.copyWith(color: AppColors.mutedForeground)),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: onUnfavorite,
                  icon: const Icon(Icons.star, size: 18, color: Colors.amber),
                  style: IconButton.styleFrom(backgroundColor: AppColors.glassBg),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.schedule, size: 14, color: AppColors.mutedForeground),
                const SizedBox(width: 4),
                Text('$totalMinutes мин', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                const SizedBox(width: 12),
                Icon(Icons.checklist_rounded, size: 14, color: AppColors.mutedForeground),
                const SizedBox(width: 4),
                Text('${workout.exercises.length} упр.', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: onStart,
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.primaryForeground,
                ),
                child: const Text('Начать тренировку'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
