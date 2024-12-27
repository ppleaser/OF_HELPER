@echo off

:: Переход в директорию скрипта
cd /d %~dp0

:: Полный путь к output.html
set "OUTPUT_PATH=%~dp0templates\output.html"

:: Очищаем и записываем строку в update.bat с полным реальным путем
echo browser-sync start --proxy localhost:8765 --port 8444 --files "%OUTPUT_PATH%" > update.bat

echo Update.bat was updated!

:: Установка browser-sync
npm i -g browser-sync
pause
