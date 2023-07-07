module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define(
      "invoice",
      {
        /*  type:{
                  type: DataTypes.ENUM('global', 'mini'),
                  allowNull: true,
                  default:"mini"
              }, */
        start: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
       
        missionId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        clientId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        employeeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        globalInvoiceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
        /* amount: {
          type: DataTypes.FLOAT,
          allowNull: true,
        }, */
      },
      {
        sequelize,
        modelName: "invoice",
      }
    );
  
    Invoice.associate = function (models) {
      Invoice.belongsTo(models.mission, { foreignKey: "missionId" });
      Invoice.belongsTo(models.client, { foreignKey: "clientId" });
      Invoice.belongsTo(models.employee, { foreignKey: "employeeId" });
      Invoice.belongsTo(models.globalInvoice, {
        foreignKey: 'globalInvoiceId', // Assuming you have a foreign key column named 'globalInvoiceId' in the Invoice table
      });
      /* Invoice.hasMany(models.employee,{foreignKey:"employeeId"}); */
    };
  
   /*  Invoice.addHook("afterCreate", async (invoice) => {
      try {
        const mission = await invoice.getMission();
        const employee = await invoice.getEmployee({
          include: [{ model: models.rank }],
        });
        
        // calculate the nember of days of the mession
        const numberOfDays = invoice.end - invoice.start 
        const Difference_In_Days = numberOfDays / (1000 * 3600 * 24);

        // Calculate the perdiem multiplied by the number of days
        const perdiem = employee.rank?.perdiem || 0; // Fallback to 0 if perdiem is not available
        const hotelPrice = mission.hotelPrice || 0; // Fallback to 0 if hotelPrice is not available
        const planPrice = mission.planPrice || 0; // Fallback to 0 if planPrice is not available
    
        const calculatedAmount = hotelPrice + planPrice + (perdiem * Difference_In_Days);
        console.log(Difference_In_Days);
        invoice.amount = calculatedAmount;
        await invoice.save();
      } catch (error) {
        console.error("Error updating invoice amount:", error);
      }
    });
     */
  
    Invoice.sync()
      .then(() => console.log("Invoice table created"))
      .catch((err) => console.error("Error creating Invoice table: ", err));
  
    return Invoice;
  };
  