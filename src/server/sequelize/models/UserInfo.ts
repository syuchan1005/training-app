import { DataTypes, Model } from 'sequelize';
import argon2 from 'argon2';
import { Role } from './Role';

// eslint-disable-next-line import/prefer-default-export
export class UserInfo extends Model {
  public static readonly tableName = 'UserInfos';

  public readonly userId: number;

  public loginId: string;

  public userName: string;

  public telephone: string;

  public password?: string;

  public hash?: string;

  public roleId: number;

  public readonly role: Role;

  public readonly dataValues: Readonly<UserInfo>;

  public static initModel(sequelize) {
    UserInfo.init({
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loginId: {
        type: DataTypes.STRING({ length: 50 }),
        unique: true,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING({ length: 50 }),
        allowNull: false,
      },
      telephone: {
        type: DataTypes.STRING({ length: 50 }),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING({ length: 50 }),
      },
      hash: {
        type: DataTypes.STRING({ length: 100 }),
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: UserInfo.tableName,
      timestamps: false,
    });
  }

  public static associate() {
    UserInfo.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
  }

  public static async seed() {
    await UserInfo.findOrCreate({
      where: { loginId: 'test' },
      defaults: {
        loginId: 'test',
        userName: 'Test',
        telephone: '080xxxxxxxx',
        password: 'test',
        hash: await argon2.hash('test', {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          hashLength: 50,
        }),
        roleId: 1,
      },
    });
  }
}
