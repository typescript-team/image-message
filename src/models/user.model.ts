import Post from './post.model';
import Sequelize, { BelongsToManyAddAssociationMixin, CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

// Sequelize에 Typescript 적용하기 ( Sequelize < 6.14.0 )
// Model에 들어가는 attributes 타입을 직접 설정하여, 제네릭 방식으로 지정해주어야 한다.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {

  // 타입스크립트는 속성 정의만으로 타입추론을 하지 못한다.
  // declare를 사용해서 속성들의 타입추론을 돕는다.
  // declare는 변수 선언시 초기값을 넣지 않고, 단지 타입만 설정하기 위해 사용
  // declare는 자바스크립트로 바뀌지 않고, 타입스크립트의 타입을 위해서만 사용

  // declare 키워드를 사용하면, model의 attribute의 타입 정보를
  // public class field를 추가하지 않고 선언할 수 있다.
  // Typescript가 컴파일 한 파일에서 보면 declare로 선언된 field는
  // class 내에서 public field로 선언되어 있지 않다.
  // 즉, declare는 typescript에서 타입을 지정해주기 위해서 사용된다.

  // CreationOptional
  // User를 만들 때는, email, nick만 필요하다. 나머지 변수는 사용 안함
  // SNS 로그인인 겨우, passowrd는 없음
  // 사용안하는 변수는 ?을 붙이는 대신에 CreationOptional 타입을 사용한다.

  declare id: CreationOptional<number>;
  declare email: string;
  declare nick: string;
  declare password: CreationOptional<string>;
  declare provider: CreationOptional<string>;
  declare snsId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  // javascript(sequelize)가 만들어 주는 함수인 경우
  // 타입 추론이 안되서 타입을 설정해 주어야 한다.
  declare addFollowing: BelongsToManyAddAssociationMixin<User, number>

  static initiate(sequelize: Sequelize.Sequelize) {
    User.init({
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING(40), allowNull: true, unique: true },
      nick: { type: Sequelize.STRING(15) },
      password: { type: Sequelize.STRING(100), allowNull: true },
      provider: { type: Sequelize.ENUM('local', 'naver', 'kakao', 'google'), allowNull: false, defaultValue: 'local' },
      snsId: { type: Sequelize.STRING(30) },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }

  static associate() {
    // ECMNAScript 모듈 시스템에서는 CommonJS에서 발생되는 순환참조를 사용하지 못하기 때문에
    // db매개변수에 모두 저장해서 사용한 것을 사용하지 못한다. ( db.User )
    User.hasMany(Post);
    User.belongsToMany(User, {
      foreignKey: 'followingId',
      as: 'Followers',
      through: 'Follow'
    });
    User.belongsToMany(User, {
      foreignKey: 'followerId',
      as: 'Followings',
      through: 'Follow'
    });
  }
};

export default User;