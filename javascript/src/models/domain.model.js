const Sequelize = require('sequelize');

module.exports = class Juso extends Sequelize.Model {
    static initiate(sequelize) {
        Juso.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'),
                allowNull: false,
            },
            clientSecret: {
                // 클라이언트 비밀키
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Juso',
            tableName: 'jusos',
        });
    }

    static associate(db) {
        db.Juso.belongsTo(db.User);
    }
};