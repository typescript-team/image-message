export default {
  "development": {
    "username": "root",
    "password": "girl",
    "database": "test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "null",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "null",
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
} as const

// as const
// typescript는 변수들의 속성이 string | undefined 로
// sequelize 변수값으로 넣지 목하게 때문에, 이 모든 변수들이 string 타입이며
// 설정을 변경하지 않는다는 as const라는 명령을 붙임