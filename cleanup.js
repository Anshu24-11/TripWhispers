require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/users");      // fixed path
const Listing = require("./models/listing"); // fixed path


async function cleanup() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);

    const userIds = await User.distinct("_id");
    const result = await Listing.deleteMany({
      owner: { $exists: true, $nin: userIds },
    });

    console.log(`Deleted ${result.deletedCount} orphaned listings.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanup();
