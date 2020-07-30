import { DataTypes, Model } from 'sequelize';
import { UserInfo } from './UserInfo';

// eslint-disable-next-line import/prefer-default-export
export class UserToken extends Model {
  public static readonly tableName = 'UserTokens';

  public readonly id: number;

  public token: string;

  public userId: number;

  public readonly user: UserInfo;

  public static initModel(sequelize) {
    UserToken.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: UserToken.tableName,
      timestamps: false,
    });
  }

  public static associate() {
    UserToken.belongsTo(UserInfo, { foreignKey: 'userId', as: 'user' });
  }
}
