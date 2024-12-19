module.exports = (sequelize, DataTypes) =>
{
    const WaktuBuka = sequelize.define("WaktuBuka",
    {
        hari:
        {
            type: DataTypes.CHAR(255),
        },
        waktuBuka:
        {
            type: DataTypes.TIME,
        },
        waktuTutup: 
        {
            type: DataTypes.TIME,
        },
    },
    {
        freezeTableName: true
    });

    return WaktuBuka;
}