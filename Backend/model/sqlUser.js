export const createUserDataBase = `
     DO $$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'mydb'
   ) THEN
      PERFORM dblink_exec('dbname=postgres user=postgres password=yourpassword', 
                          'CREATE DATABASE mydb OWNER postgres');
   END IF;
END
$$;
`;

export const createTableUser = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_mf_active BOOLEAN NOT NULL DEFAULT false,
        two_factor_secret VARCHAR(100) NULL,
        two_factor_temp_secret VARCHAR(100) NULL,
        timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    
`;

// export const AlterUserDataBase = `
// ALTER TABLE users 
// ADD COLUMN IF NOT EXISTS twoFactorTempSecret VARCHAR(100);
// `;


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

export const updateQuery =` UPDATE users SET two_factor_secret = $1,is_mf_active = true  WHERE id=$2 RETURNING * `;

export const getTempFactorSecret = `SELECT  two_factor_temp_secret FROM users WHERE id= $1 `;

export const updateVerifiedQuery =` UPDATE users SET two_factor_secret = $1,  is_mf_active=true, two_factor_temp_secret=NULL 
 WHERE id=$2 `;

export const updateVerifyResetQuery =` UPDATE users SET two_factor_secret = NULL,  is_mf_active=false, two_factor_temp_secret=NULL 
 WHERE id=$1 `;