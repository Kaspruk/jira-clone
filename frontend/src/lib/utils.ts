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

export const toObject = <T extends { id: number }>(data: T[]) => {
  return data.reduce((acc, item) => {
    acc[item.id as T['id']] = item;
    return acc;
  }, {} as Record<T['id'], T>);
};

/**
 * Функція для порівняння поточного роуту зі схемою роуту
 * @param currentPath - поточний роут (наприклад, "/projects/18/tasks")
 * @param routePattern - схема роуту (наприклад, "/projects/:projectId/tasks")
 * @returns об'єкт з результатом порівняння та витягнутими параметрами
 */
export function matchRoute(currentPath: string, routePattern: string): {
  matches: boolean;
  params: Record<string, string>;
} {
  // Розділяємо шляхи на сегменти
  const currentSegments = currentPath.split('/').filter(Boolean);
  const patternSegments = routePattern.split('/').filter(Boolean);

  // Якщо кількість сегментів не співпадає, роути не збігаються
  if (currentSegments.length !== patternSegments.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  // Порівнюємо кожен сегмент
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const currentSegment = currentSegments[i];

    // Якщо це параметр (починається з :)
    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1); // Видаляємо :
      params[paramName] = currentSegment;
    } else if (patternSegment !== currentSegment) {
      // Якщо це не параметр і сегменти не збігаються
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

/**
 * Функція для заміни параметрів у роуті на конкретні значення
 * @param routePattern - схема роуту (наприклад, "/projects/:projectId/tasks")
 * @param params - параметри для заміни (наприклад, { projectId: "18" })
 * @returns роут з замінними параметрами (наприклад, "/projects/18/tasks")
 */
export function buildRoute(routePattern: string, params: Record<string, string>): string {
  let result = routePattern;
  
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  
  return result;
};

export const getIsTablet = () => {
  return window.innerWidth < 1024;
};

export const isMobile = () => {
  return window.innerWidth < 768;
};