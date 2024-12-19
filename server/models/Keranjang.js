module.exports = (sequelize, DataTypes) =>
{
    const Keranjang = sequelize.define("Keranjang",
    {
        email:
        {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        idMenu:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        jumlah:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });



    return Keranjang;
}