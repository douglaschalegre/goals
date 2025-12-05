export type GoalCategory =
  | "health"
  | "career"
  | "relationships"
  | "finance"
  | "personal-growth"
  | "travel"
  | "education"
  | "family"
  | "creative"
  | "other";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextStyle {
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "semibold";
  fontFamily?: string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  italic?: boolean;
  underline?: boolean;
}

export interface BaseElement {
  id: string;
  position: Position;
  category?: GoalCategory;
  zIndex?: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  url: string;
  size: Size;
  alt?: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  style?: TextStyle;
  maxWidth?: number;
}

export type CanvasElement = ImageElement | TextElement;

export interface CanvasConfig {
  width: number;
  height: number;
  backgroundColor?: string;
}

export interface GoalsData {
  version: string;
  canvas: CanvasConfig;
  elements: CanvasElement[];
  categories: GoalCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalSubmission {
  id: string;
  email: string;
  name?: string;
  goalsData: GoalsData;
  createdAt: string;
  paymentStatus: "pending" | "completed" | "failed" | "expired";
  paymentId?: string;
  paymentAmount?: number;
  scheduledSendDate?: string;
  emailSent: boolean;
  emailSentAt?: string;
}

export interface PaymentIntent {
  id: string;
  submissionId: string;
  amount: number;
  qrCode: string;
  qrCodeBase64?: string;
  expiresAt: string;
  status: "pending" | "completed" | "failed" | "expired";
}

// Kanban Goal Interface (v2.0)
export interface IGoal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  imageUrl?: string;
  icon?: string; // Icon name for goals without images
  displayStyle?: "grid" | "list"; // Display as grid card or list item
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanData {
  version: "2.0";
  goals: Goal[];
  createdAt?: string;
  updatedAt?: string;
}
