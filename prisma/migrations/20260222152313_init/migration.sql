-- CreateTable
CREATE TABLE "FileRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "owner_user" TEXT,
    "last_modified" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServerConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "server_url" TEXT NOT NULL,
    "last_scan" DATETIME,
    "total_files" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FileRecord_file_path_key" ON "FileRecord"("file_path");

-- CreateIndex
CREATE INDEX "FileRecord_file_name_idx" ON "FileRecord"("file_name");

-- CreateIndex
CREATE INDEX "FileRecord_owner_user_idx" ON "FileRecord"("owner_user");

-- CreateIndex
CREATE INDEX "FileRecord_file_type_idx" ON "FileRecord"("file_type");
