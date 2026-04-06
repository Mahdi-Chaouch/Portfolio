<#
.SYNOPSIS
Updates the local demineur jar with the latest upstream code.

.DESCRIPTION
Clones the Demineur repository, compiles sources with UTF-8, rebuilds a jar
with the correct Main-Class, replaces assets/demineur.jar, and cleans temp files.
#>

param(
    [string]$RepoUrl = "https://github.com/Mahdi-Chaouch/Demineur",
    [string]$Branch  = "main"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$tempRoot = Join-Path $repoRoot "temp_extract\\demineur_auto"

function Cleanup {
    param($path)
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Cleanup $tempRoot
New-Item -ItemType Directory -Path $tempRoot | Out-Null

try {
    $cloneDir = Join-Path $tempRoot "repo"
    git clone --depth 1 --branch $Branch $RepoUrl $cloneDir | Write-Output

    $javaSources = Get-ChildItem -Path $cloneDir -Recurse -Filter "*.java"
    if (-not $javaSources) {
        throw "No Java sources found under $cloneDir."
    }

    $launcher = $javaSources | Where-Object { $_.Name -eq "LanceurGraphique.java" } | Select-Object -First 1
    if (-not $launcher) {
        throw "LanceurGraphique.java not found; cannot determine main class."
    }
    $pkgMatch = Select-String -Path $launcher.FullName -Pattern '^\s*package\s+([A-Za-z0-9_.]+)\s*;' | Select-Object -First 1
    $packageName = if ($pkgMatch) { $pkgMatch.Matches[0].Groups[1].Value } else { "" }
    $mainClass = if ($packageName) { "$packageName.LanceurGraphique" } else { "LanceurGraphique" }

    $classesDir = Join-Path $tempRoot "classes"
    New-Item -ItemType Directory -Path $classesDir | Out-Null

    $javac = Get-Command javac -ErrorAction SilentlyContinue
    if (-not $javac) {
        throw "javac not found; install a JDK and ensure javac is in PATH."
    }
    & $javac -encoding UTF-8 -d $classesDir @($javaSources.FullName)

    $manifest = Join-Path $tempRoot "manifest.txt"
    "Main-Class: $mainClass`n" | Set-Content -Encoding ASCII $manifest

    $jarExe = Get-Command jar -ErrorAction SilentlyContinue
    if (-not $jarExe) {
        throw "jar tool not found; ensure JDK bin is in PATH."
    }
    $jarPath = Join-Path $repoRoot "assets\\demineur.jar"
    & $jarExe cfm $jarPath $manifest -C $classesDir . | Write-Output

    $htmlPath = Join-Path $repoRoot "demineur.html"
    if (Test-Path $htmlPath) {
        $pattern = 'cheerpjRunMain\("[^"]+",\s*"/app/assets/demineur\.jar"\)'
        $replacement = "cheerpjRunMain(`"$mainClass`", `"/app/assets/demineur.jar`")"
        $content = Get-Content $htmlPath -Raw
        $newContent = [regex]::Replace($content, $pattern, $replacement)
        Set-Content -Encoding UTF8 $htmlPath $newContent
        Write-Output "Updated cheerpj main to $mainClass in demineur.html"
    }

    Push-Location $cloneDir
    try {
        $commit = (git rev-parse HEAD).Trim()
        Write-Output "Updated demineur.jar to commit $commit"
    } finally {
        Pop-Location
    }
}
finally {
    Cleanup $tempRoot
}
