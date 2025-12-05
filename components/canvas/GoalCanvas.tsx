"use client";

import React, { useRef } from "react";
import { useCanvas } from "@/lib/canvas-context";
import { ImageBlock } from "./ImageBlock";
import { TextBlock } from "./TextBlock";

interface GoalCanvasProps {
  readonly?: boolean;
}

export function GoalCanvas({ readonly = false }: GoalCanvasProps) {
  const { elements, canvasData, selectElement } = useCanvas();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas background
    if (e.target === canvasRef.current) {
      selectElement(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`relative bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden ${
        readonly ? "pointer-events-none" : ""
      }`}
      style={{
        width: canvasData.canvas.width,
        height: canvasData.canvas.height,
        backgroundColor: canvasData.canvas.backgroundColor || "#ffffff",
      }}
      onClick={handleCanvasClick}
      id="goals-canvas"
    >
      {elements.length === 0 && !readonly && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg mb-2">Your canvas is empty</p>
            <p className="text-sm">Add images or text to start creating your vision board</p>
          </div>
        </div>
      )}

      {elements.map((element) => {
        if (element.type === "image") {
          return <ImageBlock key={element.id} element={element} />;
        } else if (element.type === "text") {
          return <TextBlock key={element.id} element={element} />;
        }
        return null;
      })}
    </div>
  );
}
