module.exports = (sequelize, DataTypes) =>
{
    const ItemPesanan = sequelize.define("ItemPesanan",
    {
        idPesanan:
        {
            type: DataTypes.CHAR(255),
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



    return ItemPesanan;
}