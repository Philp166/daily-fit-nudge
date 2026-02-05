import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/user_provider.dart';
import '../../core/models/workout_exercise.dart';
import '../../core/models/custom_workout.dart';
import '../../data/exercises.dart';
import 'workout_timer_screen.dart';

class WorkoutConstructorScreen extends StatefulWidget {
  final CustomWorkout? editWorkout;

  const WorkoutConstructorScreen({super.key, this.editWorkout});

  @override
  State<WorkoutConstructorScreen> createState() => _WorkoutConstructorScreenState();
}

class _WorkoutConstructorScreenState extends State<WorkoutConstructorScreen> {
  late List<WorkoutExercise> _exercises;
  final _nameController = TextEditingController();
  int _step = 0;

  @override
  void initState() {
    super.initState();
    if (widget.editWorkout != null) {
      _exercises = List.from(widget.editWorkout!.exercises);
      _nameController.text = widget.editWorkout!.name;
    } else {
      _exercises = [];
      _nameController.text = 'Моя тренировка';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  String get _name => _nameController.text.isEmpty ? 'Моя тренировка' : _nameController.text;

  int get _totalMinutes {
    int total = 0;
    for (final e in _exercises) {
      total += e.sets * (e.workTime + e.restTime);
    }
    return total ~/ 60;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Конструктор'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _step == 0 ? _buildConfig() : _buildPreview(),
    );
  }

  Widget _buildConfig() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: TextField(
            decoration: const InputDecoration(
              labelText: 'Название',
              border: OutlineInputBorder(),
            ),
            controller: _nameController,
            onChanged: (_) => setState(() {}),
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: _exercises.length + 1,
            itemBuilder: (context, i) {
              if (i == _exercises.length) {
                return ListTile(
                  leading: const Icon(Icons.add),
                  title: const Text('Добавить упражнение'),
                  onTap: _pickExercise,
                );
              }
              final e = _exercises[i];
              final meta = getExerciseById(e.exerciseId);
              return ListTile(
                title: Text(meta?.name ?? e.exerciseId),
                subtitle: Text('${e.sets} подходов · ${e.workTime}с работа / ${e.restTime}с отдых'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () => setState(() => _exercises.removeAt(i)),
                ),
              );
            },
          ),
        ),
        if (_exercises.isNotEmpty)
          Padding(
            padding: const EdgeInsets.all(16),
            child: FilledButton(
              onPressed: () => setState(() => _step = 1),
              child: const Text('Далее'),
            ),
          ),
      ],
    );
  }

  void _pickExercise() async {
    final chosen = await showModalBottomSheet<Exercise>(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        expand: false,
        builder: (context, scrollController) => ListView.builder(
          controller: scrollController,
          itemCount: exercises.length,
          itemBuilder: (context, i) {
            final e = exercises[i];
            return ListTile(
              title: Text(e.name),
              subtitle: Text(e.category),
              onTap: () => Navigator.pop(context, e),
            );
          },
        ),
      ),
    );
    if (chosen != null) {
      setState(() {
        _exercises.add(WorkoutExercise(
          exerciseId: chosen.id,
          sets: 3,
          workTime: 30,
          restTime: 15,
        ));
      });
    }
  }

  Widget _buildPreview() {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(_name, style: Theme.of(context).textTheme.headlineSmall),
            Text('${_exercises.length} упр. · $_totalMinutes мин', style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: _exercises.length,
                itemBuilder: (context, i) {
                  final e = _exercises[i];
                  final meta = getExerciseById(e.exerciseId);
                  return ListTile(
                    title: Text(meta?.name ?? e.exerciseId),
                    subtitle: Text('${e.sets} × ${e.workTime}с / ${e.restTime}с'),
                  );
                },
              ),
            ),
            FilledButton(
              onPressed: () => setState(() => _step = 0),
              child: const Text('Редактировать'),
            ),
            const SizedBox(height: 8),
            OutlinedButton(
              onPressed: () {
                context.read<UserProvider>().addCustomWorkout(
                      name: _name,
                      exercises: _exercises,
                      isFavorite: true,
                    );
                Navigator.pop(context);
              },
              child: const Text('В избранное'),
            ),
            const SizedBox(height: 8),
            FilledButton.tonal(
              onPressed: () {
                final user = context.read<UserProvider>();
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => WorkoutTimerScreen(
                      workoutName: _name,
                      exercises: _exercises,
                      weightKg: user.profile?.weight ?? 70,
                    ),
                  ),
                );
              },
              child: const Text('Старт'),
            ),
            const SizedBox(height: 8),
            OutlinedButton(
              onPressed: () async {
                final ok = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Отменить?'),
                    content: const Text('Уверены, что хотите отменить?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: const Text('Назад'),
                      ),
                      FilledButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        child: const Text('Да, отменить'),
                      ),
                    ],
                  ),
                );
                if (ok == true && mounted) Navigator.pop(context);
              },
              child: const Text('Отмена'),
            ),
          ],
        ),
      ),
    );
  }
}
