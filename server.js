const app = require('./lib/app');
require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();
const PORT = process.env.PORT || 7890;

app.get('/digimon', async(req, res) => {
  const data = await client.query('SELECT * from digimon');
  res.json(data.rows);
});

app.get('/digimon/:id', async(req, res) => {
  const id = req.params.id;
  const result = await client.query('SELECT * FROM digimon WHERE id = $1',
    [id]);
  res.json(result.rows[0]);
});

app.post('/digimon/', async(req, res) => {
  const data = await client.query(`
                                  INSERT INTO digimon (digimon_name, digimon_level, digimon_type, digimon_attribute, digimon_attack, appeared_in_anime, user_id)
                                  VALUES ($1, $2, $3, $4, $5, $6, $7)
                                  RETURNING *;
              `,
  [req.body.digimon_name, req.body.digimon_level, req.body.digimon_type, req.body.digimon_attribute, req.body.digimon_attack, req.body.appeared_in_anime, req.body.user_id]
  );
  res.json(data.rows[0]);
});

// app.put('/digimon/', async(req, res) => {
//   const data = await client.query(`
//                                   INSERT INTO digimon (digimon_name, digimon_level, digimon_type, digimon_attribute, digimon_attack, appeared_in_anime)
//                                   VALUES ($1, $2, $3, $4, $5, $6)
//                                   RETURNING *;
//               `,
//   [req.body.digimon_name, req.body.digimon_level, req.body.digimon_type, req.body.digimon_attribute, req.body.digimon_attack, req.body.appeared_in_anime]
//   );
//   res.json(data.rows[0]);
// });


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;

