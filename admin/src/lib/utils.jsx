import {clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getCardColor(index) {
  const colors = ['orange', 'blue', 'green', 'purple', 'pink', 'yellow']
  const color = colors[index % colors.length]
  return `bg-${color}-100 dark:bg-${color}-900`
}
