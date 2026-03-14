import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomUid(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function randomInt(min: number, max: number): number {
  return Math.round(lerp(min, max, Math.random()))
}

export function inverseLerp(a: number, b: number, value: number) {
  return (value - a) / (b - a);
}

export function lerp(from: number, to: number, time: number) {
  return from + (to - from) * time;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}