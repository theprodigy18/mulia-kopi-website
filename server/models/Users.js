module.exports = (sequelize, DataTypes) =>
{
    const Users = sequelize.define("Users",
    {
        email:
        {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        namaPelanggan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        password:
        {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status:
        {
            type: DataTypes.BOOLEAN, 
            defaultValue: false,
        },
        recoveryToken:
        {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });


    return Users;
}