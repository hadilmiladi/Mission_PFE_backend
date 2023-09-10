module.exports = (sequelize, DataTypes) => {
    const mailconfig = sequelize.define(
        "mailconfig", {
            from: {
                type: DataTypes.STRING,
                allowNull: false
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false
             
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            configname: {
                type: DataTypes.STRING,
                allowNull: true // Update allowNull to true
            },
            email:{
                type: DataTypes.STRING,
                allowNull: true
            },
            password:{
                type: DataTypes.TEXT,
                allowNull: true
            },
            typeofmail:{
                type: DataTypes.ENUM('gmail','outlook'),
                validate:{
                    isIn:[
                        ['gmail','outlook']
                    ]
                },
                allowNull:false
            }

            
        }, {
            sequelize,
            modelName: "mailconfig",

        }
    );





    mailconfig.sync()
        .then(() => console.log("mailconfig table created"))
        .catch((err) => console.error("Error creating mailconfig table: ", err));
    return mailconfig



}

  