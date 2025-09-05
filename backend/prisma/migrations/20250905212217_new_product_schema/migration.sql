/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ratings` on the `Product` table. All the data in the column will be lost.
  - Added the required column `delivery` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Product] ALTER COLUMN [image] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Product] DROP COLUMN [name],
[price],
[ratings];
ALTER TABLE [dbo].[Product] ADD [delivery] NVARCHAR(1000) NOT NULL,
[discount] NVARCHAR(1000) NOT NULL,
[discountPrice] INT NOT NULL,
[inStock] BIT NOT NULL CONSTRAINT [Product_inStock_df] DEFAULT 1,
[location] NVARCHAR(1000) NOT NULL,
[originalPrice] INT NOT NULL,
[rating] FLOAT(53) NOT NULL,
[seller] NVARCHAR(1000) NOT NULL,
[title] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
