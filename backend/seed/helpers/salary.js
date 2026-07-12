// seed/helpers/salary.js
// Generates realistic Indian salary ranges based on employment level & job type.
// jobs.salary_min / salary_max are DECIMAL(10,2) — we store plain rupee amounts
// (not "LPA shorthand"), matching salary_period.

const { randomInt, chance } = require('./random');

// Bounds are in plain rupees. "month" period => monthly stipend/salary,
// "year" period => annual CTC.
const BRACKETS = {
  Internship: { period: 'month', min: 10000, max: 20000, step: 1000 },
  'Entry Level': { period: 'year', min: 300000, max: 500000, step: 10000 },
  Junior: { period: 'year', min: 500000, max: 800000, step: 10000 },
  'Mid Level': { period: 'year', min: 800000, max: 1500000, step: 25000 },
  Senior: { period: 'year', min: 1500000, max: 3000000, step: 50000 },
  Lead: { period: 'year', min: 1800000, max: 3200000, step: 50000 },
  Manager: { period: 'year', min: 2000000, max: 3500000, step: 50000 },
};

/**
 * @param {string} employmentLevelName e.g. 'Entry Level', 'Mid Level', 'Senior'
 * @param {string} jobTypeName e.g. 'Full Time', 'Internship', 'Contract'
 * @returns {{ salary_type: string, salary_period: string, salary_min: number|null, salary_max: number|null }}
 */
function generateSalary(employmentLevelName, jobTypeName) {
  const bracket =
    jobTypeName === 'Internship'
      ? BRACKETS.Internship
      : BRACKETS[employmentLevelName] || BRACKETS['Entry Level'];

  const span = bracket.max - bracket.min;
  const minOffset = randomInt(0, Math.floor((span * 0.6) / bracket.step)) * bracket.step;
  const min = bracket.min + minOffset;

  const remaining = bracket.max - min;
  const maxOffset = randomInt(Math.floor(remaining * 0.3), remaining) || bracket.step;
  const max = Math.min(bracket.max, min + Math.max(bracket.step, maxOffset));

  // Occasionally mark a posting as "negotiable" (no fixed figures) or a rare "fixed" single figure
  const roll = Math.random();
  if (roll < 0.12) {
    return { salary_type: 'negotiable', salary_period: bracket.period, salary_min: null, salary_max: null };
  }
  if (roll < 0.20) {
    return { salary_type: 'fixed', salary_period: bracket.period, salary_min: min, salary_max: min };
  }

  return { salary_type: 'range', salary_period: bracket.period, salary_min: min, salary_max: max };
}

module.exports = { generateSalary, BRACKETS };
