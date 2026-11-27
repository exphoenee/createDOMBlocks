/** Hiba a deklaratív leíró feldolgozásakor, a leíró fájlbeli útvonalával (pl. `ui[2].Card.body[0]`).
 * @group yaml
 */
export class SpecError extends Error {
  constructor(
    message: string,
    /** A hiba helye a leírásban (pl. `ui[2].Card.body[0]`); üres, ha az egész leírásra vonatkozik */
    public path = "",
  ) {
    super(path ? `${path}: ${message}` : message);
    this.name = "SpecError";
  }
}

function distance(a: string, b: string): number {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** A legközelebbi ismert név (elgépelés esetén), vagy `undefined`, ha nincs elég közeli. */
export function suggest(name: string, known: Iterable<string>): string | undefined {
  let best: string | undefined;
  let bestD = Infinity;
  for (const k of known) {
    const d = distance(name, k);
    if (d < bestD) {
      bestD = d;
      best = k;
    }
  }
  const limit = Math.max(2, Math.floor(name.length / 3));
  return best !== undefined && bestD <= limit ? best : undefined;
}

/** „…, erre gondoltál: "x"?” kiegészítés a hibaüzenethez. */
export function didYouMean(name: string, known: Iterable<string>): string {
  const s = suggest(name, known);
  return s ? `, erre gondoltál: "${s}"?` : "";
}
