# Create Alchemy SQL BE

## Getting started
1. Change all the files in the `data` directory to match the data model of your app.
1. Run `heroku create`
1. Run `npm run setup-heroku` to create a heroku SQL database in the cloud to go with your heroku app.
1. Run `heroku config:get DATABASE_URL` to get your heroku sql database url from the cloud. Put this in your .env file, under `DATABASE_URL`
1. Run `npm run setup-db`
1. Run `npm run start:watch` to start the dev server

## Adding auth routes and protecting routes:
