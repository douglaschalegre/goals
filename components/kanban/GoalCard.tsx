"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useGoals } from "@/lib/goals-context";
import { GoalModal } from "./GoalModal";
import { CATEGORIES } from "@/components/shared/CategoryPicker";
import type { IGoal } from "@/types/goals";
import Image from "next/image";
import { X } from "lucide-react";

interface GoalCardProps {
  goal: IGoal;
  readonly?: boolean;
}

export function GoalCard({ goal, readonly = false }: GoalCardProps) {
  const { deleteGoal } = useGoals();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const category = CATEGORIES.find((c) => c.value === goal.category);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "GOAL",
      item: { id: goal.id, category: goal.category },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: !readonly,
    }),
    [goal.id, goal.category, readonly]
  );

  useEffect(() => {
    drag(dragRef);
  }, [drag]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      deleteGoal(goal.id);
    }
  };

  return (
    <>
      <div
        ref={dragRef}
        onClick={() => !readonly && setIsEditModalOpen(true)}
        onMouseEnter={() => setShowDeleteButton(true)}
        onMouseLeave={() => setShowDeleteButton(false)}
        className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all cursor-pointer ${
          isDragging ? "opacity-50 scale-105" : "hover:shadow-lg"
        } ${readonly ? "cursor-default" : ""}`}
      >
        {/* Image Cover */}
        {goal.imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={goal.imageUrl}
              alt={goal.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
            />
          </div>
        )}

        {/* Card Content */}
        <div className="p-4">
          {/* Category Badge and Delete Button */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
              <span>{category?.emoji}</span>
              <span className="text-gray-600">{category?.label}</span>
            </div>
            {!readonly && showDeleteButton && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Title */}
          <h4 className="font-semibold text-lg mb-1 line-clamp-2">
            {goal.title}
          </h4>

          {/* Description */}
          {goal.description && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {goal.description}
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <GoalModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          goal={goal}
        />
      )}
    </>
  );
}
