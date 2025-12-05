"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoalsProvider, useGoals } from "@/lib/goals-context";
import { GoalModal } from "@/components/kanban/GoalModal";
import { CATEGORIES } from "@/components/shared/CategoryPicker";
import {
  Goal,
  Home,
  BarChart3,
  Settings,
  Plus,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import type { IGoal } from "@/types/goals";
import { getIconComponent } from "@/components/shared/IconPicker";

interface GoalCardProps {
  goal: IGoal;
  onClick: () => void;
}

// Image Card Component
function ImageGoalCard({ goal, onClick }: GoalCardProps) {
  return (
    <div onClick={onClick} className="flex flex-col gap-2 cursor-pointer">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cover bg-center">
        <Image
          src={goal.imageUrl!}
          alt={goal.title}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-medium text-zinc-900 dark:text-white line-clamp-2">
          {goal.title}
        </p>
        {goal.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {goal.description}
          </p>
        )}
      </div>
    </div>
  );
}

// List Style Card Component
function ListGoalCard({ goal, onClick }: GoalCardProps) {
  const IconComponent = getIconComponent(goal.icon);

  return (
    <div
      onClick={onClick}
      className="col-span-2 flex items-center gap-4 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-900 dark:text-white line-clamp-1">
          {goal.title}
        </p>
        {goal.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
            {goal.description}
          </p>
        )}
      </div>
    </div>
  );
}

// Grid Icon Card Component
function GridIconGoalCard({ goal, onClick }: GoalCardProps) {
  return (
    <div onClick={onClick} className="flex flex-col gap-2 cursor-pointer">
      <div className="flex aspect-square w-full flex-col rounded-xl items-center justify-center bg-zinc-100 p-3 dark:bg-zinc-800 overflow-hidden">
        <div className="text-center w-full px-1">
          <p className="text-sm text-zinc-900 dark:text-white line-clamp-2 text-center break-words">
            {goal.title}
          </p>
          {goal.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 text-center break-words">
              {goal.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Fallback Card Component
function FallbackGoalCard({ goal, onClick }: GoalCardProps) {
  return (
    <div onClick={onClick} className="flex flex-col gap-2 cursor-pointer">
      <div className="flex aspect-square w-full flex-col justify-center items-center rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <p className="font-medium text-zinc-900 dark:text-white text-center line-clamp-2">
          {goal.title}
        </p>
        {goal.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 text-center mt-2">
            {goal.description}
          </p>
        )}
      </div>
    </div>
  );
}

// Main GoalCardGrid Component - Router
function GoalCardGrid({ goal, onClick }: GoalCardProps) {
  // Route to appropriate card component based on goal properties
  if (goal.imageUrl) {
    return <ImageGoalCard goal={goal} onClick={onClick} />;
  }

  if (goal.icon && goal.displayStyle === "list") {
    return <ListGoalCard goal={goal} onClick={onClick} />;
  }

  if (goal.icon) {
    return <GridIconGoalCard goal={goal} onClick={onClick} />;
  }

  return <FallbackGoalCard goal={goal} onClick={onClick} />;
}

function CreatePageContent() {
  const router = useRouter();
  const { getGoalsByCategory } = useGoals();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IGoal | undefined>();

  const handleGoalClick = (goal: IGoal) => {
    setEditingGoal(goal);
  };

  const handlePreview = () => {
    router.push("/preview");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/80">
        <div className="flex h-12 w-12 items-center justify-start">
          <Goal className="text-3xl text-zinc-900 dark:text-white" />
        </div>
        <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          Meu Quadro de Metas {new Date().getFullYear() + 1}
        </h1>
        <div className="flex h-12 w-12 items-center justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary/20 text-primary"
          >
            <Plus className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow px-4 pb-24">
        {CATEGORIES.map((category, index) => {
          const goals = getGoalsByCategory(category.value);
          if (goals.length === 0) return null;

          // Calculate display style for each goal based on row context
          // Logic: Goals on same row as image goal → grid style
          // Goals on rows with no images → list style
          const goalsWithDisplayStyle = goals.map((goal, idx) => {
            // Goals with images always stay as grid cards
            if (goal.imageUrl) {
              return { ...goal, computedDisplayStyle: undefined };
            }

            // For icon-based goals, check if they're in the same row as an image goal
            const rowIndex = Math.floor(idx / 2); // 2 columns per row
            const rowStart = rowIndex * 2;
            const rowEnd = Math.min(rowStart + 2, goals.length);
            const goalsInRow = goals.slice(rowStart, rowEnd);

            // If row has NO image, set displayStyle to "list"
            // If row has an image, keep as grid (undefined = default grid style)
            const hasImageInRow = goalsInRow.some((g) => g.imageUrl);
            return {
              ...goal,
              computedDisplayStyle: hasImageInRow ? undefined : "list",
            };
          });

          return (
            <section
              key={category.value}
              className={index === 0 ? "mt-5" : "mt-8"}
            >
              <h2 className="text-[22px] font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
                {category.label}
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-4">
                {goalsWithDisplayStyle.map((goal) => (
                  <GoalCardGrid
                    key={goal.id}
                    goal={{
                      ...goal,
                      displayStyle:
                        goal.computedDisplayStyle || goal.displayStyle,
                    }}
                    onClick={() => handleGoalClick(goal)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty State */}
        {CATEGORIES.every(
          (cat) => getGoalsByCategory(cat.value).length === 0
        ) && (
          <div className="text-center py-16">
            <p className="text-lg text-zinc-500 mb-2">Seu quadro está vazio</p>
            <p className="text-sm text-zinc-400">
              Toque no + para adicionar sua primeira meta
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Stepper) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-background-light/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-background-dark/80">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 pb-2 pt-2">
          <button
            className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-500"
            onClick={() => router.push("/")}
          >
            <Home className="text-3xl" />
            <p className="text-xs">Início</p>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-primary"
            onClick={() => router.push("/create")}
          >
            <BarChart3 className="text-3xl" />
            <p className="text-xs font-bold">Metas</p>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-500"
            onClick={() => router.push("/preview")}
          >
            <CreditCard className="text-3xl" />
            <p className="text-xs">Pagamento</p>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <GoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {editingGoal && (
        <GoalModal
          isOpen={!!editingGoal}
          onClose={() => setEditingGoal(undefined)}
          goal={editingGoal}
        />
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <GoalsProvider>
      <CreatePageContent />
    </GoalsProvider>
  );
}
