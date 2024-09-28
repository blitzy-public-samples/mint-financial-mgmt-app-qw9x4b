import { Pool, PoolConfig } from 'pg';

// Assuming AppConfig structure
interface AppConfig {
  database: {
    postgresql: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
  };
}

export interface PostgresqlConfig {
  pool: Pool;
  connectionString: string;
}

export const DEFAULT_POOL_SIZE = 20;
export const DEFAULT_IDLE_TIMEOUT = 10000; // 10 seconds

export function createPostgresqlConfig(config: AppConfig): PostgresqlConfig {
  const { host, port, username, password, database } = config.database.postgresql;

  const connectionString = `postgresql://${username}:${password}@${host}:${port}/${database}`;

  const poolConfig: PoolConfig = {
    connectionString,
    max: DEFAULT_POOL_SIZE,
    idleTimeoutMillis: DEFAULT_IDLE_TIMEOUT,
  };

  const pool = new Pool(poolConfig);

  return {
    pool,
    connectionString,
  };
}

// Export a function that creates the configuration instead of a static object
// This allows for easier testing and configuration changes
export const getPostgresqlConfig = (appConfig: AppConfig) => createPostgresqlConfig(appConfig);

// Human tasks:
// TODO: Review and adjust default pool size and idle timeout values based on expected application load
// TODO: Ensure that sensitive database credentials are properly secured and not exposed in the code
// TODO: Implement proper error handling for database connection failures