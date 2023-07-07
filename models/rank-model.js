

module.exports = (sequelize, DataTypes) => {
    const Rank = sequelize.define(
        "rank", {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            permission: {
                type: DataTypes.ENUM('admin', 'user', 'ceo','chef du projet'),
                validate: {
                    isIn: [
                        ['admin', 'user', 'ceo','chef du projet']
                    ]
                },
                allowNull: false
            },
            perdiem: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true // Update allowNull to true
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true // Update allowNull to true
            }

            
        }, {
            sequelize,
            modelName: "rank",

        }
    );

    //Rank.associate = function(models) {
        /* Rank.hasMany(models.employee, { foreignKey: 'rankId' }); */
      //  Rank.belongsTo(models.employee, { foreignKey: 'rankId' });
        
   // };

   Rank.associate = function (models) {
    Rank.hasMany(models.employee, { foreignKey: 'rankId' });
  };

    Rank.sync()
        .then(() => console.log("Rank table created"))
        .catch((err) => console.error("Error creating rank table: ", err));
    return Rank



}

  