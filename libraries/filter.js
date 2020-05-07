import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function filterPermits(lowerdate, upperdate, lowerprice, upperprice, dbSettings) {
  const db = await open(dbSettings);
  await db.all('SELECT id FROM permits WHERE year >= ${lowerdate} AND year <= ${upperdate} AND cost >= ${lowerprice} AND cost <= ${upperprice})', (err, rows) => {
    if (err) {
      throw err;
    }
    return rows;
  });
}

export default filterPermits;
