-- CreateTable
CREATE TABLE `sys_department` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pinyin` VARCHAR(191) NULL,
    `leader` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `remark` VARCHAR(191) NULL,
    `sort_no` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(191) NULL,
    `deleted_at` BIGINT NOT NULL DEFAULT 0,
    `deleted_by` VARCHAR(191) NULL,
    `parent_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_department` ADD CONSTRAINT `sys_department_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `sys_department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
