import { Sequelize } from "sequelize";
import { configs } from "@configs";


const sequelize = new Sequelize(process.env.PG_CONNECTION_URL || "", {
  logging: true, // Assuming that this is for development mode
});
const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    // Ideally, this must be sent to a logger service
    console.log("Database Connected!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return sequelize;
};

// TODO: Add disconnect method if env will be in test mode
export { pgConnect as connectDatabase, sequelize };
