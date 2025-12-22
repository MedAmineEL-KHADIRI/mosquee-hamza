@echo off
REM Se placer à la racine du repo (un niveau au-dessus de scripts)
cd ..

REM Passe sur la branche develop
git checkout develop

REM Ajoute tous les fichiers modifiés
git add .

REM Commit avec un message par défaut
set /p commit_msg="Entrez un message de commit: "
git commit -m "%commit_msg%"

REM Push sur develop
git push origin develop

echo.
echo ✅ Tout a été pushé sur develop !
pause