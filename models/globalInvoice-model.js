const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const globalInvoice = sequelize.define(
    'globalinvoice', {
  // Define the fields for the GlobalInvoice model
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  /* totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }, */
  paid: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  send: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
     clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      invoiceIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
},
{
    sequelize,
    modelName: "invoice",
  }
);

// Define the association with the Invoice model
globalInvoice.associate = function (models){
globalInvoice.hasMany(models.invoice, {foreignKey: 'globalInvoiceId'})
globalInvoice.belongsTo(models.client, { foreignKey: 'clientId' });
};


globalInvoice.sync()
    .then(() => console.log("globalInvoice table created"))
    .catch((err) => console.error("Error creating GlobalInvoice table: ", err));

  return globalInvoice;

}


