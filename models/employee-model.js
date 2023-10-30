/* const rank = require('./rank-model'); */

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "employee",
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          isInt: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      
      activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      
      rankId: {
        type: DataTypes.INTEGER, 
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "employee",
    }
  );

  Employee.associate = function (models) {
    Employee.belongsTo(models.rank, { foreignKey: 'rankId' });
    Employee.hasMany(models.mission);
  };

  Employee.sync()
    .then(() => console.log("Employee table created"))
    .catch((err) => console.error("Error creating Employee table: ", err));

  return Employee;
};
