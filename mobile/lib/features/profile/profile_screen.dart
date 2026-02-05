import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/user_provider.dart';
import '../../core/models/user_profile.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/glass.dart';

/// Matches web ProfileView: avatar gradient, stats grid, profile fields, edit mode, logout.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  final _nameController = TextEditingController();
  final _ageController = TextEditingController();
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  void _syncFromProfile(UserProfile p) {
    if (_nameController.text != p.name) _nameController.text = p.name;
    if (_ageController.text != '${p.age}') _ageController.text = '${p.age}';
    if (_heightController.text != '${p.height}') _heightController.text = '${p.height}';
    if (_weightController.text != '${p.weight}') _weightController.text = '${p.weight}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Consumer<UserProvider>(
      builder: (context, user, _) {
        final profile = user.profile!;
        if (!_isEditing) _syncFromProfile(profile);
        final totalWorkouts = user.sessions.length;
        final totalCalories = user.sessions.fold<int>(0, (s, e) => s + e.caloriesBurned.round());
        final totalMinutes = user.sessions.fold<int>(0, (s, e) => s + e.duration);
        final goalInfo = {
          'lose': ('Похудеть', Icons.local_fire_department),
          'maintain': ('Поддержать форму', Icons.balance),
          'gain': ('Набрать массу', Icons.fitness_center),
        };
        final (goalLabel, _) = goalInfo[profile.goal] ?? ('', Icons.flag_outlined);

        return SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Профиль', style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                      IconButton(
                        onPressed: () {
                          if (_isEditing) {
                            user.setProfile(UserProfile(
                              name: _nameController.text.trim().isEmpty ? profile.name : _nameController.text.trim(),
                              age: int.tryParse(_ageController.text) ?? profile.age,
                              height: int.tryParse(_heightController.text) ?? profile.height,
                              weight: double.tryParse(_weightController.text.replaceAll(',', '.')) ?? profile.weight,
                              goal: profile.goal,
                              dailyCalorieGoal: profile.dailyCalorieGoal,
                            ));
                          }
                          setState(() => _isEditing = !_isEditing);
                        },
                        icon: Icon(_isEditing ? Icons.check : Icons.edit_outlined, size: 20, color: AppColors.foreground),
                        style: IconButton.styleFrom(backgroundColor: AppColors.glassBg),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    children: [
                      Container(
                        width: 96,
                        height: 96,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(24),
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [AppColors.primary, AppColors.primary],
                          ),
                        ),
                        child: Icon(Icons.person, size: 40, color: AppColors.primaryForeground),
                      ),
                      const SizedBox(height: 16),
                      if (_isEditing)
                        SizedBox(
                          width: 200,
                          child: TextField(
                            textAlign: TextAlign.center,
                            controller: _nameController,
                            style: theme.titleLarge?.copyWith(color: AppColors.foreground),
                            decoration: InputDecoration(
                              isDense: true,
                              border: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.primary)),
                              focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.primary)),
                            ),
                          ),
                        )
                      else
                        Text(profile.name, style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 32, 20, 24),
                  child: Row(
                    children: [
                      Expanded(
                        child: Glass(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.glassBg,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.glassBorder),
                                ),
                                child: Icon(Icons.directions_run, size: 18, color: AppColors.primary),
                              ),
                              const SizedBox(height: 8),
                              Text('$totalWorkouts', style: theme.titleLarge?.copyWith(color: AppColors.foreground)),
                              Text('Тренировок', style: theme.labelSmall?.copyWith(color: AppColors.mutedForeground)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Glass(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.glassBg,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.glassBorder),
                                ),
                                child: Icon(Icons.local_fire_department, size: 18, color: AppColors.primary),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                totalCalories >= 1000 ? '${(totalCalories / 1000).round()}k' : '$totalCalories',
                                style: theme.titleLarge?.copyWith(color: AppColors.foreground),
                              ),
                              Text('Калорий', style: theme.labelSmall?.copyWith(color: AppColors.mutedForeground)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Glass(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.glassBg,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.glassBorder),
                                ),
                                child: Icon(Icons.schedule, size: 18, color: AppColors.primary),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                totalMinutes >= 60 ? '${(totalMinutes / 60).round()}ч' : '$totalMinutesм',
                                style: theme.titleLarge?.copyWith(color: AppColors.foreground),
                              ),
                              Text('Времени', style: theme.labelSmall?.copyWith(color: AppColors.mutedForeground)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    children: [
                      _ProfileRow(icon: Icons.calendar_today, label: 'Возраст', value: '${profile.age} лет', isEditing: _isEditing, controller: _ageController),
                      const SizedBox(height: 12),
                      _ProfileRow(icon: Icons.straighten, label: 'Рост', value: '${profile.height} см', isEditing: _isEditing, controller: _heightController),
                      const SizedBox(height: 12),
                      _ProfileRow(icon: Icons.monitor_weight_outlined, label: 'Вес', value: '${profile.weight} кг', isEditing: _isEditing, controller: _weightController),
                      const SizedBox(height: 12),
                      Glass(
                        padding: const EdgeInsets.all(16),
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
                              child: Icon(Icons.flag_outlined, size: 20, color: AppColors.primary),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Цель', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                                  Row(
                                    children: [
                                      Icon(goalInfo[profile.goal]?.$2 ?? Icons.flag_outlined, size: 20, color: AppColors.primary),
                                      const SizedBox(width: 8),
                                      Text(goalLabel, style: theme.bodyLarge?.copyWith(color: AppColors.foreground)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            Text('${profile.dailyCalorieGoal} ккал/день', style: theme.bodySmall?.copyWith(color: AppColors.primary)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 120),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () async {
                        final ok = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Выйти из аккаунта?'),
                            content: const Text('Все данные будут удалены.'),
                            actions: [
                              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Отмена')),
                              FilledButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                style: FilledButton.styleFrom(backgroundColor: AppColors.destructive),
                                child: const Text('Выйти'),
                              ),
                            ],
                          ),
                        );
                        if (ok == true && context.mounted) {
                          await user.logout();
                        }
                      },
                      borderRadius: BorderRadius.circular(24),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.destructive.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: AppColors.destructive.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Icon(Icons.logout, size: 20, color: AppColors.destructive),
                            ),
                            const SizedBox(width: 16),
                            Expanded(child: Text('Выйти из аккаунта', style: theme.bodyLarge?.copyWith(color: AppColors.destructive))),
                            Icon(Icons.chevron_right, size: 20, color: AppColors.destructive),
                          ],
                        ),
                      ),
                    ),
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

class _ProfileRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool isEditing;
  final TextEditingController controller;

  const _ProfileRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.isEditing,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Glass(
      padding: const EdgeInsets.all(16),
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
            child: Icon(icon, size: 20, color: AppColors.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: theme.bodySmall?.copyWith(color: AppColors.mutedForeground)),
                if (isEditing)
                  TextField(
                    controller: controller,
                    keyboardType: label == 'Вес' ? const TextInputType.numberWithOptions(decimal: true) : TextInputType.number,
                    decoration: const InputDecoration(isDense: true, border: InputBorder.none),
                    style: theme.bodyLarge?.copyWith(color: AppColors.foreground),
                  )
                else
                  Text(value, style: theme.bodyLarge?.copyWith(color: AppColors.foreground)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
