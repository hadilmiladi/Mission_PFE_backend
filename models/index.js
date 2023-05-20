const dbConfig = require("../cnxDB");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
(async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // Run any other database queries or server startup code here
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// employee and rank 
db.employee = require("./employee-model.js")(sequelize, Sequelize);
db.rank = require("./rank-model")(sequelize, Sequelize);
db.passport = require("./passeport-model")(sequelize, Sequelize);
db.visa = require("./visa-model")(sequelize, Sequelize);
db.mission = require("./mission-model")(sequelize, Sequelize);
db.invoice = require("./invoice-model")(sequelize, Sequelize);
db.client = require("./client-model")(sequelize, Sequelize);
// 


// Define the associations between models
db.employee.associate(db);
db.rank.associate(db);
db.passport.associate(db);
db.visa.associate(db);
db.client.associate(db);
db.mission.associate(db);
db.invoice.associate(db);



(async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = db;