module.exports = (sequelize, DataTypes) =>
{
    const RekomendasiMenu = sequelize.define("RekomendasiMenu",
    {
        idScan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        idMenu:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        }
    },
    {
        freezeTableName: true
    });


    return RekomendasiMenu;
}