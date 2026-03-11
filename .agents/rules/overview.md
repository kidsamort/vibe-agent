# 📔 Project Overview: Vibe-Agent

`vibe-agent` — это CLI-фреймворк для "Vibecoding", предназначенный для ускорения разработки через глубокую интеграцию ИИ-агентов в рабочий процесс.

## 🏗️ Core Stack

- **Runtime**: Bun (быстрый, современный).
- **Language**: TypeScript (Strict Mode).
- **CLI Framework**: Custom (на базе Consola).
- **Templating**: MDX (Markdown + JSX) для генерации документации и кода.

## 🧩 Key Architecture Components

1. **Intelligence Layer**: Интерактивная гидратация (`vibe hydrate`). ИИ проводит интервью с пользователем и заполняет шаблоны.
2. **Automation Layer (Skills)**: Команда `vibe run` запускает локальные скрипты (`.agents/skills/`). Это позволяет ИИ делать "грязную" работу (массовые правки, сбор контекста) без огромных затрат токенов.
3. **Plugin System**: Поддержка локальных плагинов и NPM-пакетов (`vibe-plugin-*`).
4. **Sync Engine**: Умная синхронизация изменений в конфиге с документами проекта.

## 📁 Repository Map

- `src/core`: Типы, промпты и константы.
- `src/services`: Основная бизнес-логика (Config, PluginManager, SkillRunner).
- `src/commands`: Логика команд CLI.
- `.agents/skills`: "Навыки" — исполняемые скрипты для автоматизации.
- `templates/base`: Исходные MDX-шаблоны.
