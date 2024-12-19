module.exports = (sequelize, DataTypes) =>
{
    const DaftarMenu = sequelize.define("DaftarMenu",
    {
        idMenu:
        {
            type: DataTypes.CHAR(255),
            primaryKey: true,
            allowNull: false,
        },
        namaMenu:
        {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        kategori:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        gambar:
        {
            type: DataTypes.TEXT,
        },
        detailMenu:
        {
            type: DataTypes.TEXT,
        },
        harga:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stok:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isDeleted:
        {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }

    },
    {
        freezeTableName: true
    });


    return DaftarMenu;
};