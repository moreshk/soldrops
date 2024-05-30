export type TokenPrice = {
  [key: string]: {
    value: number;
    updateUnixTime: string;
    updateHumanTime: string;
    priceChange24h: number;
  };
};
