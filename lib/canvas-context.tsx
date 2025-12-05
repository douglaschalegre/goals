"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { CanvasElement, GoalsData, GoalCategory } from "@/types/goals";

interface CanvasContextType {
  canvasData: GoalsData;
  elements: CanvasElement[];
  selectedElementId: string | null;
  addImageElement: (url: string, category?: GoalCategory) => void;
  addTextElement: (content: string, category?: GoalCategory) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearCanvas: () => void;
  loadFromLocalStorage: () => void;
  categories: GoalCategory[];
  toggleCategory: (category: GoalCategory) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

const STORAGE_KEY = "goals-canvas-data";

const defaultCanvasData: GoalsData = {
  version: "1.0",
  canvas: {
    width: 1200,
    height: 1600,
    backgroundColor: "#ffffff",
  },
  elements: [],
  categories: [],
};

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [canvasData, setCanvasData] = useState<GoalsData>(defaultCanvasData);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Auto-save to localStorage whenever canvas data changes
  useEffect(() => {
    if (canvasData.elements.length > 0 || canvasData.categories.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...canvasData,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [canvasData]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCanvasData(parsed);
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, []);

  const addImageElement = useCallback((url: string, category?: GoalCategory) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: "image",
      url,
      position: { x: 100, y: 100 },
      size: { width: 300, height: 200 },
      category,
      zIndex: canvasData.elements.length,
    };
    setCanvasData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
  }, [canvasData.elements.length]);

  const addTextElement = useCallback((content: string, category?: GoalCategory) => {
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: "text",
      content,
      position: { x: 150, y: 150 },
      style: {
        fontSize: 24,
        fontWeight: "normal",
        color: "#333333",
      },
      category,
      zIndex: canvasData.elements.length,
    };
    setCanvasData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
  }, [canvasData.elements.length]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvasData(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === id ? { ...el, ...updates } as CanvasElement : el
      ),
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setCanvasData(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
    }));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const clearCanvas = useCallback(() => {
    setCanvasData(defaultCanvasData);
    setSelectedElementId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleCategory = useCallback((category: GoalCategory) => {
    setCanvasData(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        canvasData,
        elements: canvasData.elements,
        selectedElementId,
        addImageElement,
        addTextElement,
        updateElement,
        deleteElement,
        selectElement,
        clearCanvas,
        loadFromLocalStorage,
        categories: canvasData.categories,
        toggleCategory,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}
