export type DayStatus = 'green' | 'yellow' | 'red';

export interface DayInfo {
  date: string; // YYYY-MM-DD
  status: DayStatus;
  label?: string;
}

// ─── Festival / High-demand Dates ─────────────────────────────────────────────

interface FestivalEntry {
  month: number; // 1-based
  day: number;
  name: string;
  spreadDays?: number; // how many days around also red
}

const FESTIVALS: FestivalEntry[] = [
  { month: 1, day: 14, name: 'Makar Sankranti', spreadDays: 2 },
  { month: 1, day: 26, name: 'Republic Day', spreadDays: 3 },
  { month: 3, day: 14, name: 'Holi', spreadDays: 4 },
  { month: 3, day: 29, name: 'Good Friday', spreadDays: 2 },
  { month: 4, day: 10, name: 'Eid ul-Fitr', spreadDays: 5 },
  { month: 4, day: 14, name: 'Ambedkar Jayanti', spreadDays: 1 },
  { month: 6, day: 17, name: 'Eid ul-Adha', spreadDays: 4 },
  { month: 8, day: 15, name: 'Independence Day', spreadDays: 3 },
  { month: 8, day: 19, name: 'Raksha Bandhan', spreadDays: 3 },
  { month: 9, day: 5, name: 'Janmashtami', spreadDays: 2 },
  { month: 10, day: 2, name: 'Gandhi Jayanti', spreadDays: 2 },
  { month: 10, day: 12, name: 'Navratri', spreadDays: 5 },
  { month: 10, day: 22, name: 'Dussehra', spreadDays: 3 },
  { month: 11, day: 1, name: 'Diwali', spreadDays: 6 },
  { month: 11, day: 5, name: 'Bhai Dooj', spreadDays: 2 },
  { month: 11, day: 15, name: 'Guru Nanak Jayanti', spreadDays: 2 },
  { month: 12, day: 25, name: 'Christmas', spreadDays: 4 },
  { month: 12, day: 31, name: 'New Year Eve', spreadDays: 2 },
];

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function buildRedSet(year: number): Map<string, string> {
  const redMap = new Map<string, string>();
  for (const fest of FESTIVALS) {
    const spread = fest.spreadDays ?? 3;
    for (let delta = -spread; delta <= spread; delta++) {
      const base = new Date(year, fest.month - 1, fest.day + delta);
      const key = dateStr(base.getFullYear(), base.getMonth() + 1, base.getDate());
      if (!redMap.has(key)) {
        // Only the exact festival day gets the festival name label
        redMap.set(key, delta === 0 ? fest.name : '');
      }
    }
  }
  return redMap;
}

export function getFestivalLabel(dateStr_: string): string | undefined {
  const d = parseDate(dateStr_);
  const redMap = buildRedSet(d.getFullYear());
  const val = redMap.get(dateStr_);
  return val || undefined;
}

export function getDayStatus(dateStr_: string): DayStatus {
  const d = parseDate(dateStr_);
  const redMap = buildRedSet(d.getFullYear());
  if (redMap.has(dateStr_)) return 'red';
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return 'yellow'; // Weekend
  return 'green';
}

export function generateCalendarDays(fromDate: Date, count: number): DayInfo[] {
  const days: DayInfo[] = [];
  const redMap = buildRedSet(fromDate.getFullYear());
  // Also build for next year in case we cross year boundary
  const nextYearRedMap = buildRedSet(fromDate.getFullYear() + 1);

  for (let i = 0; i < count; i++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + i);
    const key = dateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const combined = d.getFullYear() === fromDate.getFullYear() ? redMap : nextYearRedMap;
    let status: DayStatus;
    let label: string | undefined;

    if (combined.has(key)) {
      status = 'red';
      const val = combined.get(key)!;
      if (val) label = val;
    } else {
      const dow = d.getDay();
      status = (dow === 0 || dow === 6) ? 'yellow' : 'green';
    }

    days.push({ date: key, status, label });
  }
  return days;
}
