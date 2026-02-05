import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/glass.dart';
import '../../core/models/user_profile.dart';
import '../../providers/user_provider.dart';

/// 3 steps: name, age/height/weight, goal. Matches web Onboarding.tsx.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _step = 0;
  String _name = '';
  int _age = 25;
  int _height = 170;
  double _weight = 70;
  String _goal = 'maintain';

  static const _goals = [
    ('lose', 'Похудеть', 'Сжигать больше калорий', Icons.local_fire_department),
    ('maintain', 'Поддержать форму', 'Оставаться в тонусе', Icons.balance),
    ('gain', 'Набрать массу', 'Наращивать мышцы', Icons.fitness_center),
  ];

  void _next() {
    if (_step < 2) {
      setState(() => _step++);
    } else {
      _submit();
    }
  }

  void _submit() {
    context.read<UserProvider>().setProfile(
          UserProfile(
            name: _name.trim(),
            age: _age,
            height: _height,
            weight: _weight,
            goal: _goal,
            dailyCalorieGoal: 0,
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(3, (i) {
                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: i <= _step ? AppColors.primary : AppColors.muted,
                    ),
                  );
                }),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _step == 0
                      ? _buildStep0(theme)
                      : _step == 1
                          ? _buildStep1(theme)
                          : _buildStep2(theme),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () {
                    if (_step == 0 && _name.trim().length < 2) return;
                    _next();
                  },
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.primaryForeground,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(_step < 2 ? 'Далее' : 'Начать'),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep0(TextTheme theme) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        key: const ValueKey(0),
        children: [
          Row(
            children: [
              Icon(Icons.auto_awesome, color: AppColors.primary, size: 28),
              const SizedBox(width: 12),
              Text(
                'Привет!',
                style: theme.displayMedium?.copyWith(
                  fontWeight: FontWeight.w200,
                  color: AppColors.foreground,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Как тебя зовут?',
            style: theme.bodyLarge?.copyWith(color: AppColors.mutedForeground),
          ),
          const SizedBox(height: 32),
          TextField(
            onChanged: (v) => setState(() => _name = v),
            style: theme.titleLarge?.copyWith(color: AppColors.foreground),
            decoration: InputDecoration(
              hintText: 'Введи имя',
              filled: true,
              fillColor: AppColors.card,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
                borderSide: const BorderSide(color: AppColors.primary),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 20,
                vertical: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStep1(TextTheme theme) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        key: const ValueKey(1),
        children: [
          Text(
            'О тебе',
            style: theme.displayMedium?.copyWith(
              fontWeight: FontWeight.w200,
              color: AppColors.foreground,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Эти данные нужны для расчёта калорий',
            style: theme.bodyLarge?.copyWith(color: AppColors.mutedForeground),
          ),
          const SizedBox(height: 32),
          _NumberInput(
            label: 'Возраст',
            value: _age,
            min: 14,
            max: 100,
            onChanged: (v) => setState(() => _age = v),
          ),
          const SizedBox(height: 16),
          _NumberInput(
            label: 'Рост (см)',
            value: _height,
            min: 140,
            max: 220,
            onChanged: (v) => setState(() => _height = v),
          ),
          const SizedBox(height: 16),
          _NumberInput(
            label: 'Вес (кг)',
            value: _weight.round(),
            min: 40,
            max: 200,
            onChanged: (v) => setState(() => _weight = v.toDouble()),
          ),
        ],
      ),
    );
  }

  Widget _buildStep2(TextTheme theme) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        key: const ValueKey(2),
        children: [
          Text(
            'Твоя цель',
            style: theme.displayMedium?.copyWith(
              fontWeight: FontWeight.w200,
              color: AppColors.foreground,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Что хочешь достичь?',
            style: theme.bodyLarge?.copyWith(color: AppColors.mutedForeground),
          ),
          const SizedBox(height: 32),
          ..._goals.map((g) {
            final value = g.$1;
            final label = g.$2;
            final desc = g.$3;
            final iconData = g.$4;
            final selected = _goal == value;
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => setState(() => _goal = value),
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.primary.withValues(alpha: 0.2)
                          : null,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: selected
                            ? AppColors.primary
                            : Colors.transparent,
                        width: 2,
                      ),
                    ),
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
                                child: Icon(iconData, color: AppColors.primary),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      label,
                                      style: theme.bodyLarge?.copyWith(
                                        color: AppColors.foreground,
                                      ),
                                    ),
                                    Text(
                                      desc,
                                      style: theme.bodyMedium?.copyWith(
                                        color: AppColors.mutedForeground,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _NumberInput extends StatelessWidget {
  final String label;
  final int value;
  final int min;
  final int max;
  final ValueChanged<int> onChanged;

  const _NumberInput({
    required this.label,
    required this.value,
    required this.min,
    required this.max,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    return Glass(
      padding: const EdgeInsets.all(16),
      borderRadius: 16,
      child: Column(
        children: [
          Text(
            label,
            style: theme.bodyMedium?.copyWith(color: AppColors.mutedForeground),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _GlassButton(
                icon: Icons.remove,
                onPressed: value > min ? () => onChanged(value - 1) : null,
              ),
              Text(
                '$value',
                style: theme.displayMedium?.copyWith(
                  fontWeight: FontWeight.w200,
                  color: AppColors.foreground,
                ),
              ),
              _GlassButton(
                icon: Icons.add,
                onPressed: value < max ? () => onChanged(value + 1) : null,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _GlassButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;

  const _GlassButton({required this.icon, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppColors.glassBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.glassBorder),
          ),
          child: Icon(icon, color: AppColors.foreground),
        ),
      ),
    );
  }
}
