# Multi-Agent Coordination Guide (Jules AI)

Этот файл — план захвата проекта агентами в несколько этапов. Мы НЕ запускаем всё сразу, чтобы избежать хаоса. Мы работаем по **Этапам (Phases)** с **Точками Синхронизации (Sync Points)**.

---

## 📅 ЭТАП 1: Фундамент (Foundation) ✅

**Статус**: **ЗАВЕРШЕНО**. Все базовые сервисы и структура вмерджены в `main`.
**Цель**: Создать рабочие сервисы и простейший CLI.

---

## 📅 ЭТАП 2: Гидратация и Интеллект (Hydration & Intelligence) 🚀

**Статус**: **В РАБОТЕ**. Агенты должны сделать `git pull origin main` перед началом.
**Цель**: Оживить шаблоны, внедрить систему промптов и расширить возможности плагинов.

### 🤖 Роли на Этап 2:

1. **Agent Alpha (Template Engine)**:
   - Реализовать `src/services/template.engine.ts`.
   - Логика замены переменных `{var}` в MDX-шаблонах.
2. **Agent Beta (Wizard)**:
   - Расширить `vibe init` многошаговым ворклоу (Stack select, Tracking toggle).
   - Интеграция с `ConfigService` для сохранения всех ответов.
3. **Agent Gamma (AI logic)**:
   - Создать `src/core/prompts/` и разработать системные промпты для гидратации.
   - Формирование JSON-структуры для заполнения шаблонов.
4. **Agent Delta (Plugin v1)**:
   - Расширить `PluginManager` для поиска и загрузки шаблонов из папок плагинов.
   - Метод `getTemplatePath(pluginName, templateName)`.

---

## 🏁 ТОЧКА СИНХРОНИЗАЦИИ №2 (Sync Point)

**Действие Пользователя**:

1. Смерджить PR.
2. Проверить команду `vibe init` (полный цикл опроса).
3. Убедиться, что `TemplateEngine` корректно подставляет данные в `01-vision.mdx`.

---

## 🛠️ Правила Workflow

1. **Source of Truth**: Перед работой агент читает `architecture_design.md` и `AGENTS.md`.
2. **Branching**: Ветка от `main` (напр., `jules/feat-plugin-service`).
3. **Type Modularity**: ЗАПРЕЩЕНО складывать все типы в один файл. Разносите их по логическим файлам в `src/core/` (напр., `config.types.ts`, `plugin.types.ts`).
4. **Legacy Protection**: Папка `legacy-template/` — СТРОГО только для чтения. Никаких правок внутри этой папки.
5. **PR-First**: Работа завершается Pull Request-ом.
6. **Isolation**: Агенты работают только в своих файлах, указанных в задачах.
