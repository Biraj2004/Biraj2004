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

async function run() {
  const days = await fetchPublicContributions();
  const year2026Days = days.filter(d => d.date.startsWith('2026'));
  const year2026Total = year2026Days.reduce((acc, d) => acc + d.contributionCount, 0);
  const totalLastYear = days.reduce((acc, d) => acc + d.contributionCount, 0);
  console.log('2026 Contributions:', year2026Total);
  console.log('Last 1 Year Contributions:', totalLastYear);
}

run();
