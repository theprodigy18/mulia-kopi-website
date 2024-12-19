module.exports = (sequelize, DataTypes) =>
{
    const Admin = sequelize.define("Admin",
    {
        idAdmin:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
            primaryKey: true
        },
        namaAdmin:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        username:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
            unique: true,
        },
        password:
        {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },
    {
        freezeTableName: true
    });


    return Admin;
}