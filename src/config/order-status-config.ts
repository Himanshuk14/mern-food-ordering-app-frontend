import { OrderStatus } from "@/types";
type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progress: number;
};

export const ORDER_STATUS: OrderStatusInfo[] = [
  {
    label: "Placed",
    value: "placed",
    progress: 0,
  },
  {
    label: "Awaiting Restaurant Confirmation",
    value: "paid",
    progress: 25,
  },
  {
    label: "In progress",
    value: "inProgress",
    progress: 50,
  },
  {
    label: "Out for delivery",
    value: "outForDelivery",
    progress: 75,
  },
  {
    label: "Delivered",
    value: "delivered",
    progress: 100,
  },
];
