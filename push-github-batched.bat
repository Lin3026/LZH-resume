@echo off
chcp 65001 >nul
REM ============================================================
REM  Push LZH-resume-src in batches (fallback when single push
REM  fails with "Connection was reset" on large video files)
REM  Mixed port 7897 = HTTP + SOCKS both OK, git uses http://
REM  sslVerify off + 1GB postBuffer to survive proxy reset
REM ============================================================
cd /d D:\Users\github-deploy\LZH-resume-src

set PROXY=http://127.0.0.1:7897

echo [1/4] Set proxy %PROXY% ...
git config --global http.proxy %PROXY%
git config --global https.proxy %PROXY%
git config --global http.postBuffer 1048576000
git config --global http.sslVerify false
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

echo [2/4] Commits ahead of remote:
git log --oneline @{u}..HEAD

echo [3/4] Push cleanup commit first (305e56c) ...
git push origin 305e56c:main

echo [4/4] Push remaining (video commit) ...
git push

echo [cleanup] Unset proxy ...
git config --global --unset http.proxy
git config --global --unset https.proxy
git config --global --unset http.sslVerify

echo Done. Press any key to close.
pause >nul
