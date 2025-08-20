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