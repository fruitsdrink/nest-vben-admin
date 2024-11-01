import { hash } from '../../libs/common/src/utils/bcrypt';
import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';
import consola from 'consola';

export const seedUser = async (prisma: PrismaClient) => {
  try {
    consola.log(chalk.blue('=== 开始Seed User数据 ==='));
    const user = await prisma.sysUser.findFirst({
      where: {
        username: 'admin',
        deletedAt: 0,
      },
    });
    if (!user) {
      await prisma.sysUser.create({
        data: {
          username: 'admin',
          password: hash('admin123'),
          nickName: 'admin',
          realName: 'admin',
          pinyin: 'admin',
          sex: 1,
          status: 1,
          isVerify: 1,
          isChangedPwd: 1,
          registerSource: 'SYSTEM',
          isAdmin: 1,
        },
      });
    }
    consola.log(chalk.blue('=== 结束Seed User数据 ==='));
  } catch (error) {
    consola.log(chalk.blue('Seed User数据发生错误：'));
    consola.error(error);
  }
};
