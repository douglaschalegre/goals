"use client";

import React, { useState, useEffect } from "react";
import { useGoals } from "@/lib/goals-context";
import { CategoryPicker } from "@/components/shared/CategoryPicker";
import {
  IconPicker,
  getRandomIconForCategory,
} from "@/components/shared/IconPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IGoal, GoalCategory } from "@/types/goals";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: IGoal;
}

export function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const { addGoal, updateGoal, getGoalsByCategory, deleteGoal } = useGoals();
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState<GoalCategory>(
    goal?.category || "other"
  );
  const [imageUrl, setImageUrl] = useState(goal?.imageUrl || "");
  const [icon, setIcon] = useState(goal?.icon || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setCategory(goal.category);
      setImageUrl(goal.imageUrl || "");
      setIcon(goal.icon || "");
    }
  }, [goal]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter menos de 5MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      setError("Falha ao enviar imagem. Por favor, tente novamente.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Título é obrigatório");
      return;
    }

    // If no image and no icon selected, assign a random icon based on category
    const finalIcon = imageUrl
      ? undefined
      : icon || getRandomIconForCategory(category);

    if (goal) {
      // Update existing goal
      updateGoal(goal.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        imageUrl: imageUrl || undefined,
        icon: finalIcon,
      });
    } else {
      // Create new goal
      const goalsInCategory = getGoalsByCategory(category);
      addGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        imageUrl: imageUrl || undefined,
        icon: finalIcon,
        order: goalsInCategory.length,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!goal) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja remover esta meta?"
    );
    if (!confirmed) return;
    try {
      deleteGoal(goal.id);
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Falha ao remover a meta. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Editar Meta" : "Adicionar Nova Meta"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title Input */}
          <div>
            <Label htmlFor="title">
              Título da Meta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Correr uma maratona"
              className="mt-1"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <Label htmlFor="description">Descrição </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione mais detalhes sobre sua meta..."
              className="mt-1 w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          {/* Category Picker */}
          <div>
            <Label>Categoria *</Label>
            <div className="mt-2">
              <CategoryPicker
                selectedCategory={category}
                onSelect={setCategory}
              />
            </div>
          </div>

          {/* Image Upload or Icon Picker */}
          <div>
            <Label>Imagem de Capa</Label>
            {imageUrl ? (
              <div className="mt-2 relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Goal cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-2 space-y-4">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {isUploading ? "Enviando..." : "Clique para enviar imagem"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG até 5MB
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {/* <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Ou escolha um ícone:
                  </p>
                  <IconPicker selectedIcon={icon} onSelect={setIcon} />
                </div> */}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between w-full">
          <div className="flex gap-2">
            {goal && (
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleDelete}
              >
                Remover
              </Button>
            )}
            <Button
              className="w-full"
              variant="default"
              onClick={handleSave}
              disabled={isUploading}
            >
              {goal ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </DialogFooter>
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
