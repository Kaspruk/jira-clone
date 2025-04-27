import { clsx, type ClassValue } from "clsx"
import { memo } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function snakeCaseToTitleCase(str: string) {
  return str.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
};

export function toCapitalize(str: string): string {
  if (!str) return ''; // Якщо рядок порожній, повертаємо порожній рядок
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const genericMemo: <T>(component: T) => T = memo;