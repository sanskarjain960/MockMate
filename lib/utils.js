import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { interviewCovers, mappings } from "@/constants";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};