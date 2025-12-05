"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import type { IGoal } from "@/types/goals";
import { getIconComponent } from "@/components/shared/IconPicker";

type Variant = "poster" | "gallery";

export default function PreviewBoard({
  goals,
  variant = "poster",
}: {
  goals: IGoal[];
  variant?: Variant;
}) {
  const orderedGoals = useMemo(
    () => goals.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [goals]
  );

  if (variant === "gallery") {
    return (
      <div className="w-full">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {orderedGoals.map((goal) => {
            const Icon = getIconComponent(goal.icon);
            const hasImage = Boolean(goal.imageUrl);
            return (
              <div
                key={goal.id}
                className="break-inside-avoid mb-4 rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800"
              >
                {hasImage && (
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={goal.imageUrl!}
                      alt={goal.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {!hasImage && Icon && (
                  <div className="flex items-center justify-center h-40 bg-zinc-100 dark:bg-zinc-800">
                    <Icon className="w-12 h-12 text-zinc-500" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {goal.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {goal.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // poster variant: single board 16:9, top 3 goals highlighted
  const topGoals = orderedGoals.slice(0, 3);
  const otherGoals = orderedGoals.slice(3);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative w-full aspect-[16/9] rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-md dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-800">
        <div className="absolute inset-0 pointer-events-none rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topGoals.map((goal) => {
              const Icon = getIconComponent(goal.icon);
              const hasImage = Boolean(goal.imageUrl);
              return (
                <div
                  key={goal.id}
                  className="rounded-xl overflow-hidden bg-white border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
                >
                  {hasImage ? (
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={goal.imageUrl!}
                        alt={goal.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-zinc-100 dark:bg-zinc-800">
                      {Icon && <Icon className="w-10 h-10 text-zinc-500" />}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-3">
            {otherGoals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl bg-white border border-zinc-200 p-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
              >
                <p className="font-medium text-zinc-900 dark:text-white line-clamp-1">
                  {goal.title}
                </p>
                {goal.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {goal.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-zinc-500">
          <span>Quadro de Metas · {new Date().getFullYear()}</span>
          <span>Total: {orderedGoals.length}</span>
        </div>
      </div>
    </div>
  );
}
