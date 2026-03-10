---
id: task-template-index
title: "[Полное Название Задачи]"
epic: 'epic-module-a' # ОБЯЗАТЕЛЬНО: ID родительского эпика
status: "inbox"        # Статус: inbox | in-progress | done | archive
priority: "medium"      # Приоритет: low | medium | high | critical
assignee: ""            # ID исполнителя, например "ai-developer"
due_date: ""            # Срок выполнения в формате ГГГГ-ММ-ДД
tags:                   # Список тегов для фильтрации
  - "module-a"
  - "backend"
links:
  - type: 'implements'
    target: 'spec-feature-a'
    description: 'Эта задача реализует часть функционала, описанного в спецификации А.'
  - type: 'visualized_by'
    target: 'task-template-diagram-example'
    description: 'Архитектурные изменения в рамках этой задачи визуализированы в сопутствующей диаграмме.'
---

# Паспорт Задачи: [Полное Название Задачи]

_Этот документ является "обложкой" задачи и содержит все ее метаданные и ссылки на связанные документы._

## 1. Описание

_**Инструкция:** Скопируйте сюда полное описание задачи с канбан-доски. Оно должно четко отвечать на вопрос "Что нужно сделать?"._

**Пример:**
> Создать основной компонент для модуля А, который будет выполнять функцию X. Система должна включать в себя UI-часть и логику для обработки данных.

## 2. Связанные Документы

-   **Проектное Задание (План):** [./02-design-spec.md](./02-design-spec.md)
-   **Диаграмма:** [./03-diagram-example.md](./03-diagram-example.md)
-   **Рабочий Журнал:** [./04-implementation-notes.md](./04-implementation-notes.md)
-   **Финальный Отчет:** [./05-final-documentation.md](./05-final-documentation.md)
