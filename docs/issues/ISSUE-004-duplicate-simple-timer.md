# ISSUE-004: Дублированный SimpleTimer компонент

## Status
**CLOSED - FIXED** ✅

## Resolution
Удалены:
- Неиспользуемое состояние `showSimpleTimer` (строка 54)
- Дублированный компонент `<SimpleTimer>` (строки 228-231)

---

## Type
Bug

## Severity
Medium

## Platform
WEB

## Description
В Index.tsx рендерятся два экземпляра компонента `<SimpleTimer>`. Один используется, второй — мёртвый код.

## Affected Files
- `src/pages/Index.tsx` (строки 174 и 228)

## Code
```tsx
// Строка 174 - ИСПОЛЬЗУЕТСЯ
{activeTab === 'timer' && (
  <SimpleTimer isOpen={true} onClose={() => setActiveTab('home')} />
)}

// Строка 228 - НЕ ИСПОЛЬЗУЕТСЯ (showSimpleTimer никогда не становится true)
<SimpleTimer
  isOpen={showSimpleTimer}
  onClose={() => setShowSimpleTimer(false)}
/>
```

## Root Cause
- `showSimpleTimer` объявлен на строке 54, но нигде не устанавливается в `true`
- Вероятно, остаток от рефакторинга

## Fix Approach
1. Удалить неиспользуемый компонент (строка 228-231)
2. Удалить неиспользуемое состояние `showSimpleTimer` (строка 54)

## Impact
- Лишний код в бандле
- Путаница при чтении кода
- Потенциальные баги при дальнейшем развитии
