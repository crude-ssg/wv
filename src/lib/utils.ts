import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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