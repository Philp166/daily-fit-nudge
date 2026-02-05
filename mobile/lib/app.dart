import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/user_provider.dart';
import 'features/onboarding/onboarding_screen.dart';
import 'features/shell/main_shell.dart';

class InterfitApp extends StatelessWidget {
  const InterfitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Interfit',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      home: Consumer<UserProvider>(
        builder: (context, user, _) {
          if (!user.loaded) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          if (!user.isOnboarded) {
            return const OnboardingScreen();
          }
          return const MainShell();
        },
      ),
    );
  }
}
