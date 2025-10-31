const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE_URL.replace(
  `<db_password>`,
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  // eslint-disable-next-line no-console
  console.log(`DB connection successful!`);
});

const app = require(`./app`);

const port = process.env.port || 3000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

process.on(`unhandledRejection`, (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandled rejection, Shutting Down Server.`);
  server.close(() => {
    process.exit(1);
  });
});
