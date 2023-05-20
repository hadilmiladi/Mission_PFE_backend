/* const { Sequelize, Model, DataTypes } = require('sequelize');
const Employee = require('./employee.model');
const sequelize = require('./index') */

module.exports = (sequelize, DataTypes) => {
    const Rank = sequelize.define(
        "rank", {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            permission: {
                type: DataTypes.ENUM('admin', 'user', 'ceo'),
                validate: {
                    isIn: [
                        ['admin', 'user', 'ceo']
                    ]
                },
                allowNull: false
            },
            perdiem: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: "rank",

        }
    );

    Rank.associate = function(models) {
        Rank.hasMany(models.employee, { foreignKey: 'rankId' });
    };
    Rank.sync()
        .then(() => console.log("Rank table created"))
        .catch((err) => console.error("Error creating rank table: ", err));
    return Rank
}