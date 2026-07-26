import { writeFile } from 'node:fs/promises';

const source = process.env.ICAL_URL;
if (!source) throw new Error('ICAL_URL is required.');
const response = await fetch(source, { headers: { accept: 'text/calendar' } });
if (!response.ok) throw new Error(`iCal request failed: ${response.status}`);
const ical = await response.text();
if (!ical.includes('BEGIN:VCALENDAR')) throw new Error('The iCal response is not a calendar.');

const unavailable = (ical.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || []).flatMap(event => {
  const start = event.match(/^DTSTART(?:;[^:]*)?:(\d{8})/m)?.[1];
  const end = event.match(/^DTEND(?:;[^:]*)?:(\d{8})/m)?.[1];
  if (!start || !end || end <= start) return [];
  return [{ start: `${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6)}`, end: `${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6)}` }];
});
await writeFile('availability.json', `${JSON.stringify({ updatedAt: new Date().toISOString(), unavailable }, null, 2)}\n`);
console.log(`Wrote ${unavailable.length} unavailable date ranges.`);
