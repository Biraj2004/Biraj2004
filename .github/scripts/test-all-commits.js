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
        // Parse tooltips or contribution total text
        const match = body.match(/([\d,]+)\s+contributions\s+in\s+(\d{4})/i);
        const totalYear = match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
        
        // Parse daily counts
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

        resolve({ year, totalYear, days });
      });
    }).on('error', () => resolve({ year, totalYear: 0, days: [] }));
  });
}

async function run() {
  const currentYear = new Date().getFullYear();
  let allTimeContributions = 0;

  for (let yr = 2022; yr <= currentYear; yr++) {
    const res = await fetchYearHTML(yr);
    console.log(`Year ${yr}: Total = ${res.totalYear}, Days parsed = ${res.days.length}`);
    allTimeContributions += res.totalYear;
  }

  console.log(`\nTOTAL ALL-TIME CONTRIBUTIONS: ${allTimeContributions}`);
}

run();
