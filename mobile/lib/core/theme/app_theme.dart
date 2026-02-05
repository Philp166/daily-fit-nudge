import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.dark(
        surface: AppColors.background,
        onSurface: AppColors.foreground,
        primary: AppColors.primary,
        onPrimary: AppColors.primaryForeground,
        secondary: AppColors.muted,
        onSecondary: AppColors.foreground,
        error: AppColors.destructive,
        outline: AppColors.border,
      ),
      fontFamily: GoogleFonts.manrope().fontFamily,
      textTheme: _textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.foreground,
        elevation: 0,
      ),
    );
  }

  static TextTheme get _textTheme {
    final base = GoogleFonts.manropeTextTheme();
    return base.copyWith(
      displayLarge: base.displayLarge?.copyWith(
        fontSize: 80,
        height: 1,
        fontWeight: FontWeight.w200,
        color: AppColors.foreground,
      ),
      displayMedium: base.displayMedium?.copyWith(
        fontSize: 56,
        height: 1,
        fontWeight: FontWeight.w200,
        color: AppColors.foreground,
      ),
      titleLarge: base.titleLarge?.copyWith(
        fontSize: 24,
        height: 1.2,
        fontWeight: FontWeight.w400,
        color: AppColors.foreground,
      ),
      bodyLarge: base.bodyLarge?.copyWith(
        fontSize: 16,
        height: 1.5,
        fontWeight: FontWeight.w300,
        color: AppColors.foreground,
      ),
      bodyMedium: base.bodyMedium?.copyWith(
        fontSize: 14,
        height: 1.4,
        fontWeight: FontWeight.w300,
        color: AppColors.mutedForeground,
      ),
      labelSmall: base.labelSmall?.copyWith(
        fontSize: 12,
        height: 1,
        fontWeight: FontWeight.w400,
        color: AppColors.mutedForeground,
      ),
    );
  }

  static const double radiusLg = 24;
  static const double radiusMd = 20;
  static const double radiusSm = 16;
}
