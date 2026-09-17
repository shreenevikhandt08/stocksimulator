export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const inr = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n || 0);

export const inrCompact = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return inr(n);
};

export const pct = (n: number, d = 2) => `${(n * 100).toFixed(d)}%`;
export const signedPct = (n: number, d = 2) => {
  const v = (n * 100).toFixed(d);
  return `${n > 0 ? "+" : ""}${v}%`;
};
export const signedInr = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${inr(Math.abs(n))}`;

export const tone = (n: number) => (n > 0 ? "pos" : n < 0 ? "neg" : "neu");
export const stanceClass = (s: string) =>
  s === "bullish" || s === "BUY"
    ? "text-gain"
    : s === "bearish" || s === "AVOID"
      ? "text-loss"
      : "text-gold";
