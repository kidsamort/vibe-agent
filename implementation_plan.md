# План реализации: vibe-agent (Phased Workflow)

## Этап 1: Фундамент (Sprint 1)

_Параллельная работа 4 агентов над базой._

- [x] **Alpha**: Config Service (YAML).
- [x] **Beta**: Init Command Skeleton (Steps logic).
- [x] **Gamma**: MDX Templates migration.
- [x] **Delta**: Plugin Manager base logic.

### 🚩 SYNC POINT 1

> **Действие**: Мердж всех веток в `main`. Валидация базового взаимодействия "CLI <-> Config".
> **Важно**: Агенты следующего этапа должны видеть реализованный `ConfigService`.

## Этап 2: Интеллектуальный Слой (Sprint 2)

_Использование наработок первого этапа для реализации логики._

- [x] **Alpha**: Template Engine (Hydration logic).
- [x] **Beta**: Multi-step Interview Wizard.
- [x] **Gamma**: AI Hydration Prompts (MDX logic).
- [x] **Delta**: Plugin Engine v1.

### 🚩 SYNC POINT 2

> **Действие**: Мердж и проверка процесса гидратации. Проект должен уметь создавать файлы из шаблонов.

## Этап 3: Автоматизация и Skills (Sprint 3)

- [ ] Реализация `vibe run` и системы Skills.
- [ ] Оптимизация токенов.
- [ ] Публикация в NPM.
