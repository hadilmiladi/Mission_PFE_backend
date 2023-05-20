module.exports = (sequelize, DataTypes) => {
    const Visa = sequelize.define(
        "visa", {
            valable_for: {
                type: DataTypes.STRING,
                allowNull: true
            },
            startAt: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            expiresAt: {
                type: DataTypes.DATEONLY,
                allowNull: true
            }
        }, {
            sequelize,
            modelName: "visa",

        }
    );
    Visa.associate = function(models) {
        Visa.belongsTo(models.passport, { foreignKey: 'passportId' });
    };
    Visa.sync()
        .then(() => console.log("Visa table created"))
        .catch((err) => console.error("Error creating Visa table: ", err));
    return Visa
}