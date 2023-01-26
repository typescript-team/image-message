const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                // 게시글
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                // 이미지 경로
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',     // 이모티콘 사용
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        // 게시물은 한 사용자에게 종속된다.
        db.Post.belongsTo(db.User);
        // 많은 게시물은 많은 헤시테그와 다대다 관계이다.
        // 중간 테이블 : PostHashtag
        //  foreignKey와 as를 안적는 이유는 헷갈리게 없기 때문
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    }
};
