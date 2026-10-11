export const readingTime = (text = "", wordsPerMinute = 200) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
};
