BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'participant',
    [isEmailVerified] BIT NOT NULL CONSTRAINT [User_isEmailVerified_df] DEFAULT 0,
    [verificationToken] NVARCHAR(1000),
    [resetToken] NVARCHAR(1000),
    [resetTokenExpiry] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [ratings] INT NOT NULL,
    [reviews] INT NOT NULL,
    [price] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Scheme] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [minIncome] INT,
    [maxIncome] INT,
    [eligibility] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Scheme_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserSchemeEligibility] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [schemeId] INT NOT NULL,
    [eligible] BIT NOT NULL,
    CONSTRAINT [UserSchemeEligibility_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Deal] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [discount] INT NOT NULL,
    [validTill] DATETIME2 NOT NULL,
    CONSTRAINT [Deal_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChatSession] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [language] NVARCHAR(1000) NOT NULL,
    [startedAt] DATETIME2 NOT NULL CONSTRAINT [ChatSession_startedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ChatSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LegalRequest] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LegalRequest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [LegalRequest_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LawFirm] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LawFirm_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LegalAssignment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [legalRequestId] INT NOT NULL,
    [lawFirmId] INT NOT NULL,
    [assignedAt] DATETIME2 NOT NULL CONSTRAINT [LegalAssignment_assignedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [LegalAssignment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[News] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [region] NVARCHAR(1000) NOT NULL,
    [publishedAt] DATETIME2 NOT NULL,
    CONSTRAINT [News_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Alert] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [title] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    [alertType] NVARCHAR(1000) NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [Alert_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    [region] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Alert_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserSchemeEligibility] ADD CONSTRAINT [UserSchemeEligibility_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserSchemeEligibility] ADD CONSTRAINT [UserSchemeEligibility_schemeId_fkey] FOREIGN KEY ([schemeId]) REFERENCES [dbo].[Scheme]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Deal] ADD CONSTRAINT [Deal_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChatSession] ADD CONSTRAINT [ChatSession_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LegalRequest] ADD CONSTRAINT [LegalRequest_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LegalAssignment] ADD CONSTRAINT [LegalAssignment_legalRequestId_fkey] FOREIGN KEY ([legalRequestId]) REFERENCES [dbo].[LegalRequest]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LegalAssignment] ADD CONSTRAINT [LegalAssignment_lawFirmId_fkey] FOREIGN KEY ([lawFirmId]) REFERENCES [dbo].[LawFirm]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Alert] ADD CONSTRAINT [Alert_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
