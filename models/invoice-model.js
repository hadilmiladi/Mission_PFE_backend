module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define(
        "invoice", {
            from:{
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            to:{
                type: DataTypes.DATEONLY,
                allowNull: true,
            }
        }, {
            sequelize,
            modelName: "invoice",

        }
    );
    Invoice.associate = function(models) {
        Invoice.belongsTo(models.mission);
    };

    Invoice.sync()
        .then(() => console.log("Invoice table created"))
        .catch((err) => console.error("Error creating Invoice table: ", err));

    return Invoice;
};