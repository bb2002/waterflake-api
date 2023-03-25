export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || '',
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT, 10) || 3306,
    USER: process.env.DB_USER || 'root',
    NAME: process.env.DB_NAME || 'waterflake',
    PASS: process.env.DB_PASS || '',
  },
  CLOUDFLARE: {
    TOKEN: process.env.CLOUDFLARE_TOKEN || '',
  },
});
