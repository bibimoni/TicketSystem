// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Hàm gộp className an toàn khi dùng Tailwind + clsx
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}