const ranges = [
  { divider: 1e12, suffix: "T" },
  { divider: 1e9, suffix: "B" },
  { divider: 1e6, suffix: "M" },
  { divider: 1e3, suffix: "K" },
];

export default function formatNumber(n: number): string {
  for (let i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
      const value: number = Math.floor(n / ranges[i].divider);
      return value.toString() + ranges[i].suffix;
    }
  }
  return n.toString();
}
