export const truncateSummary = (text: string, maxWords = 24) => {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text.trim();
  }

  return `${words.slice(0, maxWords).join(" ")}...`;
};
