const client = require('../lib/client');
// import our seed data:
const digimon = require('./digimon.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (user_name, crest)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.name, user.crest]);
      })
    );
      
    const getUser = (singleDigimon) => {
      const userId = singleDigimon.user;
      return userId;
    };

    await Promise.all(
      digimon.map(singleDigimon => {
        return client.query(`
                    INSERT INTO digimon (digimon_name, digimon_level, digimon_type, digimon_attribute, digimon_attack, appeared_in_anime, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
        [singleDigimon.digimon_name, singleDigimon.digimon_level, singleDigimon.digimon_type, singleDigimon.digimon_attribute, singleDigimon.digimon_attack, singleDigimon.appeared_in_anime, getUser(singleDigimon)]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
