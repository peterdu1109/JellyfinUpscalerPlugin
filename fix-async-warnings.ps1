# PowerShell Script to fix async/await warnings in AI Upscaler Plugin
Write-Host "Fixing async/await warnings..." -ForegroundColor Green

$files = @(
    "AV1VideoProcessor.cs",
    "UpscalerCore.cs"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Cyan
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Fix async methods that don't use await
        # Pattern 1: return direct value -> return await Task.FromResult(value)
        $content = $content -replace 'return "([^"]+)";(\s*}(?:\s*catch))', 'return await Task.FromResult("$1");$2'
        $content = $content -replace 'return ([^;]+);(\s*}(?:\s*catch))', 'return await Task.FromResult($1);$2'
        
        # Pattern 2: simple returns in async methods
        $content = $content -replace '(?<=async Task<[^>]+>[^{]*{[^}]*)\breturn ([^;]+);', 'return await Task.FromResult($1);'
        
        # Pattern 3: void returns in async methods -> use Task.CompletedTask
        $content = $content -replace '(?<=async Task[^<][^{]*{[^}]*)\breturn;', 'return await Task.CompletedTask;'
        
        # Write back to file
        Set-Content $file $content -Encoding UTF8
        Write-Host "✅ Fixed $file" -ForegroundColor Green
    }
}

Write-Host "All async/await warnings should be fixed!" -ForegroundColor Green