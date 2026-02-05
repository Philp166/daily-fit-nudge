import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Circular progress ring matching web CircularProgress.
class AppCircularProgress extends StatelessWidget {
  final double value;
  final double size;
  final double strokeWidth;
  final bool showValue;

  const AppCircularProgress({
    super.key,
    required this.value,
    this.size = 80,
    this.strokeWidth = 6,
    this.showValue = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    final clamped = value.clamp(0.0, 100.0);
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Transform.rotate(
            angle: -1.5708,
            child: CustomPaint(
              size: Size(size, size),
              painter: _CirclePainter(
                progress: clamped,
                strokeWidth: strokeWidth,
              ),
            ),
          ),
          if (showValue)
            Text(
              '${clamped.round()}',
              style: theme.bodyLarge?.copyWith(
                color: AppColors.foreground,
                fontWeight: FontWeight.w300,
              ),
            ),
        ],
      ),
    );
  }
}

class _CirclePainter extends CustomPainter {
  final double progress;
  final double strokeWidth;

  _CirclePainter({required this.progress, required this.strokeWidth});

  @override
  void paint(Canvas canvas, Size size) {
    final radius = (size.width - strokeWidth) / 2;
    final center = Offset(size.width / 2, size.height / 2);

    final bgPaint = Paint()
      ..color = AppColors.foreground.withValues(alpha: 0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(center, radius, bgPaint);

    final sweepAngle = 2 * 3.14159265359 * (progress / 100);

    final progressPaint = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -1.5708,
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CirclePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
