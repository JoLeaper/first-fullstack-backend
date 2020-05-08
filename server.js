// Auth
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');
const request = require('superagent');
const authRoutes = createAuthRoutes({
  selectUser(email) {
    return client.query(`
            SELECT id, email, hash, display_name as "displayName" 
            FROM users
            WHERE email = $1;
        `,
    [email]
    ).then(result => result.rows[0]);
  },
  insertUser(user, hash) {
    console.log(user);
    return client.query(`
            INSERT into users (email, hash, display_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, display_name as "displayName";
        `,
    [user.email, hash, user.displayName]
    ).then(result => result.rows[0]);
  }
});

const app = require('./lib/app');
// setup authentication routes to give user an auth token
// creates a /signin and a /signup route. 
// each requires a POST body with a .email and a .password
app.use('/api/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});
require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();



const PORT = process.env.PORT || 7890;

app.get('/digimon', async(req, res) => {
  // const data = await client.query('SELECT * from digimon');
  // res.json(data.rows);
  const digimonData = await request.get('https://murmuring-beyond-72755.herokuapp.com/');
  const parsedDigimonData = JSON.parse(digimonData);
  res.json(parsedDigimonData);

});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;


const getLocation = async(citySearched) => {
  const geoData = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${citySearched}&format=json`);
  return JSON.parse(geoData.text)[0];
};


app.get('/location', (req, res) => {

  getLocation(req.query.search).then((locationObject => {
      const response = formatObject(locationObject);
      lat = response.latitude;
      lon = response.longitude;
      res.json(response);
  }));

});