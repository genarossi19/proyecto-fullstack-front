export type NotificationType = "order" | "market" | "news" | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  icon: string;
  action?: {
    label: string;
    path?: string;
  };
}
