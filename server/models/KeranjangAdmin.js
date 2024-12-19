module.exports = (sequelize, DataTypes) =>
{
    const KeranjangAdmin = sequelize.define("KeranjangAdmin",
    {
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



    return KeranjangAdmin;
}