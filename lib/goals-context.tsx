"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Goal, KanbanData, GoalCategory } from "@/types/goals";

interface GoalsContextType {
  kanbanData: KanbanData;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  moveGoal: (goalId: string, targetCategory: GoalCategory, newOrder: number) => void;
  reorderGoal: (goalId: string, newOrder: number) => void;
  getGoalsByCategory: (category: GoalCategory) => Goal[];
  clearGoals: () => void;
  loadFromLocalStorage: () => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const STORAGE_KEY = "goals-kanban-data";

const defaultKanbanData: KanbanData = {
  version: "2.0",
  goals: [],
};

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [kanbanData, setKanbanData] = useState<KanbanData>(defaultKanbanData);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Auto-save to localStorage whenever kanban data changes
  useEffect(() => {
    if (kanbanData.goals.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...kanbanData,
          updatedAt: new Date().toISOString(),
        })
      );
    }
  }, [kanbanData]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setKanbanData(parsed);
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setKanbanData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setKanbanData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === id
          ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
          : goal
      ),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setKanbanData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== id),
    }));
  }, []);

  const moveGoal = useCallback(
    (goalId: string, targetCategory: GoalCategory, newOrder: number) => {
      setKanbanData((prev) => {
        const goal = prev.goals.find((g) => g.id === goalId);
        if (!goal) return prev;

        // Get goals in target category
        const targetGoals = prev.goals.filter((g) => g.category === targetCategory);

        // Update the moved goal
        const updatedGoal = {
          ...goal,
          category: targetCategory,
          order: newOrder,
          updatedAt: new Date().toISOString(),
        };

        // Update other goals' order in target category if needed
        const updatedGoals = prev.goals.map((g) => {
          if (g.id === goalId) return updatedGoal;
          if (g.category === targetCategory && g.order >= newOrder) {
            return { ...g, order: g.order + 1 };
          }
          return g;
        });

        return { ...prev, goals: updatedGoals };
      });
    },
    []
  );

  const reorderGoal = useCallback((goalId: string, newOrder: number) => {
    setKanbanData((prev) => {
      const goal = prev.goals.find((g) => g.id === goalId);
      if (!goal) return prev;

      const updatedGoals = prev.goals.map((g) =>
        g.id === goalId
          ? { ...g, order: newOrder, updatedAt: new Date().toISOString() }
          : g
      );

      return { ...prev, goals: updatedGoals };
    });
  }, []);

  const getGoalsByCategory = useCallback(
    (category: GoalCategory): Goal[] => {
      return kanbanData.goals
        .filter((goal) => goal.category === category)
        .sort((a, b) => a.order - b.order);
    },
    [kanbanData.goals]
  );

  const clearGoals = useCallback(() => {
    setKanbanData(defaultKanbanData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <GoalsContext.Provider
      value={{
        kanbanData,
        goals: kanbanData.goals,
        addGoal,
        updateGoal,
        deleteGoal,
        moveGoal,
        reorderGoal,
        getGoalsByCategory,
        clearGoals,
        loadFromLocalStorage,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error("useGoals must be used within a GoalsProvider");
  }
  return context;
}
