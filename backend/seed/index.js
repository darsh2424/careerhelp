// seed/index.js
// Entry point: node seed/index.js
//
// Seeds CareerHelp with 10 companies, ~60 jobs (mixed roles/levels/salaries/cities),
// ~48 skills, requirements, responsibilities, and the supporting recruiter/user rows
// needed to satisfy the schema's foreign keys.
//
// Run this AFTER creating the schema from your .sql file.

// NOTE: bcrypt is the native-binding package. If it ever fails to install/build
// on a Windows/WAMP box, swap this for `bcryptjs` (pure JS, same API for hashSync).
const bcrypt = require('bcrypt');
const db = require('../config/db');
const companies = require('./data/companies');
const skillsList = require('./data/skills');
const jobTemplates = require('./data/jobTemplates');
const { randomInt, pickOne, pickMany, weightedPick, futureDate, pastDateTime, chance } = require('./helpers/random');
const { generateSalary } = require('./helpers/salary');

// Cities jobs can be posted in (mixed regardless of HQ, to add variety)
const CITIES = [
  'Ahmedabad', 'Gandhinagar', 'Surat', 'Rajkot', 'Vadodara', 'Mumbai', 'Pune',
  'Bengaluru', 'Hyderabad', 'Chennai', 'Jaipur', 'Delhi', 'Noida', 'Gurugram', 'Indore',
];

const JOB_TYPE_WEIGHTS = [
  { value: 'Full Time', weight: 70 },
  { value: 'Internship', weight: 15 },
  { value: 'Contract', weight: 10 },
  { value: 'Part Time', weight: 5 },
];

const WORK_MODE_WEIGHTS = [
  { value: 'On Site', weight: 40 },
  { value: 'Hybrid', weight: 35 },
  { value: 'Remote', weight: 25 },
];

const JOB_STATUS_WEIGHTS = [
  { value: 'active', weight: 78 },
  { value: 'closed', weight: 10 },
  { value: 'expired', weight: 7 },
  { value: 'draft', weight: 5 },
];

// Seeded recruiter accounts all share this password (hashed): Password@123
// Using hashSync here since it's a one-off script, not a request handler.
function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

// ----------------------------------------------------------------------------
// RESET: wipes out data from a previous seed run so this script is safely
// re-runnable. FK checks are disabled for the duration so table order doesn't
// matter. Lookup/reference tables (industries, job_types, work_modes,
// employment_levels) are intentionally left untouched since your schema
// pre-populates those and other tables depend on their ids staying stable.
//
// ⚠️ This clears ALL rows from the tables listed below — including any real
// candidate/application data, not just what this script inserted. That's fine
// for a fresh local dev DB, but don't point this at anything you care about.
// Run `node seed/index.js --keep-existing` to skip this step entirely.
// ----------------------------------------------------------------------------
const TABLES_TO_RESET = [
  'job_roles_map',
  'job_skills',
  'job_responsibilities',
  'job_requirements',
  'saved_jobs',
  'applications',
  'candidate_preferred_work_modes',
  'candidate_preferred_job_types',
  'candidate_preferred_roles',
  'candidate_skills',
  'jobs',
  'job_roles',
  'skills',
  'recruiter_profiles',
  'candidate_profiles',
  'companies',
  'users',
];

async function resetDatabase(conn) {
  console.log('🧹 Clearing previous seed data...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of TABLES_TO_RESET) {
    await conn.query(`TRUNCATE TABLE ${table}`);
  }
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log(`✔ Cleared ${TABLES_TO_RESET.length} tables (auto-increment ids reset to 1)\n`);
}

async function fetchMap(conn, table, nameCol = 'name') {
  const [rows] = await conn.query(`SELECT id, ${nameCol} FROM ${table}`);
  const map = {};
  for (const row of rows) map[row[nameCol]] = row.id;
  return map;
}

async function seedSkills(conn) {
  for (const skill of skillsList) {
    await conn.query('INSERT IGNORE INTO skills (name) VALUES (?)', [skill]);
  }
  console.log(`✔ Skills ready (${skillsList.length} in pool)`);
  return fetchMap(conn, 'skills');
}

async function seedJobRoles(conn) {
  for (const template of jobTemplates) {
    await conn.query('INSERT IGNORE INTO job_roles (name) VALUES (?)', [template.title]);
  }
  console.log(`✔ Job roles ready (${jobTemplates.length} roles)`);
  return fetchMap(conn, 'job_roles');
}

async function seedCompaniesAndRecruiters(conn, industryMap) {
  const seededCompanies = [];

  for (const company of companies) {
    const slug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const email = `hr@${slug}.com`;
    const password = hashPassword('Password@123');

    const [userResult] = await conn.query(
      `INSERT INTO users (email, password, role, is_verified) VALUES (?, ?, 'recruiter', TRUE)`,
      [email, password]
    );
    const userId = userResult.insertId;

    const [companyResult] = await conn.query(
      `INSERT INTO companies (name, description, website, city, state, country, verification_status, created_by)
       VALUES (?, ?, ?, ?, ?, 'India', 'verified', ?)`,
      [company.name, company.description, company.website, company.city, company.state, userId]
    );
    const companyId = companyResult.insertId;

    const [recruiterResult] = await conn.query(
      `INSERT INTO recruiter_profiles (user_id, company_id, full_name, designation, phone, subscription_type)
       VALUES (?, ?, ?, 'Talent Acquisition Manager', ?, 'premium')`,
      [userId, companyId, `${company.name} HR Team`, `9${randomInt(100000000, 999999999)}`]
    );
    const recruiterProfileId = recruiterResult.insertId;

    seededCompanies.push({
      id: companyId,
      recruiterProfileId,
      name: company.name,
      industry: company.industry,
      industryId: industryMap[company.industry],
      city: company.city,
    });
  }

  console.log(`✔ Companies + recruiters ready (${seededCompanies.length} companies)`);
  return seededCompanies;
}

// Picks a company for a job template, preferring companies in the template's
// preferred industries when specified. Falls back to any company otherwise.
function pickCompanyForTemplate(template, seededCompanies) {
  if (template.industryPreference && template.industryPreference.length) {
    const preferred = seededCompanies.filter((c) => template.industryPreference.includes(c.industry));
    if (preferred.length && chance(85)) {
      return pickOne(preferred);
    }
  }
  return pickOne(seededCompanies);
}

function pickCity(company) {
  // 50% chance the job is posted in the company's home city, otherwise anywhere in the city pool
  if (chance(50)) return company.city;
  return pickOne(CITIES);
}

async function insertJob(conn, { company, template, industryMap, jobTypeMap, workModeMap, employmentLevelMap }) {
  const jobType = weightedPick(JOB_TYPE_WEIGHTS);
  const workMode = weightedPick(WORK_MODE_WEIGHTS);

  // Interns are always entry level; otherwise pick from the role's typical levels
  const employmentLevel = jobType === 'Internship' ? 'Entry Level' : pickOne(template.employmentLevels);

  const status = weightedPick(JOB_STATUS_WEIGHTS);
  const city = pickCity(company);
  const { salary_type, salary_period, salary_min, salary_max } = generateSalary(employmentLevel, jobType);

  const experienceYears =
    employmentLevel === 'Entry Level' ? 0 :
    employmentLevel === 'Junior' ? randomInt(1, 2) :
    employmentLevel === 'Mid Level' ? randomInt(3, 5) :
    employmentLevel === 'Senior' ? randomInt(5, 8) :
    randomInt(6, 10); // Lead / Manager

  const openings = randomInt(1, 5);
  const createdAt = pastDateTime(0, 40);
  const publishedAt = status === 'draft' ? null : createdAt;
  const deadline = futureDate(15, 60);

  const description =
    `${template.summary} Join ${company.name} in ${city} and work with a team that values ` +
    `ownership, learning, and shipping quality work.`;

  const [jobResult] = await conn.query(
    `INSERT INTO jobs (
      company_id, recruiter_id, industry_id, job_type_id, work_mode_id, employment_level_id,
      title, description, experience_years, salary_type, salary_period, salary_min, salary_max,
      openings, deadline, status, draft_step, published_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5, ?, ?)`,
    [
      company.id,
      company.recruiterProfileId,
      industryMap[company.industry] || industryMap['Information Technology'],
      jobTypeMap[jobType],
      workModeMap[workMode],
      employmentLevelMap[employmentLevel],
      template.title,
      description,
      experienceYears,
      salary_type,
      salary_period,
      salary_min,
      salary_max,
      openings,
      deadline,
      status,
      publishedAt,
      createdAt,
    ]
  );

  return jobResult.insertId;
}

async function insertJobChildren(conn, jobId, template, skillMap, roleMap) {
  // Requirements: 4-8 picks from the template's pool
  const reqCount = randomInt(4, Math.min(8, template.requirements.length));
  const requirements = pickMany(template.requirements, reqCount);
  for (let i = 0; i < requirements.length; i++) {
    await conn.query(
      `INSERT INTO job_requirements (job_id, requirement, sort_order) VALUES (?, ?, ?)`,
      [jobId, requirements[i], i + 1]
    );
  }

  // Responsibilities: 5-8 picks from the template's pool
  const respCount = randomInt(5, Math.min(8, template.responsibilities.length));
  const responsibilities = pickMany(template.responsibilities, respCount);
  for (let i = 0; i < responsibilities.length; i++) {
    await conn.query(
      `INSERT INTO job_responsibilities (job_id, responsibility, sort_order) VALUES (?, ?, ?)`,
      [jobId, responsibilities[i], i + 1]
    );
  }

  // Skills: 3-6 picks from the template's skill pool, mostly "required"
  const skillCount = randomInt(3, Math.min(6, template.skills.length));
  const jobSkills = pickMany(template.skills, skillCount);
  for (const skillName of jobSkills) {
    const skillId = skillMap[skillName];
    if (!skillId) continue; // safety net in case a template references an unseeded skill
    const required = chance(80);
    await conn.query(
      `INSERT IGNORE INTO job_skills (job_id, skill_id, required) VALUES (?, ?, ?)`,
      [jobId, skillId, required]
    );
  }

  // Role mapping (each job maps to its own template role)
  const roleId = roleMap[template.title];
  if (roleId) {
    await conn.query(`INSERT IGNORE INTO job_roles_map (job_id, role_id) VALUES (?, ?)`, [jobId, roleId]);
  }
}

async function run() {
  const conn = await db.getConnection();
  try {
    console.log('🌱 Starting CareerHelp seed...\n');

    const keepExisting = process.argv.includes('--keep-existing');
    if (keepExisting) {
      console.log('⚠ Skipping reset (--keep-existing passed) — inserting on top of existing data.\n');
    } else {
      await resetDatabase(conn);
    }

    const industryMap = await fetchMap(conn, 'industries');
    const jobTypeMap = await fetchMap(conn, 'job_types');
    const workModeMap = await fetchMap(conn, 'work_modes');
    const employmentLevelMap = await fetchMap(conn, 'employment_levels');

    const skillMap = await seedSkills(conn);
    const roleMap = await seedJobRoles(conn);
    const seededCompanies = await seedCompaniesAndRecruiters(conn, industryMap);

    let totalJobs = 0;
    for (const template of jobTemplates) {
      for (let i = 0; i < template.count; i++) {
        const company = pickCompanyForTemplate(template, seededCompanies);
        const jobId = await insertJob(conn, {
          company,
          template,
          industryMap,
          jobTypeMap,
          workModeMap,
          employmentLevelMap,
        });
        await insertJobChildren(conn, jobId, template, skillMap, roleMap);
        totalJobs++;
      }
      console.log(`  ✔ ${template.title}: ${template.count} jobs created`);
    }

    console.log(`\n✅ Done! Seeded ${seededCompanies.length} companies and ${totalJobs} jobs.`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    conn.release();
    await db.end();
  }
}

run();