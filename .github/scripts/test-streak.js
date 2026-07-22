const https = require('https');

function fetchPublicContributions() {
  return new Promise((resolve) => {
    https.get('https://github.com/users/Biraj2004/contributions', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const idToDate = {};
        // Match td with id and data-date in any order
        const tdRegex = /<td[^>]*id="(contribution-day-component-[^"]+)"[^>]*>/g;
        let m;
        while ((m = tdRegex.exec(body)) !== null) {
          const tdStr = m[0];
          const dateMatch = tdStr.match(/data-date="([^"]+)"/);
          if (dateMatch) {
            idToDate[m[1]] = dateMatch[1];
          }
        }

        const dateCounts = {};
        const tipRegex = /for="(contribution-day-component-[^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
        while ((m = tipRegex.exec(body)) !== null) {
          const id = m[1];
          const text = m[2].trim();
          const date = idToDate[id];
          if (date) {
            let count = 0;
            if (!text.startsWith('No contribution')) {
              const numMatch = text.match(/^([\d,]+)\s+contribution/);
              if (numMatch) {
                count = parseInt(numMatch[1].replace(/,/g, ''), 10);
              }
            }
            dateCounts[date] = count;
          }
        }

        const dates = Object.keys(dateCounts).sort();
        const days = dates.map(d => ({ date: d, contributionCount: dateCounts[d] }));
        resolve(days);
      });
    });
  });
}

function calculateStreak(days) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedDays = [...days].sort((a, b) => new Date(a.date) - new Date(b.date));
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < sortedDays.length; i++) {
    const count = sortedDays[i].contributionCount;
    if (count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  let idx = sortedDays.length - 1;
  if (idx >= 0 && sortedDays[idx].date === todayStr && sortedDays[idx].contributionCount === 0) {
    idx--;
  }

  while (idx >= 0 && sortedDays[idx].contributionCount > 0) {
    currentStreak++;
    idx--;
  }

  return { currentStreak, longestStreak };
}

async function main() {
  const days = await fetchPublicContributions();
  console.log('Parsed days:', days.length);
  const active = days.filter(d => d.contributionCount > 0);
  console.log('Active days count:', active.length);
  if (active.length > 0) {
    console.log('Sample active day:', active[0]);
  }
  const streak = calculateStreak(days);
  console.log('Calculated streak:', streak);
}

main();
