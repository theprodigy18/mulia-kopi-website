module.exports = (sequelize, DataTypes) =>
{
    const RiwayatTransaksi = sequelize.define("RiwayatTransaksi",
    {
        idPesanan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        idAdmin:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        totalHargaTemp:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        diskon:
        {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pajak:
        {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        totalHarga:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        metodePembayaran:
        {
            type: DataTypes.CHAR(255),
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });


    
    return RiwayatTransaksi;
}