const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
    static initiate(sequelize) {
        Hashtag.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        // 많은 게시물은 많은 헤시테그와 다대다 관계이다.
        // 중간 테이블 : PostHashtag
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
};