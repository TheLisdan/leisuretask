-- This is an empty migration.
UPDATE "User" SET "email" = concat(name, '@example.com') WHERE "email" IS NULL;