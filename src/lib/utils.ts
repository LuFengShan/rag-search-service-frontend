import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeHtml(text: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = text
  return txt.value
}
