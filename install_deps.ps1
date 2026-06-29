Write-Host "开始安装依赖..."
Set-Location "C:\Users\Administrator\Desktop\performanceSystem"
npm install
Write-Host "安装完成，按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
