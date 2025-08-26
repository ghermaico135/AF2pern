export const createUserDataBase = `
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'mydb'
   ) THEN
      CREATE DATABASE mydb OWNER myuser;
   END IF;
END
$$;
`;

export const createTableUser = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isMfactive BOOLEAN NOT NULL DEFAULT false,
        twoFactorSecret VARCHAR(100),
        timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

export const getAllUsersQuery = `SELECT * FROM users`

export const createUserQuery = `
    INSERT INTO users(username,password) VALUES ($1,$2) RETURNING *;
`
export const loginUserQuery = `
    SELECT * FROM users WHERE username=$1 
`;

export const getSepecificUserQuery = `
    SELECT * FROM users WHERE id=$1
`;