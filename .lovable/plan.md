
# План: Исправление виджетов Активность и Анализ недели

## Проблемы
1. **ActivityCard**: Появился нежелательный круговой прогресс-бар справа — нужно убрать
2. **AnalysisCard**: Круговой прогресс-бар не отображается/не анимируется корректно

---

## Изменения

### 1. ActivityCard — убрать CircularProgress

**Файл:** `src/components/dashboard/ActivityCard.tsx`

Удалить компонент `CircularProgress` и вернуть карточку к исходному виду — только текстовая статистика:

```text
Было:
┌─────────────────────────────┐
│ Активность                  │
│                             │
│   45 мин        ○───────○   │ ← Круговой прогресс (убрать)
│   из 60 мин                 │
└─────────────────────────────┘

Станет:
┌─────────────────────────────┐
│ Активность                  │
│                             │
│   45 мин                    │
│   из 60 мин                 │
└─────────────────────────────┘
```

Изменения:
- Удалить импорт `CircularProgress`
- Убрать `flex items-center justify-between` — оставить только текст
- Удалить JSX с `<CircularProgress />`

### 2. AnalysisCard — исправить CircularProgress

**Файл:** `src/components/dashboard/AnalysisCard.tsx`

Проблема: круговой прогресс-бар есть в коде (строка 55), но может не анимироваться из-за `delay={0.8}`.

Исправления:
- Уменьшить `delay` с 0.8 до 0.3 для более быстрого отображения
- Добавить fallback для случая когда `goal = 0` (защита от деления на ноль)
- Убедиться что `showValue={true}` работает корректно

```tsx
// Было
<CircularProgress value={percentage} size={90} delay={0.8} />

// Станет
<CircularProgress 
  value={goal > 0 ? percentage : 0} 
  size={90} 
  strokeWidth={8}
  delay={0.3} 
/>
```

---

## Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/components/dashboard/ActivityCard.tsx` | Удалить CircularProgress, упростить layout |
| `src/components/dashboard/AnalysisCard.tsx` | Исправить delay и добавить защиту от division by zero |

---

## Техническая часть

### ActivityCard — итоговый код

```tsx
const ActivityCard: React.FC = () => {
  const { getTodaySessions } = useUser();
  const todaySessions = getTodaySessions();
  
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const goalMinutes = 60;

  return (
    <WidgetCard gradient="activity" className="flex-1" delay={0.5}>
      <Badge className="mb-3">Активность</Badge>

      <div>
        <div className="mb-1">
          <span className="text-display-sm text-extralight text-foreground">
            {totalMinutes}
          </span>
          <span className="text-body text-foreground/80 ml-1">мин</span>
        </div>
        <p className="text-caption text-muted-white">
          из {goalMinutes} мин
        </p>
      </div>
    </WidgetCard>
  );
};
```

### AnalysisCard — исправленный CircularProgress

```tsx
const percentage = goal > 0 
  ? Math.min(Math.round((current / goal) * 100), 100) 
  : 0;

// В JSX:
<CircularProgress 
  value={percentage} 
  size={90} 
  strokeWidth={8}
  delay={0.3} 
/>
```
