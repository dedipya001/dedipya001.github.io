import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'public', 'data', 'github_contributions.json');

const owner = process.env.GITHUB_OWNER || 'dedipya001';
const actionsToken = process.env.GITHUB_TOKEN || '';
const personalToken = process.env.PERSONAL_TOKEN || '';
const workToken = process.env.WORK_TOKEN || '';
const firstYear = Number(process.env.GITHUB_STATS_START_YEAR || 2023);
const currentYear = new Date().getUTCFullYear();

function readExistingData() {
  try {
    return JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  } catch {
    return {};
  }
}

async function graphql(token, query, variables) {
  if (!token) throw new Error('No GitHub token available');

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': `${owner}-portfolio-stats-action`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub GraphQL HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(body.errors.map((error) => error.message).join('; '));
  }
  return body.data;
}

const publicUserQuery = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

const viewerQuery = `
  query ContributionCalendar($from: DateTime!, $to: DateTime!) {
    viewer {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

function yearRange(year) {
  const from = `${year}-01-01T00:00:00Z`;
  const to = year === currentYear
    ? new Date().toISOString()
    : `${year}-12-31T23:59:59Z`;
  return { from, to };
}

function calendarToMap(calendar) {
  const map = new Map();
  if (!calendar?.weeks) return map;

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays || []) {
      map.set(day.date, Number(day.contributionCount || 0));
    }
  }
  return map;
}

async function fetchPersonalCalendar(from, to) {
  if (personalToken) {
    try {
      const data = await graphql(personalToken, viewerQuery, { from, to });
      const login = data?.viewer?.login;
      if (login && login !== owner) {
        console.warn(`PERSONAL_TOKEN belongs to ${login}, expected ${owner}. Falling back to public ${owner} data.`);
      } else {
        return data?.viewer?.contributionsCollection?.contributionCalendar ?? null;
      }
    } catch (error) {
      console.warn(`PERSONAL_TOKEN query failed: ${error.message}. Falling back to public data.`);
    }
  }

  if (!actionsToken) {
    throw new Error('GITHUB_TOKEN is unavailable and PERSONAL_TOKEN could not be used');
  }

  const data = await graphql(actionsToken, publicUserQuery, { login: owner, from, to });
  return data?.user?.contributionsCollection?.contributionCalendar ?? null;
}

async function fetchWorkCalendar(from, to) {
  if (!workToken) return null;
  const data = await graphql(workToken, viewerQuery, { from, to });
  return {
    login: data?.viewer?.login ?? 'unknown',
    calendar: data?.viewer?.contributionsCollection?.contributionCalendar ?? null,
  };
}

const existing = readExistingData();
const merged = {};

for (let year = firstYear; year <= currentYear; year += 1) {
  const { from, to } = yearRange(year);
  const existingDays = Array.isArray(existing[String(year)]) ? existing[String(year)] : [];
  const existingPersonal = new Map(existingDays.map((day) => [day.date, Number(day.personal || 0)]));
  const existingWork = new Map(existingDays.map((day) => [day.date, Number(day.work || 0)]));

  let personalCalendar = null;
  try {
    personalCalendar = await fetchPersonalCalendar(from, to);
  } catch (error) {
    console.warn(`Personal contribution fetch failed for ${year}: ${error.message}. Keeping existing personal values.`);
  }

  let workResult = null;
  try {
    workResult = await fetchWorkCalendar(from, to);
  } catch (error) {
    console.warn(`Work contribution fetch failed for ${year}: ${error.message}. Keeping existing work values.`);
  }

  const personalMap = personalCalendar ? calendarToMap(personalCalendar) : existingPersonal;
  const workMap = workResult?.calendar ? calendarToMap(workResult.calendar) : existingWork;
  const dates = new Set([...personalMap.keys(), ...workMap.keys()]);
  const lastAllowedDate = year === currentYear
    ? new Date().toISOString().slice(0, 10)
    : `${year}-12-31`;

  merged[String(year)] = [...dates]
    .filter((date) => date.startsWith(`${year}-`) && date <= lastAllowedDate)
    .sort()
    .map((date) => ({
      date,
      personal: personalMap.get(date) || 0,
      work: workMap.get(date) || 0,
    }));

  const personalTotal = [...personalMap.values()].reduce((sum, count) => sum + count, 0);
  const workTotal = [...workMap.values()].reduce((sum, count) => sum + count, 0);
  console.log(`${year}: personal=${personalTotal}, work=${workTotal}${workResult ? ` (${workResult.login})` : ' (preserved; WORK_TOKEN not configured)'}`);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
console.log(`Updated ${path.relative(rootDir, outputFile)}`);
