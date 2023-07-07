module.exports = (sequelize, DataTypes) => {
    const passport = sequelize.define(
        "passport", {
            registration: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            nationality: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            expiresAt: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: true
              }
        }, {
            sequelize,
            modelName: "passport",

        }
    );

    /* passport.associate = function(models) {
        passport.hasOne(models.visa);
    }; */
    passport.associate = function(models) {
        passport.belongsTo(models.employee, { foreignKey: "employeeId" });
        passport.hasMany(models.visa, { foreignKey: "passportId" })
    };
    passport.sync()
        .then(() => console.log("passport table created"))
        .catch((err) => console.error("Error creating passport table: ", err));
    return passport
}