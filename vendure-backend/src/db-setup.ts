import { DataSource, DataSourceOptions } from 'typeorm';


export const dbSeeded = async (dbConfig: DataSourceOptions): Promise<boolean> => {
  console.log('Checking if database has been seeded...');
  try {
    const dataSource = new DataSource(dbConfig);

    await dataSource.initialize();

    const queryRunner = dataSource.createQueryRunner();

    // Check if the database has been seeded by looking for the superadmin user
    // that gets created during initial seeding
    const superadminExists = await queryRunner.manager.query(`
      SELECT COUNT(*) as count FROM administrator
      WHERE identifier = $1
    `, [process.env.SUPERADMIN_USERNAME || 'superadmin']);

    await queryRunner.release();
    await dataSource.destroy();

    const isSeeded = parseInt(superadminExists[0].count) > 0;
    console.log('Database seeded:', isSeeded);

    return isSeeded;
  } catch (error) {
    console.error('Error checking if database has been seeded:', error);
    return false;
  }
};

export interface DbConnectionOptions {
  type: "oracle" | "postgres";
  synchronize: boolean;
  migrations: string[] | string;
  logging: boolean;
  database: string | undefined;
  schema: string | undefined;
  host: string | undefined;
  port: number | undefined;
  username: string | undefined;
  password: string | undefined;
}
