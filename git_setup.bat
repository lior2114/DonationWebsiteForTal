@echo off
cd /d "E:\python\works\05 -  פרוייקטים אישים\אתר תרומות לטל\אתר תרומות טל הגרסה הנוכחית"
echo Current directory: %CD%
echo.
echo Initializing git repository...
git init
echo.
echo Adding all files...
git add .
echo.
echo Committing files...
git commit -m "Initial commit - Donation website for Tal"
echo.
echo Adding remote repository...
git remote add origin https://github.com/lior2114/DonationWebsiteForTal.git
echo.
echo Pushing to GitHub...
git push -u origin master
echo.
echo Done!
pause
