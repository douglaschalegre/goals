"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoalModal } from "./GoalModal";
import { Plus } from "lucide-react";

export function AddGoalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Meta
      </Button>

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
