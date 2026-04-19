require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const q = 'SELECT id, to_email, template_key, payload FROM email_outbox ORDER BY id DESC LIMIT 15';
  const { rows } = await client.query(q);

  console.log(JSON.stringify(rows, null, 2));

  const reviewed = rows.filter(r => r.template_key === 'admission_request_ai_reviewed');
  const byTemplate = rows.reduce((a, r) => {
    a[r.template_key] = (a[r.template_key] || 0) + 1;
    return a;
  }, {});

  console.log('\n__SUMMARY__');
  console.log('total_rows=' + rows.length);
  console.log('by_template=' + JSON.stringify(byTemplate));
  console.log('admission_request_ai_reviewed_count=' + reviewed.length);

  if (reviewed.length) {
    console.log('admission_request_ai_reviewed_rows=' + JSON.stringify(reviewed.map(r => ({
      id: r.id,
      to_email: r.to_email,
      payload: r.payload
    })), null, 2));
  }

  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
