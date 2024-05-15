export const addressShortener = (input: string) => {
  if (input.length < 5) {
    throw new Error("Input string must have at least 5 characters");
  }
  const first5 = input.slice(0, 5);
  const last5 = input.slice(-5);

  return first5 + "..." + last5;
};
