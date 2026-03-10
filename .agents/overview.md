/**
 * @file overview.md
 * @description Этот файл предназначен для Jules AI. Он описывает текущее состояние проекта, 
 * архитектурные границы и правила, чтобы агенты могли работать параллельно без конфликтов.
 */

# Project Status: Sprint 0 (Initialization)

## 🏢 Core Architecture
Мы используем модульную структуру на базе Bun. 
- **Services**: Вся бизнес-логика (`src/services`).
- **Commands**: Интерфейс CLI (`src/commands`), построенный по паттерну Wizard/Steps.
- **Templates**: MDX-шаблоны для генерации документов.

## 🏁 CODE RULES (Critical)
1. **Алиасы (Paths)**: ОБЯЗАТЕЛЬНО используйте `@/` для импортов. 
   - Правильно: `import { ... } from "@/core/config.types"`
2. **Типизация (Modularity)**: Разделяйте типы на логические файлы в `src/core/` по принципу ответственности. Не создавайте монолитных файлов типов.
3. **Legacy Template**: Папка `legacy-template/` является справочной и доступна только для чтения. Не вносите в неё правки.
4. **Окружение**: Bun и TS алиасы уже настроены в `tsconfig.json`.

## 🤝 Agent Coordination
Подробные роли описаны в [AGENTS.md](../AGENTS.md). 
Каждый агент должен создать свою ветку (напр., `jules/alpha-config-service`) и подготовить PR.
