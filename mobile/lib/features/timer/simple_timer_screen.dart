import 'package:flutter/material.dart';
import 'simple_timer_run_screen.dart';

class SimpleTimerScreen extends StatefulWidget {
  const SimpleTimerScreen({super.key});

  @override
  State<SimpleTimerScreen> createState() => _SimpleTimerScreenState();
}

class _SimpleTimerScreenState extends State<SimpleTimerScreen> {
  int _sets = 5;
  int _workTime = 30; // seconds
  int _restTime = 15; // seconds

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Интервальный таймер',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 32),
            _Stepper(
              label: 'Подходы',
              value: _sets,
              min: 1,
              max: 20,
              onChanged: (v) => setState(() => _sets = v),
            ),
            const SizedBox(height: 24),
            _Stepper(
              label: 'Работа (сек)',
              value: _workTime,
              min: 5,
              max: 300,
              onChanged: (v) => setState(() => _workTime = v),
            ),
            const SizedBox(height: 24),
            _Stepper(
              label: 'Отдых (сек)',
              value: _restTime,
              min: 5,
              max: 120,
              onChanged: (v) => setState(() => _restTime = v),
            ),
            const Spacer(),
            FilledButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => SimpleTimerRunScreen(
                    sets: _sets,
                    workTime: _workTime,
                    restTime: _restTime,
                  ),
                ),
              ),
              child: const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Text('Начать'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Stepper extends StatelessWidget {
  final String label;
  final int value;
  final int min;
  final int max;
  final ValueChanged<int> onChanged;

  const _Stepper({
    required this.label,
    required this.value,
    required this.min,
    required this.max,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label),
        Row(
          children: [
            SizedBox(
              width: 56,
              height: 56,
              child: IconButton.filled(
                icon: const Icon(Icons.remove),
                onPressed: value > min ? () => onChanged(value - 1) : null,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                '$value',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
            SizedBox(
              width: 56,
              height: 56,
              child: IconButton.filled(
                icon: const Icon(Icons.add),
                onPressed: value < max ? () => onChanged(value + 1) : null,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
