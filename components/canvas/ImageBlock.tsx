"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import type { ImageElement } from "@/types/goals";
import { useCanvas } from "@/lib/canvas-context";

interface ImageBlockProps {
  element: ImageElement;
}

export function ImageBlock({ element }: ImageBlockProps) {
  const { updateElement, selectElement, selectedElementId, deleteElement } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedElementId === element.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y,
    });
    selectElement(element.id);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    updateElement(element.id, {
      position: { x: newX, y: newY },
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleResize = (direction: "se" | "sw" | "ne" | "nw", e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.size.width;
    const startHeight = element.size.height;
    const startPosX = element.position.x;
    const startPosY = element.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes("e")) {
        newWidth = Math.max(100, startWidth + deltaX);
      }
      if (direction.includes("w")) {
        newWidth = Math.max(100, startWidth - deltaX);
        newX = startPosX + deltaX;
      }
      if (direction.includes("s")) {
        newHeight = Math.max(100, startHeight + deltaY);
      }
      if (direction.includes("n")) {
        newHeight = Math.max(100, startHeight - deltaY);
        newY = startPosY + deltaY;
      }

      updateElement(element.id, {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY },
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  return (
    <div
      ref={imageRef}
      className={`absolute cursor-move group ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: element.zIndex ?? 0,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative w-full h-full">
        <Image
          src={element.url}
          alt={element.alt || "Goal image"}
          fill
          className="object-cover rounded-lg"
          draggable={false}
        />

        {/* Category badge */}
        {element.category && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
            {element.category}
          </div>
        )}

        {/* Delete button */}
        {isSelected && (
          <>
            <button
              onClick={handleDelete}
              className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
            >
              ×
            </button>

            {/* Resize handles */}
            <div
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-se-resize"
              onMouseDown={(e) => handleResize("se", e)}
            />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-sw-resize"
              onMouseDown={(e) => handleResize("sw", e)}
            />
            <div
              className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-ne-resize"
              onMouseDown={(e) => handleResize("ne", e)}
            />
            <div
              className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nw-resize"
              onMouseDown={(e) => handleResize("nw", e)}
            />
          </>
        )}
      </div>
    </div>
  );
}
