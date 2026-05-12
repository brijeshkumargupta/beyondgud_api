@echo off
mkdir C:\data\db 2>nul
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath C:\data\db
