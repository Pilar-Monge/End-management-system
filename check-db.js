const { DataSource } = require('typeorm');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function check() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: false,
  });

  try {
    console.log('Connecting to database...');
    await ds.initialize();
    console.log('Connected!');

    const columns = await ds.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'session'
    `);
    console.log('Columns in session table:');
    console.table(columns);
  } catch (err) {
    console.error('Error during check:', err);
  } finally {
    await ds.destroy();
  }
}

check();
