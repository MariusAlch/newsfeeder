export interface User {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Rating {
  _id: string;
  value: number;
  post: string;
}

export interface Company {
  agents: Agent[];
  posts: string[];
  users: string[];
  widget: Widget;
  _id: string;
  name: string;
  planType: PlanType;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Widget {
  color: string;
  position: string;
}

export interface Post {
  _id: string;
  title: string;
  feedbacks: Feedback[];
  content: string;
  createdAt: string;
  updatedAt: string;
  scheduledDate: string;
  __v: number;
}

export interface WidgetInfo {
  company: Company;
  user: User;
  feedbacks: Feedback[];
}

export interface Agent {
  _id: string;
  email: string;
  passhash: string;
  createdAt: string;
  verified: boolean;
  updatedAt: string;
  __v: number;
}

export interface Dashboard {
  agent: Agent;
  company: Company;
}

export interface Feedback {
  _id: string;
  user: User;
  post: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  text?: string;
  value?: number;
}

export type PlanType = "start" | "growth";

export interface WidgetConfig {
  name: string;
  preview: boolean;
  companyId: string;
}
