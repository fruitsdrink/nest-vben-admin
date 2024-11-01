-- CreateTable
CREATE TABLE `sys_user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nick_name` VARCHAR(191) NULL,
    `real_name` VARCHAR(191) NULL,
    `pinyin` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `sex` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `remark` VARCHAR(191) NULL,
    `sort_no` INTEGER NOT NULL DEFAULT 0,
    `open_id` VARCHAR(191) NULL,
    `union_id` VARCHAR(191) NULL,
    `refresh_token` VARCHAR(191) NULL,
    `is_changed_pwd` INTEGER NOT NULL DEFAULT 0,
    `register_source` ENUM('USER', 'SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    `is_verify` INTEGER NOT NULL DEFAULT 0,
    `is_admin` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` BIGINT NOT NULL DEFAULT 0,
    `deleted_by` VARCHAR(191) NULL,

    UNIQUE INDEX `sys_user_username_deleted_at_key`(`username`, `deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_settings` (
    `id` VARCHAR(191) NOT NULL,
    `key` ENUM('REGISTER_ENABLED', 'REGISTER_VERIFY') NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `sys_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
