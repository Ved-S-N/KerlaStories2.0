/*
  Warnings:

  - You are about to drop the column `category` on the `Scheme` table. All the data in the column will be lost.
  - You are about to drop the column `eligibility` on the `Scheme` table. All the data in the column will be lost.
  - You are about to drop the column `maxIncome` on the `Scheme` table. All the data in the column will be lost.
  - You are about to drop the column `minIncome` on the `Scheme` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Scheme` table. All the data in the column will be lost.
  - Added the required column `name` to the `Scheme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Scheme` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Scheme] DROP COLUMN [category],
[eligibility],
[maxIncome],
[minIncome],
[title];
ALTER TABLE [dbo].[Scheme] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [Scheme_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[crop_type] NVARCHAR(1000) NOT NULL CONSTRAINT [Scheme_crop_type_df] DEFAULT 'all',
[deadline] NVARCHAR(1000) NOT NULL CONSTRAINT [Scheme_deadline_df] DEFAULT 'ongoing',
[income_limit] INT,
[name] NVARCHAR(1000) NOT NULL,
[region] NVARCHAR(1000) NOT NULL CONSTRAINT [Scheme_region_df] DEFAULT 'all',
[updatedAt] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
