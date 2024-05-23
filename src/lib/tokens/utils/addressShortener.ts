export const addressShortener = (input?: string) => {
  if (!input) return "";
  if (input.length < 5) {
    return input;
  }
  const first5 = input.slice(0, 5);
  const last5 = input.slice(-5);

  return first5 + "..." + last5;
};
