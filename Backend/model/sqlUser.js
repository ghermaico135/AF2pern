
export const createEmployeeTableUser = `
    CREATE TABLE user (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(50) NOT NULL,
        isMfactive BOOLEAN NOT NULL,
        twoFactorSecret VARCHAR(100),
        timeStamp TIMESTAMP
    )
`