module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'hadil',
  database: 'missionapp',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
