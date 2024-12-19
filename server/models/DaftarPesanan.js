module.exports = (sequelize, DataTypes) =>
{
    const DaftarPesanan = sequelize.define("DaftarPesanan",
    {
        idPesanan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
            primaryKey: true
        },
        uniqueCode:
        {
            type: DataTypes.CHAR(255),
            allowNull: true,
            unique: true
        },
        email:
        {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        namaPelanggan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        statusPembayaran:
        {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        freezeTableName: true
    });

    return DaftarPesanan;
}