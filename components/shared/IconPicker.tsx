"use client";

import React from "react";
import type { GoalCategory } from "@/types/goals";
import {
  Heart,
  Dumbbell,
  Briefcase,
  GraduationCap,
  Plane,
  Users,
  DollarSign,
  Book,
  Music,
  Camera,
  Code,
  Coffee,
  Home,
  Car,
  Star,
  Target,
  Trophy,
  Zap,
  Globe,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  Check,
  Plus,
  Minus,
  Settings,
  User,
  UserPlus,
  Activity,
  Bike,
  Apple,
  Stethoscope,
  TrendingUp,
  Award,
  Building,
  Lightbulb,
  Rocket,
  BookOpen,
  Headphones,
  Palette,
  Mountain,
  MapPin,
  Compass,
  Baby,
  Users2,
  HeartHandshake,
  Smile,
  Sparkles,
  Gift,
} from "lucide-react";

const ICONS = [
  { name: "heart", icon: Heart, label: "Coração" },
  { name: "dumbbell", icon: Dumbbell, label: "Academia" },
  { name: "briefcase", icon: Briefcase, label: "Trabalho" },
  { name: "graduation-cap", icon: GraduationCap, label: "Educação" },
  { name: "plane", icon: Plane, label: "Viagem" },
  { name: "users", icon: Users, label: "Pessoas" },
  { name: "dollar-sign", icon: DollarSign, label: "Dinheiro" },
  { name: "book", icon: Book, label: "Livro" },
  { name: "music", icon: Music, label: "Música" },
  { name: "camera", icon: Camera, label: "Câmera" },
  { name: "code", icon: Code, label: "Código" },
  { name: "coffee", icon: Coffee, label: "Café" },
  { name: "home", icon: Home, label: "Casa" },
  { name: "car", icon: Car, label: "Carro" },
  { name: "star", icon: Star, label: "Estrela" },
  { name: "target", icon: Target, label: "Alvo" },
  { name: "trophy", icon: Trophy, label: "Troféu" },
  { name: "zap", icon: Zap, label: "Energia" },
  { name: "globe", icon: Globe, label: "Mundo" },
  { name: "message-circle", icon: MessageCircle, label: "Mensagem" },
  { name: "phone", icon: Phone, label: "Telefone" },
  { name: "mail", icon: Mail, label: "Email" },
  { name: "calendar", icon: Calendar, label: "Calendário" },
  { name: "clock", icon: Clock, label: "Relógio" },
  { name: "check", icon: Check, label: "Check" },
  { name: "user", icon: User, label: "Usuário" },
  { name: "user-plus", icon: UserPlus, label: "Adicionar Usuário" },
  { name: "settings", icon: Settings, label: "Configurações" },
  { name: "activity", icon: Activity, label: "Atividade" },
  { name: "bike", icon: Bike, label: "Bicicleta" },
  { name: "apple", icon: Apple, label: "Maçã" },
  { name: "stethoscope", icon: Stethoscope, label: "Estetoscópio" },
  { name: "trending-up", icon: TrendingUp, label: "Crescimento" },
  { name: "award", icon: Award, label: "Prêmio" },
  { name: "building", icon: Building, label: "Edifício" },
  { name: "lightbulb", icon: Lightbulb, label: "Ideia" },
  { name: "rocket", icon: Rocket, label: "Foguete" },
  { name: "book-open", icon: BookOpen, label: "Livro Aberto" },
  { name: "headphones", icon: Headphones, label: "Fones" },
  { name: "palette", icon: Palette, label: "Paleta" },
  { name: "mountain", icon: Mountain, label: "Montanha" },
  { name: "map-pin", icon: MapPin, label: "Localização" },
  { name: "compass", icon: Compass, label: "Bússola" },
  { name: "baby", icon: Baby, label: "Bebê" },
  { name: "users-2", icon: Users2, label: "Grupo" },
  { name: "heart-handshake", icon: HeartHandshake, label: "Aperto de Mão" },
  { name: "smile", icon: Smile, label: "Sorriso" },
  { name: "sparkles", icon: Sparkles, label: "Brilho" },
  { name: "gift", icon: Gift, label: "Presente" },
];

// Category-specific icon mappings
const CATEGORY_ICONS: Record<GoalCategory, string[]> = {
  health: [
    "dumbbell",
    "activity",
    "bike",
    "apple",
    "stethoscope",
    "heart",
    "target",
  ],
  career: [
    "briefcase",
    "trending-up",
    "award",
    "building",
    "lightbulb",
    "rocket",
    "trophy",
  ],
  relationships: [
    "heart",
    "users",
    "message-circle",
    "phone",
    "heart-handshake",
    "smile",
    "users-2",
  ],
  finance: ["dollar-sign", "trending-up", "target", "award", "check"],
  "personal-growth": [
    "lightbulb",
    "sparkles",
    "book-open",
    "target",
    "rocket",
    "star",
    "zap",
  ],
  travel: ["plane", "compass", "map-pin", "globe", "mountain", "camera"],
  education: ["graduation-cap", "book", "book-open", "lightbulb", "trophy"],
  family: ["home", "users", "baby", "users-2", "heart", "gift", "smile"],
  creative: ["palette", "camera", "music", "headphones", "sparkles", "star"],
  other: ["star", "target", "sparkles", "zap", "check", "gift"],
};

interface IconPickerProps {
  selectedIcon?: string;
  onSelect: (icon: string) => void;
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2">
      {ICONS.map(({ name, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className={`p-3 rounded-lg border-2 transition-all hover:border-primary flex items-center justify-center ${
            selectedIcon === name
              ? "border-primary bg-primary/10"
              : "border-gray-200"
          }`}
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
}

export function getIconComponent(iconName?: string) {
  if (!iconName) return null;
  const iconData = ICONS.find((i) => i.name === iconName);
  return iconData?.icon || null;
}

export function getRandomIconForCategory(category: GoalCategory): string {
  const categoryIcons = CATEGORY_ICONS[category] || CATEGORY_ICONS.other;
  const randomIndex = Math.floor(Math.random() * categoryIcons.length);
  return categoryIcons[randomIndex];
}

export { ICONS, CATEGORY_ICONS };
