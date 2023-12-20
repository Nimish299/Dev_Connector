const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlparser: true,
      //  useFindAndModify: false,
      //  useCreateIndex: true,
      //useNewUrlParser: true,
      // useCreateIndex: true,
      //  useFindAndModify: false,
      useUnifiedTopology: true,
      // strictPopulate: false,
    });

    console.log(`MongoDm connected  .......`);
  } catch (err) {
    console.error(err.message);
    // exit process failed
    process.exit(1);
  }
};

module.exports = connectDb;
