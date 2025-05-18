@echo off
REM Set environment variables
set PGPASSWORD=123456789
set BACKUP_DIR=C:\TUKIB_Backups
set PG_PATH="C:\Program Files\PostgreSQL\17\bin"

REM Get date in YYYYMMDD format without slashes
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do set FILENAME=backup_%%c%%a%%b.sql

REM Create the backup
%PG_PATH%\pg_dump.exe -U tukib -h localhost -p 5432 -F c -f "%BACKUP_DIR%\%FILENAME%" tukib_db

REM Optional: Log result
echo Backup created: %FILENAME% >> "%BACKUP_DIR%\backup_log.txt"


@REM Add this to C:\TUKIB_Backups