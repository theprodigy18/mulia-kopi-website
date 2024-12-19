module.exports = (sequelize, DataTypes) =>
{
    const ScanMood = sequelize.define("ScanMood",
    {
        idScan:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
            primaryKey: true
        },
        email:
        {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mood:
        {
            type: DataTypes.CHAR(255),
            allowNull: false,
        }
    },
    {
        freezeTableName: true
    });



    return ScanMood;
}