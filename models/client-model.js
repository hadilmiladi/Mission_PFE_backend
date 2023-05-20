const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define(
        "client", {
            company_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                validate: {
                    isInt: true,
                },
            },

            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            activated: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        }, {
            sequelize,
            modelName: "client",
        }
    );
    Client.associate = function(models) {
        Client.hasMany(models.mission, { foreignKey: "clientId" });
    };
    Client.sync()
        .then(() => console.log("Client table created"))
        .catch((err) => console.error("Error creating Client table: ", err));

    return Client;
};