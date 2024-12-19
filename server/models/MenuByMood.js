module.exports = (sequelize, DataTypes) =>
{
    const MenuByMood = sequelize.define("MenuByMood",
    {
        mood:
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


    return MenuByMood;
}