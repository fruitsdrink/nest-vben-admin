import { PrismaClient } from '@prisma/client';
import { seedUser } from './seed/sys-user.seed';
import chalk from 'chalk';
import consola from 'consola';

const prisma = new PrismaClient();

async function main() {
  consola.log(chalk.blue('=== 开始Seed数据 ===\n'));
  await seedUser(prisma);
  consola.log(chalk.blue('\n=== 结束Seed数据 ==='));
}

main()
  .then(async () => {
    consola.log(chalk.green('!!! Seed数据成功 !!!'));
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    consola.log(chalk.red('Seed数据发生错误：'));
    consola.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
