@echo off
REM Se placer à la racine du repo (un niveau au-dessus de scripts)
cd ..

REM Passe sur la branche main
git checkout main

REM Merge develop dans main
git merge develop

REM Push main
git push origin main

echo.
echo ✅ develop a été mergé dans main et pushé !
pause