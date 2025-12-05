"use client";

import React, { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { useGoals } from "@/lib/goals-context";
import { GoalCard } from "./GoalCard";
import type { GoalCategory } from "@/types/goals";

interface KanbanColumnProps {
  category: {
    value: GoalCategory;
    label: string;
    emoji: string;
  };
  readonly?: boolean;
}

export function KanbanColumn({ category, readonly = false }: KanbanColumnProps) {
  const { getGoalsByCategory, moveGoal } = useGoals();
  const goals = getGoalsByCategory(category.value);
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "GOAL",
    drop: (item: { id: string; category: GoalCategory }) => {
      if (!readonly && item.category !== category.value) {
        // Move goal to this column at the end
        moveGoal(item.id, category.value, goals.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [category.value, goals.length, moveGoal, readonly]);

  useEffect(() => {
    drop(dropRef);
  }, [drop]);

  return (
    <div
      ref={dropRef}
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg border transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-gray-200"
      }`}
      style={{ minWidth: "320px" }}
    >
      {/* Column Header */}
      <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.emoji}</span>
            <h3 className="font-semibold text-sm">{category.label}</h3>
          </div>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            {goals.length}
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        {goals.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Solte metas aqui
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} readonly={readonly} />
          ))
        )}
      </div>
    </div>
  );
}
