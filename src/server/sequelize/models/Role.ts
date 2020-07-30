import { DataTypes, Model } from 'sequelize';

// eslint-disable-next-line import/prefer-default-export
export class Role extends Model {
  public static readonly tableName = 'Roles';

  public readonly roleId: number;

  public readonly roleName: string;

  public readonly isAdmin: boolean;

  public static initModel(sequelize) {
    Role.init({
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roleName: {
        type: DataTypes.STRING({ length: 50 }),
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: Role.tableName,
      timestamps: false,
    });
  }

  public static async seed(sequelize) {
    await sequelize.transaction(async (transaction) => {
      await Role.findOrCreate({
        where: { roleName: '管理者' },
        defaults: { roleName: '管理者', isAdmin: true },
        transaction,
      });
      await Role.findOrCreate({
        where: { roleName: '一般' },
        defaults: { roleName: '一般', isAdmin: false },
        transaction,
      });
    });
  }
}
