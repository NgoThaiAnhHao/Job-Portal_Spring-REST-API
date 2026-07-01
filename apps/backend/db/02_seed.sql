-- user_types
INSERT INTO `user_types` (`user_type_id`, `user_type_role`)
    VALUES
        (1, 'JOB_SEEKER'),
        (2, 'RECRUITER'),
        (3, 'ADMIN');

-- users
INSERT INTO users (email, password, provider, provider_id, enabled, created_at, updated_at, user_type_id)
    VALUES
        ('admin@gmail.com','$2a$12$dUKgjfQteNLxLMDRnr13vedpJygXU6ZEEm1EU58Brhz89PI60PQ8K','LOCAL',NULL,TRUE,NOW(),NOW(),3),
        ('recruiter@gmail.com','$2a$12$dUKgjfQteNLxLMDRnr13vedpJygXU6ZEEm1EU58Brhz89PI60PQ8K','LOCAL',NULL,TRUE,NOW(),NOW(),2),
        ('jobseeker@gmail.com','$2a$12$dUKgjfQteNLxLMDRnr13vedpJygXU6ZEEm1EU58Brhz89PI60PQ8K','LOCAL',NULL,TRUE,NOW(),NOW(),1);

;