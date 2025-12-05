"use client";

import React, { useState, useRef } from "react";
import { useCanvas } from "@/lib/canvas-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryPicker } from "@/components/shared/CategoryPicker";
import type { GoalCategory } from "@/types/goals";
import { toast } from "sonner";

export function Toolbar() {
  const { addImageElement, addTextElement } = useCanvas();
  const [isUploading, setIsUploading] = useState(false);
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload to R2
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      addImageElement(url, selectedCategory);
      setShowImageDialog(false);
      setSelectedCategory(undefined);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Falha ao enviar imagem. Por favor, tente novamente.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddText = () => {
    if (textContent.trim()) {
      addTextElement(textContent.trim(), selectedCategory);
      setTextContent("");
      setSelectedCategory(undefined);
      setShowTextDialog(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Add Image Button */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button variant="default">
              📷 Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Imagem ao Canvas</DialogTitle>
              <DialogDescription>
                Envie uma imagem e opcionalmente atribua uma categoria
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Categoria (opcional)</label>
                <CategoryPicker
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Enviar Imagem</label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                {isUploading && (
                  <p className="text-sm text-muted-foreground mt-2">Enviando...</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Text Button */}
        <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
          <DialogTrigger asChild>
            <Button variant="default">
              📝 Adicionar Texto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Texto ao Canvas</DialogTitle>
              <DialogDescription>
                Digite o texto da sua meta e opcionalmente atribua uma categoria
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Categoria (opcional)</label>
                <CategoryPicker
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Conteúdo do Texto</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Digite sua meta..."
                  className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleAddText();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pressione Ctrl+Enter para adicionar
                </p>
              </div>
              <Button onClick={handleAddText} disabled={!textContent.trim()}>
                Adicionar ao Canvas
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-xs text-muted-foreground">
        💡 Dica: Clique duas vezes no texto para editar, arraste elementos para mover, use alças de redimensionamento nas imagens
      </div>
    </div>
  );
}
