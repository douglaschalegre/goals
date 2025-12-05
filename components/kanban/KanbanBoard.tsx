"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useGoals } from "@/lib/goals-context";
import { KanbanColumn } from "./KanbanColumn";
import { CATEGORIES } from "@/components/shared/CategoryPicker";

interface KanbanBoardProps {
  readonly?: boolean;
}

export function KanbanBoard({ readonly = false }: KanbanBoardProps) {
  const { goals } = useGoals();

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        id="goals-kanban"
        className="flex gap-4 overflow-x-auto pb-6 px-2"
        style={{ minHeight: "600px" }}
      >
        {CATEGORIES.map((category) => (
          <KanbanColumn
            key={category.value}
            category={category}
            readonly={readonly}
          />
        ))}
      </div>

      {goals.length === 0 && !readonly && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Seu quadro está vazio</p>
            <p className="text-sm">Clique em "Adicionar Meta" para começar a organizar suas metas</p>
          </div>
        </div>
      )}
    </DndProvider>
  );
}
