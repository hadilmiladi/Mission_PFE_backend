module.exports = (sequelize, DataTypes) => {
  const Mission = sequelize.define(
    "mission",
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      declined: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      declinedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      acceptedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      finish: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      planeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      planeLink: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      planePrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      hotelLink: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hotelPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "mission",
    }
  );
  Mission.associate = function (models) {
    Mission.belongsTo(models.client);
    Mission.belongsTo(models.employee);
    Mission.hasOne(models.invoice);
  };

  Mission.sync()
    .then(() => console.log("Mission table created"))
    .catch((err) => console.error("Error creating Mission table: ", err));

  return Mission;
};
