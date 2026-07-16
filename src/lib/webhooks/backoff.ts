// §A3 retry policy — exponential backoff + jitter, at most 8 attempts within a 24h window, then the
// destination is auto-disabled and the account is emailed. Two independent guards enforce "8 次 / 24h":
// the attempt count AND the wall-clock window from the first attempt. Whichever trips first ends retries.

export const MAX_ATTEMPTS = 8;
export const RETRY_WINDOW_MS = 24 * 60 * 60 * 1000;

const BASE_DELAY_MS = 60_000; // 1 min after the first failure
const CAP_DELAY_MS = 6 * 60 * 60 * 1000; // never wait more than 6h between tries

// Equal-jitter backoff: half the exponential window is fixed, the other half is random, so retries
// spread out (avoids a thundering herd of simultaneous re-tries against a flapping endpoint) while
// never collapsing to zero delay. `attempt` is the number of attempts already made (>=1).
export function nextBackoffMs(attempt: number, random: () => number = Math.random): number {
  const exp = Math.min(CAP_DELAY_MS, BASE_DELAY_MS * 2 ** (attempt - 1));
  const half = exp / 2;
  return Math.round(half + random() * half);
}

// Whether we have exhausted the retry budget and must give up (disable). `firstAttemptedAt` anchors the
// 24h window; a null value means no attempt has run yet, so we are never exhausted.
export function isRetryBudgetExhausted(input: {
  attempt: number;
  firstAttemptedAt: Date | null;
  now: Date;
}): boolean {
  if (input.attempt >= MAX_ATTEMPTS) return true;
  if (input.firstAttemptedAt && input.now.getTime() - input.firstAttemptedAt.getTime() >= RETRY_WINDOW_MS) {
    return true;
  }
  return false;
}
