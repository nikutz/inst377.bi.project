import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function writePermit(id, category, agency, year, type, name, address, city, zip, date, cost, fullLocation, lat, long, dbSettings) {
  const db = await open(dbSettings);
  await db.exec('CREATE TABLE IF NOT EXISTS permits (id, category, agency, year, type, name, address, city, zip, date, cost, fullLocation, lat, long, UNIQUE(id))');
  await db.exec(`INSERT INTO permits VALUES ("${id}","${category}", "${agency}", "${year}","${type}", "${name}", "${address}", "${city}", "${zip}", "${date}", "${cost}", "${fullLocation}", "${lat}", "${long}") WHERE NOT EXISTS(SELECT 1 FROM permits WHERE id = ${id})`);
}

export default writePermit;

//   import writeUser from "./libraries/writeuser";
