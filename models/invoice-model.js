module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define(
        "invoice", {
            /* placeCost:{},
            hotelCost:{},
            employeeFees:{},
            amount:{} */
        }, {
            sequelize,
            modelName: "mission",

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