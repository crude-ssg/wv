import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function inverseLerp(a: number, b: number, value: number) {
  return (value - a) / (b - a);
}