"use client";

import React, { useState, useRef, useEffect } from "react";
import type { TextElement } from "@/types/goals";
import { useCanvas } from "@/lib/canvas-context";

interface TextBlockProps {
  element: TextElement;
}

export function TextBlock({ element }: TextBlockProps) {
  const { updateElement, selectElement, selectedElementId, deleteElement } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editedContent, setEditedContent] = useState(element.content);
  const textRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isSelected = selectedElementId === element.id;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing) return;
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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      selectElement(element.id);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedContent.trim() !== element.content) {
      updateElement(element.id, { content: editedContent.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setEditedContent(element.content);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  const textStyle = {
    fontSize: element.style?.fontSize ?? 24,
    fontWeight: element.style?.fontWeight ?? "normal",
    color: element.style?.color ?? "#333333",
    fontFamily: element.style?.fontFamily ?? "inherit",
    textAlign: element.style?.textAlign ?? "left",
    fontStyle: element.style?.italic ? "italic" : "normal",
    textDecoration: element.style?.underline ? "underline" : "none",
  };

  return (
    <div
      ref={textRef}
      className={`absolute cursor-move group ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        maxWidth: element.maxWidth ?? 400,
        zIndex: element.zIndex ?? 0,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[40px] p-2 border-2 border-primary rounded resize-none bg-white"
            style={textStyle}
            rows={3}
          />
        ) : (
          <>
            <div
              className="p-2 rounded"
              style={textStyle}
            >
              {element.content}
            </div>

            {/* Category badge */}
            {element.category && (
              <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                {element.category}
              </div>
            )}

            {/* Delete button */}
            {isSelected && (
              <button
                onClick={handleDelete}
                className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90"
              >
                ×
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
