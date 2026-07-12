// seed/helpers/random.js
// Small collection of randomness helpers shared by the seed script.

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function pickOne(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function pickMany(arr, count) {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// Fisher-Yates shuffle, non-mutating
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// weights: [{ value: 'Full Time', weight: 70 }, { value: 'Internship', weight: 15 }, ...]
function weightedPick(weights) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let rand = Math.random() * total;
  for (const w of weights) {
    if (rand < w.weight) return w.value;
    rand -= w.weight;
  }
  return weights[weights.length - 1].value;
}

// Returns a YYYY-MM-DD string somewhere between minDays and maxDays from today (future deadline)
function futureDate(minDays = 15, maxDays = 60) {
  const d = new Date();
  d.setDate(d.getDate() + randomInt(minDays, maxDays));
  return d.toISOString().slice(0, 10);
}

// Returns a DATETIME string somewhere in the past (minDays to maxDays ago) — useful for created_at/published_at
function pastDateTime(minDaysAgo = 0, maxDaysAgo = 45) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(minDaysAgo, maxDaysAgo));
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function chance(percent) {
  return Math.random() * 100 < percent;
}

module.exports = {
  randomInt,
  randomFloat,
  pickOne,
  pickMany,
  shuffle,
  weightedPick,
  futureDate,
  pastDateTime,
  chance,
};
