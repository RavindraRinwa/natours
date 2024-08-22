const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

if (!process.env.DATABASE) {
  throw new Error('DATABASE environment variable is not defined');
}
// console.log(process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
).replace('<USERNAME>', process.env.DATABASE_USERNAME);
// console.log(DB);
// if you want to use localdata base then replace db with process.env.LOCAL_DATABASE and declare this config file
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection error:', err.message);
  });

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});