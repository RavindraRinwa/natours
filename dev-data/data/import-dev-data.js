const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const Tour = require('./../../models/tourModel');
if (!process.env.DATABASE) {
  throw new Error('DATABASE environment variable is not defined');
}
console.log(process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
).replace('<USERNAME>', process.env.DATABASE_USERNAME);
console.log(DB);
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

//READ JSON FILE
//This is json so we need to create javascript object
// const tours = fs.readFileSync('tour-simple.json', 'utf-8');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete All Data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
