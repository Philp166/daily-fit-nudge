import 'package:flutter/material.dart';

/// Matches web CSS variables (index.css, tailwind).
class AppColors {
  AppColors._();

  // Dark theme base
  static const Color background = Color(0xFF0B0D14); // hsl(230 25% 5%)
  static const Color foreground = Colors.white;

  static const Color card = Color(0xFF111318); // hsl(230 20% 8%)
  static const Color primary = Color(0xFF22D3EE); // cyan hsl(190 95% 55%)
  static const Color primaryForeground = Color(0xFF0B0D14);

  static const Color muted = Color(0xFF1A1D26); // hsl(230 15% 12%)
  static const Color mutedForeground = Color(0x80FFFFFF); // 50%

  static const Color border = Color(0xFF252A36); // hsl(230 15% 18%)
  static const Color destructive = Color(0xFFEF4444);

  // Glass
  static const Color glassBg = Color(0x14FFFFFF); // 0.08
  static const Color glassBorder = Color(0x1FFFFFFF); // 0.12
  static const Color glassStrong = Color(0x1FFFFFFF); // 0.12
  static const Color badgeBg = Color(0x40000000); // 0.25
}
