import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num?: number | null): string {
  if (num === undefined || num === null) {
    return "0";
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function serializeData(data: any) {
  return JSON.stringify(data, (key, value) => {
    typeof value === "bigint" ? value.toString() : value;
  });
}
