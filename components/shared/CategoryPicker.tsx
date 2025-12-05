"use client";

import React from "react";
import type { GoalCategory } from "@/types/goals";

const CATEGORIES: { value: GoalCategory; label: string; emoji: string }[] = [
  { value: "health", label: "Saúde", emoji: "💪" },
  { value: "career", label: "Carreira", emoji: "💼" },
  { value: "relationships", label: "Relacionamentos", emoji: "❤️" },
  { value: "finance", label: "Finanças", emoji: "💰" },
  { value: "personal-growth", label: "Crescimento Pessoal", emoji: "🌱" },
  { value: "travel", label: "Viagens", emoji: "✈️" },
  { value: "education", label: "Educação", emoji: "📚" },
  { value: "family", label: "Família", emoji: "👨‍👩‍👧‍👦" },
  { value: "creative", label: "Criatividade", emoji: "🎨" },
  { value: "other", label: "Outros", emoji: "⭐" },
];

interface CategoryPickerProps {
  selectedCategory?: GoalCategory;
  onSelect: (category: GoalCategory) => void;
}

export function CategoryPicker({ selectedCategory, onSelect }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`p-3 rounded-lg border-2 transition-all hover:border-primary ${
            selectedCategory === cat.value
              ? "border-primary bg-primary/10"
              : "border-gray-200"
          }`}
        >
          <div className="text-2xl mb-1">{cat.emoji}</div>
          <div className="text-xs font-medium">{cat.label}</div>
        </button>
      ))}
    </div>
  );
}

export { CATEGORIES };
