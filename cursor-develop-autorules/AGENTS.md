# AGENTS.md — INTERFIT

> **Для AI агентов:** Этот файл содержит проектные правила и workflow.
> **Глубокие правила:** `.cursor/rules/core-master.mdc`

---

## Part A. Project Quick Start

### Структура проекта

```
interfit/
├── lib/
│   ├── main.dart               # Entrypoint приложения
│   ├── core/
│   │   ├── utils/              # Форматирование даты/времени, helpers
│   │   ├── errors/             # Общие ошибки
│   │   ├── constants/          # Цвета, размеры
│   │   └── theme/              # Тема приложения
│   ├── features/
│   │   ├── profile/            # Профиль пользователя
│   │   │   ├── data/           # Репозитории, источники данных
│   │   │   ├── domain/         # Сущности, use cases
│   │   │   └── presentation/  # UI + state management
│   │   ├── workouts/           # Конструктор + список тренировок + таймер тренировки
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   ├── history/            # История тренировок
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   ├── timer/              # Универсальный таймер
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   ├── home/               # Главный экран
│   │   │   └── presentation/
│   │   └── shared/             # Общие виджеты (кнопки, прогресс-бары, текстовые поля)
│   └── app.dart                # Root widget
│
├── assets/
│   └── exercises.json          # База упражнений (предзаданная)
│
├── test/                       # Unit, widget, integration тесты
│
├── docs/
│   ├── TZ.md                   # Техническое задание (Source of Truth #1)
│   ├── tech-stack.md           # Технический стек
│   ├── project-structure.md    # Структура проекта
│   ├── tasks/                  # Task briefs (mandatory)
│   ├── artifacts/              # Worker/Judge artifacts (mandatory)
│   └── adr/                    # Architecture Decision Records
│
└── pubspec.yaml                # Зависимости Flutter
```

### Setup / Run

```bash
# Установка зависимостей
flutter pub get

# Запуск приложения (iOS)
flutter run -d ios

# Запуск приложения (Android)
flutter run -d android

# Запуск тестов
flutter test

# Анализ кода
flutter analyze
```

### Ключевые файлы

| Файл | Назначение |
|------|------------|
| `lib/main.dart` | Entrypoint приложения |
| `lib/app.dart` | Root widget с навигацией |
| `lib/features/home/presentation/pages/home_page.dart` | Главный экран |
| `lib/features/workouts/presentation/pages/workout_constructor_page.dart` | Конструктор тренировок |
| `lib/features/workouts/presentation/pages/workout_timer_page.dart` | Таймер тренировки |
| `lib/features/timer/presentation/pages/universal_timer_page.dart` | Универсальный таймер |
| `lib/features/history/presentation/pages/history_page.dart` | История тренировок |
| `lib/features/profile/presentation/pages/profile_page.dart` | Профиль пользователя |
| `lib/features/profile/domain/use_cases/get_daily_calorie_plan_use_case.dart` | Расчёт дневного плана по калориям |
| `lib/features/workouts/domain/use_cases/calculate_workout_calories_use_case.dart` | Расчёт калорий за тренировку |
| `lib/features/profile/data/repositories/profile_repository.dart` | Репозиторий профиля |
| `lib/features/workouts/data/repositories/workout_repository.dart` | Репозиторий тренировок |
| `assets/exercises.json` | База упражнений |
| `docs/TZ.md` | Техническое задание (Source of Truth) |

### Code Style

- Dart 3.0+ (null safety обязателен)
- Flutter 3.0+
- Clean Architecture + MVVM
- State management: ChangeNotifier / Riverpod / Bloc (выбрать и зафиксировать)
- `dart analyze` — без ошибок и по возможности без предупреждений
- Стиль: стандартный `dartfmt`
- Точечные изменения (не перезаписывать файлы целиком)
- Чёткое разделение слоёв (presentation / domain / data)

---

## Non-Negotiables (Project Rules)

Эти правила выведены из ТЗ и являются обязательными для всех агентов.

### 1. Entrypoint Rule

**Entrypoint файлы содержат только wiring — никакой бизнес-логики.**

Разрешено в entrypoint:
- imports
- routing setup
- layout components
- logging setup
- error boundaries
- инициализация хранилища (Hive/sqlite)

Запрещено в entrypoint:
- Расчёт калорий
- Бизнес-логика тренировок
- Валидация данных (только вызов валидаторов)
- Любая доменная логика

### 2. Clean Architecture Rule

**Строгое разделение слоёв: presentation → domain → data.**

- Presentation: только UI и state management (ViewModels/Notifiers)
- Domain: сущности (entities) и use cases (чистая бизнес-логика)
- Data: репозитории и источники данных (локальное хранилище)
- Presentation НЕ должна напрямую обращаться к data layer
- Use cases НЕ должны зависеть от Flutter-специфичных классов

### 3. Calorie Calculation Rule

**Расчёт калорий выполняется в domain layer по формулам из ТЗ.**

- Дневной план: формула Mifflin-St Jeor (BMR × коэффициент активности)
- Тренировка: MET × вес × длительность (только фазы работы)
- Реализация: use cases в `domain/use_cases/`
- Presentation НЕ должна рассчитывать калории самостоятельно
- Все формулы должны быть покрыты unit-тестами

### 4. Timer Background Rule

**Таймер должен работать в фоне и восстанавливать состояние при возврате.**

- При сворачивании приложения таймер продолжает отсчёт
- При возврате — восстановление текущего состояния
- Использовать background tasks или сохранение состояния в хранилище
- Таймер не должен "терять секунды" при переключении приложений

### 5. Local Storage Rule

**Все данные хранятся локально (v1.0 — полностью офлайн).**

- Профиль: `shared_preferences` или Hive
- Тренировки и история: Hive или sqflite (предпочтительно Hive)
- База упражнений: статический JSON в `assets/exercises.json`
- Нет backend в v1.0 — все операции локальные

### 6. Artifacts Rule

**Worker и Judge artifacts обязательны и blocking.**

- Worker ОБЯЗАН создать `docs/artifacts/workers/TASK-XXX.md`
- Judge ОБЯЗАН создать `docs/artifacts/judges/TASK-XXX.md`
- Отсутствие артефакта = задача не завершена
- Judge не проверяет код без WORKER HANDOFF

### 5. Planner DoD Rule

**Если entrypoint упомянут и требуется изменение — он должен быть в Files.**

Task Brief должен явно указывать entrypoint файлы в секции Files, если задача требует:
- Добавления нового route
- Изменения layout
- Подключения нового компонента

### 7. Config Rule

**Конфиги и константы валидируются на старте, fail-fast при ошибке.**

- Константы приложения: `lib/core/constants/`
- Цвета и тема: `lib/core/theme/`
- База упражнений: валидация при загрузке из `assets/exercises.json`
- При невалидных данных — ошибка при запуске
- Нет "fallback to defaults" для обязательных полей (например, база упражнений)

### 8. Scope Rule

**Запрет "улучшений мимо задачи".**

Worker НЕ должен:
- Рефакторить код вне scope задачи
- Добавлять "полезные" фичи, не указанные в Task Brief
- Менять архитектуру без ADR
- Добавлять зависимости без согласования (особенно state management библиотеки)
- Менять структуру папок без явного указания в Task Brief

### 8. Artifact-First Rule

**Worker artifact создаётся ДО финального коммита, а не после.**

Порядок завершения задачи Worker:
1. Код и тесты готовы
2. Создать `docs/artifacts/workers/TASK-XXX.md`
3. `git add .` (включая artifact)
4. Финальный коммит
5. `git status` должен показать clean working tree
6. WORKER HANDOFF

Нарушения:
- Коммит без artifact в staging = нарушение процесса
- Незакоммиченные файлы после HANDOFF = задача не завершена
- Judge обязан проверить clean working tree перед ревью

### 9. Auto-Merge Rule

**После Judge APPROVE merge выполняется автоматически как часть Judge workflow.**

Условия для auto-merge:
- Judge вынес решение APPROVE
- `git status` показывает clean working tree
- Ветка mergeable (нет конфликтов с main)
- Все тесты прошли

Действия Judge после APPROVE:
1. Проверить отсутствие конфликтов
2. Выполнить merge в main (squash или merge commit)
3. Удалить task-ветку
4. Записать результат в Judge artifact

При конфликтах:
- Judge выносит REQUEST_CHANGES с требованием rebase
- Worker выполняет rebase и повторный HANDOFF

### 10. Data Privacy Rule

**Данные пользователя хранятся локально и не передаются на сервер (v1.0).**

- Все данные (профиль, тренировки, история) хранятся только локально
- В v1.0 нет передачи данных на сервер
- При удалении приложения все данные удаляются вместе с ним
- В будущих версиях при добавлении backend — соблюдение требований 152-ФЗ
- Логирование не должно содержать чувствительные данные пользователя

---

## Part B. Project Workflow: Planner – Worker – Judge

Этот проект использует структурированный multi-agent workflow для
предсказуемой реализации по спецификациям.

### Sources of Truth (приоритет)

1. `docs/TZ.md` — Техническое задание (основной Source of Truth)
2. `docs/tech-stack.md` — Технический стек
3. `docs/project-structure.md` — Структура проекта
4. `docs/backlog_planner.md` — Backlog задач
5. `docs/adr/*.md` — Architecture Decision Records
6. `assets/exercises.json` — База упражнений (структура данных)

Агенты НЕ должны переопределять эти документы.
При конфликте или неоднозначности — эскалация вместо догадок.

### Planner Agent

Назначение:
- Решает ЧТО реализуется дальше и в КАКОМ порядке.

Обязанности Planner:
- Выбирает задачи из `docs/backlog_planner.md`
- Формирует чёткие task briefs для Worker
- Проверяет зависимости перед стартом
- Эскалирует недостающие/неясные спецификации

Ограничения Planner:
- НЕ пишет production code
- НЕ меняет архитектуру или контракты
- НЕ обходит backlog

### Task Brief Template (STRICT, MUST USE)

Planner НЕ имеет права отклоняться от шаблона. Отсутствие любой секции = STOP.

```markdown
---
TASK-<ID> <Название>

Role:
<Frontend Worker | Backend Worker | Infrastructure Worker>
Sprint:
<Sprint N>
Priority:
<High | Medium | Low>

Context:
- <doc/path> — <section>
- <doc/path> — <section>

Goal:
<что должно быть сделано, без описания реализации>

Entry point:
- <single entrypoint file, e.g. lib/features/workouts/presentation/pages/workout_constructor_page.dart>

Run:
- <command>
- Documented in: <doc/path>

Acceptance Criteria:
- <observable pass/fail criterion>
- <observable pass/fail criterion>

Tests:
- <Required | Optional | Not required> — <why>
- <If Optional/Not required, list smoke check>

Files:
- `<path/to/file.ext>`
- `<path/to/module.ts>`

Out of Scope:
- <bullet 1>
- <bullet 2>
- <bullet 3>

Notes:
(only if needed, otherwise omit)
---
```

### Task Brief Naming Convention

**Format:** `TASK-<ID>-<slug>.md`

**Slug generation rules:**
- Derived from task title (first line after `TASK-<ID>`)
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters (keep only alphanumeric and hyphens)

**Examples:**
✅ Correct:
- `TASK-001-home-page.md`
- `TASK-002-workout-constructor.md`
- `TASK-003-calorie-calculation-use-case.md`
- `TASK-004-timer-background-support.md`

❌ Incorrect:
- `TASK-001.md` (missing slug)
- `TASK-001_workout.md` (wrong separator, use hyphens)
- `TASK-001 Workout.md` (spaces in filename)

### Task Brief DoD (Planner Gate)

Planner MUST pass this checklist before saving `docs/tasks/TASK-<ID>-<slug>.md`:
- One entrypoint is specified.
- Run command is specified and doc path is listed.
- Acceptance Criteria are observable pass/fail.
- Files list specific files/modules (not "frontend/" or "backend/").
- Tests field is present (Required/Optional/Not required + reason).
- Out of Scope has 3–5 bullets.
- **Filename follows format `TASK-<ID>-<slug>.md` where slug is derived from task title.**
- **If entrypoint changes are needed, entrypoint file is in Files.**

### Test Policy (default)

- Adds logic (расчёт калорий, валидация, use cases): unit tests REQUIRED.
- UI components: widget tests REQUIRED (Flutter Testing).
- Repositories/data layer: unit tests REQUIRED.
- Infrastructure/skeleton: tests OPTIONAL, but include a smoke check.
- Integrations: at least one integration test OR explicit manual checklist.
- E2E: для критических user flows (создание тренировки, запуск таймера, сохранение в историю).

Each Task Brief MUST include `Tests:` with Required/Optional/Not required + reason.

### Planner Prompt (thin)

Use this minimal prompt; the rest is enforced by this AGENTS.md:
```
Role: Planner only.
Instructions:
- Select the next task from docs/backlog_planner.md.
- Fill the Task Brief STRICTLY using the template in AGENTS.md.
- Pass the Task Brief DoD checklist in AGENTS.md before saving.
- **Generate slug from task title: convert to lowercase, replace spaces with hyphens, remove special characters (keep only alphanumeric and hyphens).**
- **Save the brief to docs/tasks/TASK-<ID>-<slug>.md (MANDATORY format — filename MUST include slug).**
- Ensure entrypoint follows Flutter structure (lib/features/.../presentation/pages/...)
- Stop after saving. Do not proceed to Worker or Judge.
```

### Worker Agent

Назначение:
- Реализует ровно ОДНУ назначенную задачу.

Обязанности Worker:
- Пишет код и тесты по task brief
- Строго следует указанным спецификациям
- Держит изменения в рамках задачи

Ограничения Worker:
- Без архитектурных изменений
- Без изменений data model или Content Types, если это не часть задачи
- Без "попутных" улучшений

### Worker Prompt (thin)

Use this minimal prompt; the rest is enforced by AGENTS.md:
```
Role: Worker only.
Instructions:
- Read the Task Brief in docs/tasks/TASK-XXX-*.md.
- Follow AGENTS.md (Sources of Truth + Git Workflow + Non-Negotiables).
- Follow Clean Architecture: presentation → domain → data layers.
- Create branch `task/TASK-XXX-short-slug` before any changes.
- Implement only the Task Brief scope; commit changes in the task branch.
- Run `flutter analyze` and fix all errors before handoff.
- Prepare result for Judge review (PR link or git diff).

Pre-handoff checklist (mandatory, in order):
1. [ ] Code and tests ready
2. [ ] `flutter analyze` passes (0 errors)
3. [ ] Worker artifact saved to `docs/artifacts/workers/TASK-XXX.md`
4. [ ] All files staged: `git add .` (including artifact!)
5. [ ] Final commit created (artifact included)
6. [ ] `git status` shows "nothing to commit, working tree clean"
7. [ ] WORKER HANDOFF prepared

IMPORTANT: Do NOT provide WORKER HANDOFF until `git status` shows clean tree.
Uncommitted files = task NOT DONE.

If you cannot produce a complete WORKER HANDOFF:
- Do not finish the task.
- Ask for clarification or state what blocks you.
- Stop.
Prohibitions:
- Do not commit to `main`.
- Do not merge on your own.
- Do not take the next task.
- Do not mix layers (presentation should not directly access data).
```

### Worker Definition of Done (DoD)

- Реализована только логика из Task Brief.
- Все Acceptance Criteria выполнены.
- Tests выполнены согласно секции Tests: в задаче.
- Не добавлены новые файлы/конфиги вне списка Files:.
- Код форматирован и проект запускается.
- **Worker artifact включён в коммит (не создан после).**
- **`git status` показывает "nothing to commit, working tree clean".**

### Worker Output Contract

Worker обязан в конце задачи предоставить:
- Краткое описание изменений.
- Список изменённых/добавленных файлов.
- Инструкцию "как проверить" (1–3 шага).
- Branch name.
- Commit(s).
- PR link (если используется).

### Worker Artifacts (mandatory)

После завершения задачи Worker обязан сохранить артефакт:
- Путь: `docs/artifacts/workers/TASK-XXX.md`
- Формат: раздел `WORKER HANDOFF` с теми же пунктами, что в Worker Output Contract
- Дополнительно: указать дату/время и статус тестов (run/skip + причина)

If WORKER HANDOFF is missing or incomplete:
- The task is considered NOT DONE.
- Judge must return REQUEST_CHANGES without reviewing code.

### Worker Explicit Prohibitions

- Запрещено добавлять новые конфиги, entrypoints, зависимости вне Files.
- Запрещено "улучшать архитектуру".
- Запрещено коммитить в `main`.
- Запрещено делать merge самостоятельно.
- Запрещено брать следующую задачу.

### Judge Agent

Назначение:
- Решает, завершена ли задача (DONE).

Обязанности Judge:
- Проверяет критерии приёмки
- Сверяет с ТЗ и архитектурой
- Проверяет наличие обязательных тестов

Ограничения Judge:
- НЕ пишет новые фичи
- НЕ расширяет scope задачи

Решения Judge:
- APPROVE
- REQUEST_CHANGES (с конкретными замечаниями)

Judge must NOT review implementation if WORKER HANDOFF is missing.
Missing handoff is an automatic REQUEST_CHANGES.

### Judge Definition of Done (DoD)

Judge обязан проверить:
- Все Acceptance Criteria из Task Brief.
- Соответствие `docs/TZ.md` и `docs/project-structure.md`.
- Соблюдение Tests policy (секции Tests в задаче).
- Соблюдение Clean Architecture (разделение слоёв).
- `flutter analyze` выполнен без ошибок.
- Отсутствие изменений вне scope задачи.
- **Task brief filename follows format `TASK-<ID>-<slug>.md` (if reviewing task brief creation).**
- **Branch is mergeable (no conflicts with main).**
- Наличие `docs/artifacts/judges/TASK-XXX.md`.

При APPROVE Judge обязан:
- **Создать Judge artifact ДО merge (см. Judge Workflow Order).**
- **Выполнить merge в main (squash или merge commit) с artifact в commit.**
- **Проверить что artifact попал в merge commit (`git show HEAD --stat`).**
- **Удалить task-ветку после успешного merge.**
- **Записать merge status в artifact (до или после merge, но artifact должен быть в commit).**

### Judge Decision Matrix

- APPROVE: все AC выполнены, DoD соблюдён.
- REQUEST_CHANGES: перечислить конкретные нарушения (AC not met, Scope violation, Missing tests, Docs mismatch).

### Judge Artifacts (mandatory)

После завершения ревью Judge обязан сохранить артефакт:
- Путь: `docs/artifacts/judges/TASK-XXX.md`
- Формат:
  - Решение: APPROVE или REQUEST_CHANGES
  - Проверенные AC (ok/fail)
  - Tests policy: соблюдено/нет + причина
  - Замечания (если есть)
  - **Merge status: Merged to main / Merge failed (reason) / N/A (if REQUEST_CHANGES)**
  - **Branch cleanup: Deleted / Kept (reason)**

### Judge Workflow Order (MANDATORY for APPROVE)

**КРИТИЧЕСКИ ВАЖНО:** При решении APPROVE Judge ДОЛЖЕН следовать этому порядку операций строго:

1. **Создать Judge artifact:**
   - Сохранить `docs/artifacts/judges/TASK-XXX.md` с решением и проверками
   - Artifact должен быть создан ДО выполнения merge

2. **Проверить наличие artifact в task branch:**
   ```bash
   git checkout task/TASK-XXX
   git status  # должен показать artifact если он был создан на этой ветке
   ```
   - Если artifact НЕ в task branch:
     - Добавить: `git add docs/artifacts/judges/TASK-XXX.md`
     - Закоммитить: `git commit -m "docs(task-XXX): add judge review artifact"`
   - Если artifact уже в task branch → перейти к шагу 3

3. **Переключиться на main:**
   ```bash
   git checkout main
   ```

4. **Выполнить merge:**
   ```bash
   git merge --squash task/TASK-XXX
   ```

5. **Проверить что artifact в staged changes:**
   ```bash
   git status
   ```
   - **MUST SHOW:** `docs/artifacts/judges/TASK-XXX.md` в staged files
   - Если artifact НЕ в staged → **STOP**, вернуться к шагу 2

6. **Завершить merge commit:**
   ```bash
   git commit -m "feat(task-XXX): [description]"
   ```

7. **Проверить что artifact в commit:**
   ```bash
   git show HEAD --stat
   ```
   - **MUST SHOW:** `docs/artifacts/judges/TASK-XXX.md` в списке изменённых файлов
   - Если artifact НЕ в commit → **STOP**, исправить через `git commit --amend`

8. **Удалить task branch:**
   ```bash
   git branch -D task/TASK-XXX
   ```

**Pre-merge Checklist (обязательно проверить перед шагом 4):**
- [ ] Judge artifact создан: `docs/artifacts/judges/TASK-XXX.md` существует
- [ ] Artifact в task branch или будет добавлен перед merge
- [ ] `git status` на task branch показывает clean working tree (или artifact staged)
- [ ] Все Acceptance Criteria проверены и документированы в artifact

**Post-merge Verification (обязательно проверить после шага 6):**
- [ ] `git show HEAD --stat` показывает Judge artifact в commit
- [ ] `git status` показывает clean working tree
- [ ] Judge artifact содержит правильный merge status

**Анти-паттерны (ЗАПРЕЩЕНО):**
- ❌ Создавать Judge artifact ПОСЛЕ merge
- ❌ Выполнять merge без проверки наличия artifact в staged
- ❌ Удалять ветку без проверки что artifact в commit
- ❌ Пропускать шаги проверки (steps 5, 7)

### Judge Explicit Prohibitions

- Запрещено предлагать новые фичи.
- Запрещено менять формулировки задачи.
- Запрещено расширять scope.

### Definition of Done (default)

- `flutter analyze` выполнен без ошибок (или явно описаны как неприменимые)
- `flutter test` выполнен для добавленных тестов
- Нет лишних изменений вне scope задачи
- Соблюдена Clean Architecture (разделение слоёв)
- Если изменены контракты/поведение — обновлены соответствующие docs

### Escalation protocol

Формат BLOCKER-запроса от Worker к Planner:
- `BLOCKER: <кратко>`
- Контекст: что делаю, где упёрся
- Источник: какая спецификация противоречит/отсутствует
- Варианты: 1–2 возможных пути

Действия Planner:
- Уточняет/фиксирует требование в docs
- Переформулирует task brief и возвращает Worker

### Task Lifecycle

1. Planner выбирает задачу из `docs/backlog_planner.md`
2. Planner выдаёт task brief
3. Worker реализует задачу
4. Judge проводит ревью
5. Outcome:
   - APPROVE → Judge выполняет merge в main → task-ветка удаляется → задача завершена
   - REQUEST_CHANGES → Worker исправляет

### Rules of Engagement

- Одна задача за раз
- Никаких молчаливых допущений
- Архитектурные изменения требуют ADR
- Worker не должен добавлять новые конфиги, если они не перечислены в `Files`.
- Judge — финальная инстанция по завершению
- Specs > Backlog > Task Brief

### Process Integrity (Role Symmetry)

- Planner определяет "что".
- Worker реализует "как".
- Judge решает "достаточно ли".

### Escalation Rules (role boundaries)

- Worker не решает неоднозначность сам — эскалирует Planner.
- Judge не "чинит" задачу — при необходимости возвращает Planner.

### Single Source of Truth

- Task Brief — единственный контракт между ролями.

### Anti-Patterns

- Worker расширяет scope задачи
- Planner правит код напрямую
- Judge запрашивает новые фичи
- Реализация при отсутствии спецификаций

---

## Git Workflow (mandatory)

Цель: единый workflow для регулярных коммитов, изолированной истории задач и gate от Judge.

### Core Rules

- Одна задача = одна ветка.
- Формат ветки: `task/TASK-XXX-short-slug`.
- Прямые коммиты в `main` запрещены.
- Merge в `main` возможен только после Judge APPROVE.

### Role Responsibilities (Git)

Planner:
- Коммитит Task Brief в `docs/tasks/TASK-XXX-*.md` до старта задачи.

Worker:
- Создаёт task-ветку.
- Коммитит изменения только в своей ветке.
- Подготавливает PR или diff для Judge.
- При REQUEST_CHANGES с конфликтами — выполняет rebase.

Judge:
- Выносит решение APPROVE / REQUEST_CHANGES.
- **При APPROVE — выполняет merge в main и удаляет task-ветку.**
- При конфликтах — REQUEST_CHANGES с требованием rebase.

### Commit & PR Conventions (minimum)

- Commit message: `feat(task-001): ...`, `docs(task-001): ...`
- PR title: `TASK-001: <short description>`

### Merge Policy

- **Merge выполняется Judge'ом сразу после APPROVE (Auto-Merge Rule).**
- Метод: squash (default) или merge commit.
- После merge task-ветка удаляется автоматически.
- При конфликтах: Judge выносит REQUEST_CHANGES с требованием rebase от Worker.

---

## Security & Data

- Do not store secrets in the repo
- Do not edit `.env` (explicitly forbidden, если используется)
- Все данные хранятся локально (v1.0 — полностью офлайн)
- При удалении приложения все данные удаляются вместе с ним
- Логирование не должно содержать чувствительные данные пользователя
- В будущих версиях при добавлении backend — соблюдение требований 152-ФЗ
- Prod operations require explicit confirmation

## Monorepo Scoping

- Root `AGENTS.md` applies by default
- Subdirectory `AGENTS.md` overrides root for its scope

---

## Part C. Stabilization Mode

Stabilization Mode — специальный режим работы для фазы запуска и стабилизации проекта.

### When to Enable

Stabilization Mode активируется когда:
- Все TASK из backlog выполнены
- Проект требует запуска/тестирования
- Основная работа — исправление обнаруженных проблем

### Core Principles

- **Issue-driven:** каждая проблема начинается как ISSUE
- **No features:** никаких новых фич или рефакторингов
- **Minimal scope:** изменения строго в рамках одной issue
- **Reproduction focus:** Judge проверяет что issue не воспроизводится

### Stabilization Workflow

```
Problem found
       ↓
docs/issues/ISSUE-XXX.md     ← Документирование проблемы
       ↓
Triage Agent                  ← Классификация (НЕ планирование!)
       ↓
Triage Result: Classification + Recommended Action
       ↓
Planner (Stabilization)       ← Создание FIX task
       ↓
Worker → Judge                ← Стандартный workflow
       ↓
Issue closed
```

### Exit Criteria

Выход из Stabilization Mode когда:
- 0 ISSUE с severity = Blocker
- 0 ISSUE с severity = High
- Core user flows работают (создание тренировки, запуск таймера, сохранение в историю, расчёт калорий)
- Таймер работает корректно в фоне
- Локальное хранилище работает стабильно
- Checklist в `docs/launch-readiness.md` выполнен

---

### Triage Agent

**Назначение:**
- Классифицирует issues БЕЗ планирования решения
- Создаёт "буфер" между обнаружением и планированием
- Предотвращает bias Planner'а

**Обязанности Triage Agent:**
- Читает ISSUE-XXX.md
- Классифицирует тип: Bug / Config / UX / Infra / Spec gap
- Определяет severity: Blocker / High / Medium / Low
- Рекомендует action: FIX / DOC / Accept
- Указывает suggested role: Worker / Doc Editor

**Ограничения Triage Agent:**
- НЕ предлагает реализацию
- НЕ пишет код
- НЕ создаёт задачи (только рекомендует)
- НЕ расширяет scope проблемы

### Triage Agent Prompt

```
Role: Triage Agent.

Input:
- docs/issues/ISSUE-XXX.md
- (при необходимости) README.md, AGENTS.md, TZ.md

Task:
1. Классифицировать issue:
   - Type: Bug / Config / UX / Infra / Spec gap
   - Severity: Blocker / High / Medium / Low
2. Определить action:
   - FIX: требуется код-фикс
   - DOC: требуется изменение документации
   - Accept: принять как ожидаемое поведение
3. Указать suggested next role:
   - Worker (для кода)
   - Doc Editor (для документации)
   - None (если Accept)

Prohibitions:
- Не предлагай реализацию
- Не пиши код
- Не создавай задачи

Output format:
## Triage Result: ISSUE-XXX

**Classification:**
- Type: <type>
- Severity: <severity>

**Analysis:**
<1-2 предложения почему это именно такой тип>

**Recommended Action:** <FIX | DOC | Accept>

**Rationale:**
<почему именно такой action>

**Suggested Next Role:** <Worker | Doc Editor | None>

**Notes:**
<дополнительные наблюдения если есть>
```

### Triage Agent DoD

- Classification указан (Type + Severity)
- Action рекомендован с rationale
- Suggested role указан
- Реализация НЕ предложена

---

### Stabilization Planner

В Stabilization Mode Planner работает иначе:

**Вход:** Triage Result от Triage Agent

**Обязанности:**
1. Читает Triage Result (НЕ пересматривает classification)
2. Если Action = FIX → создаёт FIX-XXX.md по шаблону
3. Если Action = DOC → создаёт DOC change task
4. Если Action = Accept → закрывает issue с пояснением

**Ограничения:**
- НЕ создаёт TASK (только FIX)
- НЕ пересматривает Triage classification
- НЕ расширяет scope
- НЕ предлагает features

### Stabilization Planner Prompt

```
Role: Stabilization Planner.

Context:
- Stabilization Mode активен
- Работа issue-driven
- Вход: Triage Result от Triage Agent

Instructions:
1. Прочитать Triage Result для ISSUE-XXX
2. НЕ пересматривать classification (доверять Triage Agent)
3. На основе Recommended Action:
   - FIX → создать FIX-XXX.md по шаблону
   - DOC → создать DOC change task
   - Accept → закрыть issue с пояснением
4. Сохранить в docs/tasks/FIX-XXX-<slug>.md
5. Остановиться

Prohibitions:
- Не создавать TASK (только FIX)
- Не пересматривать Triage classification
- Не расширять scope
- Не предлагать features
```

---

### FIX Task Brief Template

FIX tasks отличаются от обычных TASK — они имеют узкий scope и фокусируются на одной проблеме.

```markdown
---
FIX-<ID> <Short title>

Role:
<Frontend Worker | Backend Worker | Infrastructure Worker>
Priority:
<Blocker | High | Medium | Low>

Issue:
- docs/issues/ISSUE-XXX.md

Context:
- <relevant doc or code reference>

Goal:
<что починить — одно предложение>

Entry point:
- <single file where fix starts, e.g. lib/features/workouts/presentation/pages/workout_timer_page.dart>

Repro before fix:
1. <step>
2. <step>
3. <observed: ...>

Acceptance Criteria:
- Issue ISSUE-XXX не воспроизводится
- <additional check if needed>

Tests:
- <Required | Optional | Not required>

Files:
- `<path/to/file.ext>` (минимум файлов)

Out of Scope:
- Любые изменения вне scope issue
- Рефакторинг
- "Попутные улучшения"
---
```

### FIX vs TASK Comparison

| Аспект | TASK | FIX |
|--------|------|-----|
| Scope | Feature / Capability | Одна проблема |
| Files | Может быть много | Минимум |
| AC | Функциональные | "Issue не воспроизводится" |
| Judge focus | Design quality | Reproduction check |
| Создаётся | Из backlog | Из ISSUE через Triage |

---

### Role Behavior in Stabilization Mode

**Worker (Stabilization):**
- Минимальные изменения
- Только scope из FIX task
- Запрещено: "попутные улучшения", рефакторинг
- Artifact: `docs/artifacts/workers/FIX-XXX.md`

**Judge (Stabilization):**
- Проверяет: issue не воспроизводится
- НЕ оценивает design quality
- Фокус: regression check
- Проверяет что scope не расширен
- Artifact: `docs/artifacts/judges/FIX-XXX.md`

---

### Issue Management

**Создание Issue:**
- Шаблон: `docs/issues/ISSUE-TEMPLATE.md`
- Naming: `ISSUE-XXX-short-slug.md`
- Обязательные поля: Type, Severity, Repro steps

**Issue Types:**
| Type | Описание |
|------|----------|
| Bug | Код работает не так, как задокументировано |
| Config | Проблема с конфигурацией / environment |
| UX | Несоответствие ожиданиям пользователя |
| Timer | Проблема с таймером (фоновая работа, восстановление состояния) |
| Storage | Проблема с локальным хранилищем (Hive/sqlite) |
| Calculation | Ошибка в расчёте калорий или дневного плана |
| Spec gap | Спецификация не покрывает реальный случай |

**Severity Guide:**
| Severity | Описание |
|----------|----------|
| Blocker | Проект не запускается / критический путь сломан |
| High | Основной функционал не работает |
| Medium | Вторичный функционал / ухудшенный UX |
| Low | Косметика / nice-to-have |

---

**Последнее обновление:** 2026-01-26
**Версия:** 1.0 (INTERFIT)
