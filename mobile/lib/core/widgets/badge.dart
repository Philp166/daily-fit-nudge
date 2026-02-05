import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Matches web Badge (badge-blur, rounded-full, text-badge).
class AppBadge extends StatelessWidget {
  final String text;
  final EdgeInsetsGeometry? padding;

  const AppBadge({super.key, required this.text, this.padding});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(999),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.badgeBg,
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text(
            text,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppColors.foreground.withValues(alpha: 0.9),
                  fontSize: 12,
                ),
          ),
        ),
      ),
    );
  }
}
