import 'dart:ui';
import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Glassmorphism container matching web .glass and .glass-strong.
class Glass extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;
  final bool strong;

  const Glass({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius = 24,
    this.strong = false,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: strong ? 30 : 20, sigmaY: strong ? 30 : 20),
        child: Container(
          padding: padding ?? const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: strong ? AppColors.glassStrong : AppColors.glassBg,
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(color: AppColors.glassBorder, width: 1),
          ),
          child: child,
        ),
      ),
    );
  }
}
