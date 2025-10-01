# Git setup script for Donation Website for Tal
Set-Location "E:\python\works\05 -  פרוייקטים אישים\אתר תרומות לטל\אתר תרומות טל הגרסה הנוכחית"

Write-Host "Current directory: $(Get-Location)"
Write-Host ""

Write-Host "Initializing git repository..."
git init

Write-Host ""
Write-Host "Adding all files..."
git add .

Write-Host ""
Write-Host "Committing files..."
git commit -m "Initial commit - Donation website for Tal"

Write-Host ""
Write-Host "Adding remote repository..."
git remote add origin https://github.com/lior2114/DonationWebsiteForTal.git

Write-Host ""
Write-Host "Pushing to GitHub..."
git push -u origin master

Write-Host ""
Write-Host "Done!"
