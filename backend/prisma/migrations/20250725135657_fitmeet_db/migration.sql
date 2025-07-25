-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "deletedAt" DATE,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "typeId" UUID NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "criterion" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievements" (
    "id" UUID NOT NULL,
    "achievementId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "UserAchievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "typeId" UUID NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "image" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "private" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" UUID NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityAddresses" (
    "id" UUID NOT NULL,
    "activityId" UUID NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ActivityAddresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityParticipants" (
    "activityId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "approved" BOOLEAN DEFAULT false,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "ActivityParticipants_pkey" PRIMARY KEY ("activityId","userId")
);

-- CreateTable
CREATE TABLE "ActivityTypes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "ActivityTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_cpf_key" ON "Users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_name_key" ON "Achievements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievements_userId_achievementId_key" ON "UserAchievements"("userId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityAddresses_activityId_key" ON "ActivityAddresses"("activityId");

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ActivityTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievements" ADD CONSTRAINT "UserAchievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievements" ADD CONSTRAINT "UserAchievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ActivityTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAddresses" ADD CONSTRAINT "ActivityAddresses_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityParticipants" ADD CONSTRAINT "ActivityParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityParticipants" ADD CONSTRAINT "ActivityParticipants_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
