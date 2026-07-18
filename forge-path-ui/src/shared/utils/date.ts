export function formatDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };
  
  return new Intl.DateTimeFormat("en-US", defaultOptions).format(date);
}

export function formatTime(dateString: string | Date): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "--:--";
  
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}
