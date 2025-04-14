-- CreateTable
CREATE TABLE `sys_user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `login_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `salt` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `realname` VARCHAR(191) NULL,
    `gender` TINYINT NOT NULL DEFAULT 0,
    `birthday` INTEGER NULL,
    `user_type` TINYINT NOT NULL DEFAULT 0,
    `avatar` VARCHAR(191) NULL,
    `login_ip` VARCHAR(191) NULL,
    `login_at` INTEGER NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `remark` VARCHAR(500) NOT NULL DEFAULT '',
    `created_at` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,
    `deleted_at` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `sys_user_login_name_key`(`login_name`),
    UNIQUE INDEX `sys_user_email_key`(`email`),
    UNIQUE INDEX `sys_user_phone_key`(`phone`),
    INDEX `sys_user_user_id_login_name_phone_email_idx`(`user_id`, `login_name`, `phone`, `email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,
    `expires_at` INTEGER NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `re_expires_at` INTEGER NOT NULL,

    UNIQUE INDEX `sys_user_token_access_token_key`(`access_token`),
    UNIQUE INDEX `sys_user_token_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membership` (
    `member_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL,
    `start_date` INTEGER NOT NULL,
    `end_date` INTEGER NOT NULL,
    `total_chars` INTEGER NOT NULL,
    `used_chars` INTEGER NOT NULL DEFAULT 0,
    `total_remaining` INTEGER NOT NULL DEFAULT 0,
    `order_id` VARCHAR(191) NULL,
    `created_at` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,

    INDEX `membership_user_id_type_idx`(`user_id`, `type`),
    INDEX `membership_end_date_idx`(`end_date`),
    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_voice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `gender` TINYINT NOT NULL,
    `locale` VARCHAR(20) NOT NULL,
    `shortName` VARCHAR(255) NOT NULL,
    `sample_rate_hertz` INTEGER NULL,
    `voiceType` VARCHAR(20) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `words_per_minute` INTEGER NULL,

    UNIQUE INDEX `tts_voice_shortName_key`(`shortName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_voice_style` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `style` VARCHAR(150) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `tts_voice_style_style_key`(`style`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_voice_style_relation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voiceId` INTEGER NOT NULL,
    `style` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_voice_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `sort_order` INTEGER NULL,
    `status` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_work` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `voice_name` VARCHAR(191) NOT NULL,
    `editor_state` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `audio_url` VARCHAR(191) NOT NULL,
    `duration` DOUBLE NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `version` INTEGER NOT NULL DEFAULT 1,
    `created_at` INTEGER NOT NULL,
    `deleted_at` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_sample` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voice_name` VARCHAR(191) NOT NULL,
    `voice_style` VARCHAR(191) NOT NULL DEFAULT '',
    `content` TEXT NOT NULL,
    `ssml` TEXT NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `audio_url` VARCHAR(191) NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `created_at` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `remark` VARCHAR(255) NULL,
    `created_at` INTEGER NOT NULL,
    `createdId` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,

    UNIQUE INDEX `sys_dict_type_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(100) NOT NULL,
    `value` VARCHAR(100) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `sort_order` INTEGER NULL,
    `remark` VARCHAR(255) NULL,
    `created_at` INTEGER NOT NULL,
    `createdId` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_order` (
    `id` VARCHAR(191) NOT NULL,
    `order_no` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `payment_type` ENUM('WECHAT', 'ALIPAY') NOT NULL,
    `pay_time` INTEGER NULL,
    `transaction_id` VARCHAR(191) NULL,
    `product_type` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NULL,
    `created_at` INTEGER NOT NULL,
    `updated_at` INTEGER NOT NULL,
    `expires_at` INTEGER NULL,
    `notify_data` TEXT NULL,
    `code_url` VARCHAR(255) NULL,
    `qrcode_code_url` TEXT NULL,

    UNIQUE INDEX `payment_order_order_no_key`(`order_no`),
    INDEX `payment_order_user_id_status_idx`(`user_id`, `status`),
    INDEX `payment_order_order_no_idx`(`order_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tts_usage_log` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `work_id` INTEGER NULL,
    `voice_name` VARCHAR(191) NOT NULL,
    `voice_style` VARCHAR(191) NOT NULL DEFAULT '',
    `sample_id` INTEGER NULL,
    `ssml` TEXT NOT NULL,
    `chars_used` INTEGER NOT NULL,
    `chars_left` INTEGER NOT NULL,
    `total_used` INTEGER NOT NULL DEFAULT 0,
    `created_at` INTEGER NOT NULL,

    INDEX `tts_usage_log_user_id_idx`(`user_id`),
    INDEX `tts_usage_log_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `membership` ADD CONSTRAINT `membership_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tts_usage_log` ADD CONSTRAINT `tts_usage_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `sys_user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tts_usage_log` ADD CONSTRAINT `tts_usage_log_work_id_fkey` FOREIGN KEY (`work_id`) REFERENCES `tts_work`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tts_usage_log` ADD CONSTRAINT `tts_usage_log_sample_id_fkey` FOREIGN KEY (`sample_id`) REFERENCES `tts_sample`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
