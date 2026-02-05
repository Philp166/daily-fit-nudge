import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../home/dashboard_screen.dart';
import '../timer/simple_timer_screen.dart';
import '../profile/profile_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  static const _tabs = [
    _TabData(icon: Icons.home_rounded, label: 'Главная'),
    _TabData(icon: Icons.timer_rounded, label: 'Таймер'),
    _TabData(icon: Icons.person_rounded, label: 'Профиль'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: const [
          DashboardScreen(),
          SimpleTimerScreen(),
          ProfileScreen(),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: _BottomNavPill(
            currentIndex: _index,
            onTap: (i) => setState(() => _index = i),
            tabs: _tabs,
          ),
        ),
      ),
    );
  }
}

class _TabData {
  final IconData icon;
  final String label;
  const _TabData({required this.icon, required this.label});
}

/// Pill-shaped bottom nav with sliding indicator (matches web BottomNav).
class _BottomNavPill extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<_TabData> tabs;

  const _BottomNavPill({
    required this.currentIndex,
    required this.onTap,
    required this.tabs,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(999),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.glassStrong,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: AppColors.glassBorder),
          ),
          child: Stack(
            children: [
              LayoutBuilder(
                builder: (context, constraints) {
                  final w = constraints.maxWidth / tabs.length;
                  return AnimatedPositioned(
                    duration: const Duration(milliseconds: 400),
                    curve: Curves.easeOutBack,
                    left: currentIndex * w + 4,
                    width: w - 8,
                    top: 4,
                    bottom: 4,
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.foreground,
                        borderRadius: BorderRadius.circular(999),
                      ),
                    ),
                  );
                },
              ),
              Row(
                children: List.generate(tabs.length, (i) {
                  final selected = currentIndex == i;
                  return Expanded(
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => onTap(i),
                        borderRadius: BorderRadius.circular(999),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                          child: Icon(
                            tabs[i].icon,
                            size: 22,
                            color: selected
                                ? AppColors.primaryForeground
                                : AppColors.foreground.withValues(alpha: 0.5),
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
