const https = require('https');

function fetchYearHTML(year) {
  return new Promise((resolve) => {
    const url = `https://github.com/users/Biraj2004/contributions?from=${year}-12-01`;
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const idToDate = {};
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
    }).on('error', () => resolve([]));
  });
}

function calculateStreak(days) {
  const map = {};
  days.forEach(d => { map[d.date] = d.contributionCount; });
  
  // Exclude future dates beyond today (UTC)
  const todayStr = new Date().toISOString().split('T')[0];
  const sortedDates = Object.keys(map).filter(d => d <= todayStr).sort();
  const sortedDays = sortedDates.map(d => ({ date: d, contributionCount: map[d] }));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

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
  // If today has 0 contributions so far, check if yesterday had contributions to keep streak active
  if (idx >= 0 && sortedDays[idx].date === todayStr && sortedDays[idx].contributionCount === 0) {
    idx--;
  }

  while (idx >= 0 && sortedDays[idx].contributionCount > 0) {
    currentStreak++;
    idx--;
  }

  return { currentStreak, longestStreak, totalDays: sortedDays.length, last5Days: sortedDays.slice(-5) };
}

async function run() {
  const currentYear = new Date().getFullYear();
  let allDays = [];
  for (let yr = 2022; yr <= currentYear; yr++) {
    const yrDays = await fetchYearHTML(yr);
    allDays.push(...yrDays);
  }

  const result = calculateStreak(allDays);
  console.log('Filtered Streak Result:', result);
}

run();
