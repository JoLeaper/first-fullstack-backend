const client = require('../lib/client');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    user_name VARCHAR(256) NOT NULL,
                    crest VARCHAR(512) NOT NULL
                );           
                CREATE TABLE digimon (
                    id SERIAL PRIMARY KEY NOT NULL,
                    digimon_name VARCHAR(512) NOT NULL,
                    digimon_level INTEGER NOT NULL,
                    digimon_type VARCHAR(512) NOT NULL,
                    digimon_attribute VARCHAR(512) NOT NULL,
                    digimon_attack VARCHAR(512) NOT NULL,
                    appeared_in_anime BOOLEAN NOT NULL
            );
        `);

    console.log('create tables complete');
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
