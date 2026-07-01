
-- user_types
CREATE TABLE user_types (
    user_type_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type_role ENUM('ADMIN', 'RECRUITER', 'JOB_SEEKER') NOT NULL UNIQUE
);

-- users
CREATE TABLE users (
   user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255),
   provider ENUM('LOCAL', 'GOOGLE') NOT NULL,
   provider_id VARCHAR(255),
   enabled BOOLEAN NOT NULL DEFAULT FALSE,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
       ON UPDATE CURRENT_TIMESTAMP,
   user_type_id INT NOT NULL,

   CONSTRAINT fk_user_type
       FOREIGN KEY (user_type_id)
           REFERENCES user_types(user_type_id)
           ON DELETE RESTRICT
           ON UPDATE CASCADE
);

-- refresh_token
CREATE TABLE refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    expired_at DATETIME,
    user_id BIGINT UNIQUE,

    CONSTRAINT fk_refresh_user
       FOREIGN KEY (user_id)
           REFERENCES users(user_id)
           ON DELETE CASCADE
);

-- verification_token
CREATE TABLE verification_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    expired_at DATETIME,
    user_id BIGINT UNIQUE,

    CONSTRAINT fk_verification_user
        FOREIGN KEY (user_id)
            REFERENCES users(user_id)
            ON DELETE CASCADE
);