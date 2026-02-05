import 'dart:async';
import 'package:flutter/material.dart';

class SimpleTimerRunScreen extends StatefulWidget {
  final int sets;
  final int workTime;
  final int restTime;

  const SimpleTimerRunScreen({
    super.key,
    required this.sets,
    required this.workTime,
    required this.restTime,
  });

  @override
  State<SimpleTimerRunScreen> createState() => _SimpleTimerRunScreenState();
}

class _SimpleTimerRunScreenState extends State<SimpleTimerRunScreen>
    with WidgetsBindingObserver {
  Timer? _timer;
  bool _isWork = true;
  int _setIndex = 0;
  bool _running = false;

  // Timestamp-based timing for background support
  DateTime? _phaseEndTime;
  int _pausedSecondsLeft = 0;

  int get _secondsLeft {
    if (!_running || _phaseEndTime == null) {
      return _pausedSecondsLeft;
    }
    final remaining = _phaseEndTime!.difference(DateTime.now()).inSeconds;
    return remaining > 0 ? remaining : 0;
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _pausedSecondsLeft = widget.workTime;
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _timer?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && _running) {
      // App returned from background - recalculate state
      _recalculateStateFromTimestamp();
    }
  }

  void _recalculateStateFromTimestamp() {
    if (_phaseEndTime == null) return;

    while (_phaseEndTime!.isBefore(DateTime.now())) {
      // Phase ended while in background
      if (_isWork) {
        _isWork = false;
        _phaseEndTime = _phaseEndTime!.add(Duration(seconds: widget.restTime));
      } else {
        _setIndex++;
        if (_setIndex >= widget.sets) {
          _timer?.cancel();
          _running = false;
          _phaseEndTime = null;
          _pausedSecondsLeft = 0;
          setState(() {});
          return;
        }
        _isWork = true;
        _phaseEndTime = _phaseEndTime!.add(Duration(seconds: widget.workTime));
      }
    }
    setState(() {});
  }

  void _tick() {
    final remaining = _secondsLeft;
    if (remaining <= 0) {
      if (_isWork) {
        _isWork = false;
        _phaseEndTime = DateTime.now().add(Duration(seconds: widget.restTime));
      } else {
        _setIndex++;
        if (_setIndex >= widget.sets) {
          _timer?.cancel();
          _running = false;
          _phaseEndTime = null;
          _pausedSecondsLeft = 0;
          setState(() {});
          return;
        }
        _isWork = true;
        _phaseEndTime = DateTime.now().add(Duration(seconds: widget.workTime));
      }
    }
    setState(() {});
  }

  void _toggle() {
    if (_running) {
      _timer?.cancel();
      _pausedSecondsLeft = _secondsLeft;
      _phaseEndTime = null;
    } else {
      _phaseEndTime = DateTime.now().add(Duration(seconds: _pausedSecondsLeft));
      _timer = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
    }
    _running = !_running;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final done = _setIndex >= widget.sets && !_running && _secondsLeft == 0;

    if (done) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.check_circle, size: 80, color: Colors.green),
                const SizedBox(height: 24),
                Text(
                  'Готово!',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 24),
                OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Закрыть'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final isWork = _isWork;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            AppBar(
              title: const Text('Таймер'),
              leading: IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            Expanded(
              child: Container(
                color: isWork ? Colors.blue.shade900 : Colors.green.shade900,
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        isWork ? 'РАБОТА' : 'ОТДЫХ',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        '${_secondsLeft ~/ 60}:${(_secondsLeft % 60).toString().padLeft(2, '0')}',
                        style: Theme.of(context).textTheme.displayLarge?.copyWith(
                              color: Colors.white,
                              fontFeatures: [const FontFeature.tabularFigures()],
                            ),
                      ),
                      Text(
                        'Подход ${_setIndex + 1} / ${widget.sets}',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Colors.white70,
                            ),
                      ),
                      const SizedBox(height: 48),
                      IconButton.filled(
                        onPressed: _toggle,
                        icon: Icon(_running ? Icons.pause : Icons.play_arrow),
                        iconSize: 48,
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: isWork ? Colors.blue : Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
