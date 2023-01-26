const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            // init({컬럼 설정}, {테이블 정보})
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'naver', 'kakao', 'google'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,   // createdAt, updatedAt
            underscored: false, // true -> // created_at, updated_at
            modelName: 'User',
            tableName: 'users',
            paranoid: true,     // deletedAt 삭제 시간
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // 한 사용자는 여러개의 개시물을 가지고 있다.
        db.User.hasMany(db.Post);
        // 다대다 관계(belongsToMany)
        // 중간 테이블이 하나 생김(Follow)
        // 한 사용자(내가)가 여러 사용자를 팔로워 할 수 있다.
        // foreignKey와 as를 쓰는 이유는 User, User이기 때문에 헷갈림을 방지
        db.User.belongsToMany(db.User, {
            // 유명 연예인에 아이디를 찾아야지, 연애인의 팔로워들를 찾을 수 있다.
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        // 다대다 관계(belongsToMany)
        // 중간 테이블이 하나 생김(Follow)
        // 여러 사용자로 부터 내가 팔로윙 당할 수 있다.
        db.User.belongsToMany(db.User, {
            // 내 아이디를 찾아야지, 내가 팔로윙하는 아이디를 찾을 수 있다.
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
        db.User.hasMany(db.Juso);
    }
};