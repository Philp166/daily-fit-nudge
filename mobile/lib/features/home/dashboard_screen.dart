import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/glass.dart';
import '../../core/widgets/badge.dart';
import '../../core/widgets/circular_progress.dart';
import '../../data/workouts.dart';
import '../../providers/user_provider.dart';
import '../workouts/workouts_list_screen.dart';
import '../workouts/workout_constructor_screen.dart';

/// Matches web DashboardView: CaloriesWidget (today), ConstructorCard, ActivityCard, WorkoutsCard, AnalysisCard.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, user, _) {
        final profile = user.profile!;
        final week = user.getWeekProgress();
        final dailyGoal = profile.dailyCalorieGoal;
        final todayCalories = user.todayCalories;
        final todaySessions = user.getTodaySessions();
        final activityMinutes = todaySessions.fold<int>(
            0, (s, e) => s + (e.actualWorkTime ~/ 60));
        final favorites = user.customWorkouts.where((w) => w.isFavorite).length;
        final totalWorkouts = presetWorkouts.length + favorites;
        final weekPct = week.goal > 0
            ? (week.current / week.goal).clamp(0.0, 1.0) * 100
            : 0.0;

        return SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                  child: Text(
                    'Привет, ${profile.name}!',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: AppColors.foreground,
                        ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
                  child: _CaloriesWidget(
                    todayCalories: todayCalories,
                    dailyGoal: dailyGoal,
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: _ConstructorCard(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const WorkoutConstructorScreen(),
                      ),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
                  child: Row(
                    children: [
                      Expanded(
                        child: _ActivityCard(activityMinutes: activityMinutes),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _WorkoutsCard(
                          totalWorkouts: totalWorkouts,
                          favoritesCount: favorites,
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const WorkoutsListScreen(),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 120),
                  child: _AnalysisCard(
                    current: week.current,
                    goal: week.goal.round(),
                    percentage: weekPct,
                    onTap: () => _showAnalysisModal(context, user),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// Web CaloriesWidget: "Сожжено сегодня", big number, goal, progress bar with glow.
class _CaloriesWidget extends StatelessWidget {
  final int todayCalories;
  final int dailyGoal;

  const _CaloriesWidget({
    required this.todayCalories,
    required this.dailyGoal,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    final progress = dailyGoal > 0
        ? (todayCalories / dailyGoal).clamp(0.0, 1.0)
        : 0.0;
    return Glass(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: Column(
        children: [
          Text(
            'СОЖЖЕНО СЕГОДНЯ',
            style: theme.bodyMedium?.copyWith(
              color: AppColors.mutedForeground,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '$todayCalories',
            style: theme.displayLarge?.copyWith(
              fontWeight: FontWeight.w200,
              color: AppColors.foreground,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Цель: $dailyGoal ккал',
            style: theme.bodyMedium?.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final barWidth = constraints.maxWidth;
                final fillWidth = (barWidth * progress.clamp(0.0, 1.0)).clamp(0.0, barWidth);
                return Stack(
                  alignment: Alignment.centerLeft,
                  children: [
                    Container(
                      height: 4,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        color: AppColors.muted,
                      ),
                    ),
                    Container(
                      width: fillWidth,
                      height: 4,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF00B4D8),
                            Color(0xFF22D3EE),
                            Color(0xFF67E8F9),
                          ],
                        ),
                      ),
                    ),
                    if (fillWidth > 2)
                      Positioned(
                        left: fillWidth - 5,
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.primary,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primary.withValues(alpha: 0.6),
                                blurRadius: 6,
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// Web ConstructorCard: glass icon Dumbbell, Badge, title, subtitle.
class _ConstructorCard extends StatelessWidget {
  final VoidCallback onTap;

  const _ConstructorCard({required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return GestureDetector(
      onTap: onTap,
      child: Glass(
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.glassBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: const Icon(
                Icons.fitness_center,
                size: 24,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const AppBadge(text: 'Конструктор'),
                  const SizedBox(height: 8),
                  Text(
                    'Создай свою тренировку',
                    style: theme.titleLarge?.copyWith(
                      color: AppColors.foreground,
                    ),
                  ),
                  Text(
                    'Собери идеальную программу из 50+ упражнений',
                    style: theme.bodyMedium?.copyWith(
                      color: AppColors.mutedForeground,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              size: 20,
              color: AppColors.foreground.withValues(alpha: 0.5),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivityCard extends StatelessWidget {
  final int activityMinutes;

  const _ActivityCard({required this.activityMinutes});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Glass(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppBadge(text: 'Активность'),
          const SizedBox(height: 12),
          Text(
            '$activityMinutes',
            style: theme.displayMedium?.copyWith(
              fontWeight: FontWeight.w200,
              color: AppColors.foreground,
            ),
          ),
          Text(
            'мин',
            style: theme.bodyLarge?.copyWith(
              color: AppColors.foreground.withValues(alpha: 0.8),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'из 60 мин',
            style: theme.bodyMedium?.copyWith(
              color: AppColors.mutedForeground,
            ),
          ),
        ],
      ),
    );
  }
}

class _WorkoutsCard extends StatelessWidget {
  final int totalWorkouts;
  final int favoritesCount;
  final VoidCallback onTap;

  const _WorkoutsCard({
    required this.totalWorkouts,
    required this.favoritesCount,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return GestureDetector(
      onTap: onTap,
      child: Glass(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const AppBadge(text: 'Тренировки'),
            const SizedBox(height: 16),
            Text(
              '$totalWorkouts',
              style: theme.displayMedium?.copyWith(
                fontWeight: FontWeight.w200,
                color: AppColors.foreground,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'готовых программ',
              style: theme.bodyMedium?.copyWith(
                color: AppColors.mutedForeground,
              ),
            ),
            if (favoritesCount > 0) ...[
              const SizedBox(height: 8),
              Text(
                '$favoritesCount избранных',
                style: theme.labelSmall?.copyWith(
                  color: AppColors.mutedForeground,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _AnalysisCard extends StatelessWidget {
  final int current;
  final int goal;
  final double percentage;
  final VoidCallback? onTap;

  const _AnalysisCard({
    required this.current,
    required this.goal,
    required this.percentage,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return GestureDetector(
      onTap: onTap,
      child: Glass(
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const AppBadge(text: 'Анализ недели'),
                  const SizedBox(height: 24),
                  Text(
                    '$current',
                    style: theme.displayMedium?.copyWith(
                      fontWeight: FontWeight.w200,
                      color: AppColors.foreground,
                    ),
                  ),
                  Text(
                    ' / $goal',
                    style: theme.bodyLarge?.copyWith(
                      color: AppColors.mutedForeground,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'ккал сожжено за неделю',
                    style: theme.bodyMedium?.copyWith(
                      color: AppColors.mutedForeground,
                    ),
                  ),
                ],
              ),
            ),
            AppCircularProgress(
              value: percentage,
              size: 90,
              strokeWidth: 8,
            ),
          ],
        ),
      ),
    );
  }
}

void _showAnalysisModal(BuildContext context, UserProvider user) {
  final theme = Theme.of(context).textTheme;
  final sessions = user.sessions;
  final now = DateTime.now();
  DateTime weekStartOf(DateTime d) {
    final w = d.subtract(Duration(days: d.weekday - 1));
    return DateTime(w.year, w.month, w.day);
  }
  final labels = ['4 нед.', '3 нед.', 'Прош.', 'Эта'];
  final weeksData = List.generate(4, (i) {
    final start = weekStartOf(now.subtract(Duration(days: (3 - i) * 7)));
    final end = start.add(const Duration(days: 7));
    final weekSessions = sessions.where((s) {
      final d = s.completedAt;
      return !d.isBefore(start) && d.isBefore(end);
    }).toList();
    final calories = weekSessions.fold<int>(0, (s, e) => s + e.caloriesBurned.round());
    final duration = weekSessions.fold<int>(0, (s, e) => s + e.duration);
    return (
      label: labels[i],
      calories: calories,
      duration: duration,
      workouts: weekSessions.length,
    );
  });
  final goal = user.getWeekProgress().goal.round();
  final currentWeek = weeksData[3];
  final previousWeek = weeksData[2];
  final percentage = goal > 0 ? ((currentWeek.calories / goal) * 100).clamp(0.0, 100.0) : 0.0;
  final caloriesDiff = previousWeek.calories > 0
      ? (((currentWeek.calories - previousWeek.calories) / previousWeek.calories) * 100).round()
      : (currentWeek.calories > 0 ? 100 : 0);
  final durationDiff = previousWeek.duration > 0
      ? (((currentWeek.duration - previousWeek.duration) / previousWeek.duration) * 100).round()
      : (currentWeek.duration > 0 ? 100 : 0);
  final workoutsDiff = previousWeek.workouts > 0
      ? (((currentWeek.workouts - previousWeek.workouts) / previousWeek.workouts) * 100).round()
      : (currentWeek.workouts > 0 ? 100 : 0);
  final maxCalories = [for (final w in weeksData) w.calories].fold<int>(goal, (a, b) => a > b ? a : b);
  String summaryText() {
    if (currentWeek.workouts == 0 && previousWeek.workouts == 0) return 'Начни тренироваться, чтобы увидеть прогресс';
    if (currentWeek.workouts == 0) return 'На этой неделе пока нет тренировок';
    if (previousWeek.workouts == 0) return 'Отличное начало! Продолжай в том же духе';
    if (caloriesDiff > 20) return 'На $caloriesDiff% больше калорий чем на прошлой неделе 🔥';
    if (caloriesDiff < -20) return 'На ${caloriesDiff.abs()}% меньше активности — не сдавайся!';
    return 'Стабильный прогресс, так держать!';
  }

  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).padding.bottom),
      child: DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 1,
        expand: false,
        builder: (ctx, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Container(width: 48, height: 4, decoration: BoxDecoration(color: AppColors.mutedForeground.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Анализ недели', style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close),
                    style: IconButton.styleFrom(backgroundColor: AppColors.glassBg),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Stack(
                alignment: Alignment.center,
                children: [
                  AppCircularProgress(value: percentage, size: 120, strokeWidth: 10, showValue: false),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('${percentage.round()}%', style: theme.headlineMedium?.copyWith(fontWeight: FontWeight.w200, color: AppColors.foreground)),
                      Text('выполнено', style: theme.labelSmall?.copyWith(color: AppColors.mutedForeground)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Glass(
                padding: const EdgeInsets.all(16),
                child: Center(child: Text(summaryText(), style: theme.bodyLarge?.copyWith(color: AppColors.foreground))),
              ),
              const SizedBox(height: 24),
              Glass(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Последние 4 недели', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                    const SizedBox(height: 16),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: List.generate(4, (i) {
                        final w = weeksData[i];
                        final h = maxCalories > 0 ? (w.calories / maxCalories).clamp(0.0, 1.0) * 80 : 0.0;
                        return Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  height: h.clamp(4.0, 80.0),
                                  decoration: BoxDecoration(
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                                    color: i == 3 ? AppColors.primary : AppColors.primary.withValues(alpha: 0.3),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(w.label, style: theme.labelSmall?.copyWith(color: AppColors.mutedForeground)),
                              ],
                            ),
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: 8),
                    Row(children: [
                      Expanded(child: Divider(color: AppColors.primary.withValues(alpha: 0.5))),
                    ]),
                    Align(alignment: Alignment.centerRight, child: Text('цель', style: theme.labelSmall?.copyWith(color: AppColors.primary.withValues(alpha: 0.7)))),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Glass(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Сравнение с прошлой неделей', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                    const SizedBox(height: 12),
                    _ComparisonRow(icon: Icons.local_fire_department, label: 'Калории', value: '${currentWeek.calories}', diff: caloriesDiff),
                    _ComparisonRow(icon: Icons.schedule, label: 'Время', value: '${currentWeek.duration} мин', diff: durationDiff),
                    _ComparisonRow(icon: Icons.fitness_center, label: 'Тренировок', value: '${currentWeek.workouts}', diff: workoutsDiff),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Glass(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [Icon(Icons.local_fire_department, size: 16, color: AppColors.primary), const SizedBox(width: 8), Text('Сожжено', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground))]),
                          const SizedBox(height: 8),
                          Text('${currentWeek.calories} ккал', style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Glass(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [Icon(Icons.trending_up, size: 16, color: AppColors.primary), const SizedBox(width: 8), Text('Цель', style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground))]),
                          const SizedBox(height: 8),
                          Text('$goal ккал', style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class _ComparisonRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final int diff;

  const _ComparisonRow({required this.icon, required this.label, required this.value, required this.diff});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    final diffColor = diff > 0 ? Colors.green : (diff < 0 ? Colors.red : AppColors.mutedForeground);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [Icon(icon, size: 16, color: AppColors.primary), const SizedBox(width: 8), Text(label, style: theme.bodyLarge?.copyWith(color: AppColors.foreground))]),
          Row(
            children: [
              Text(value, style: theme.bodyLarge?.copyWith(color: AppColors.foreground)),
              const SizedBox(width: 12),
              Text('${diff > 0 ? "+" : ""}$diff%', style: theme.labelMedium?.copyWith(color: diffColor)),
            ],
          ),
        ],
      ),
    );
  }
}
