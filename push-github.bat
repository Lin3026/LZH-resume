@echo off
chcp 65001 >nul
REM ============================================================
REM  Push LZH-resume-src to GitHub (normal push)
REM  Mixed port 7897 = HTTP + SOCKS both OK, git uses http://
REM  sslVerify off + 1GB postBuffer to survive proxy reset on big packs
REM  Auto-retry up to 3 times on disconnect
REM ============================================================
cd /d D:\Users\github-deploy\LZH-resume-src

set PROXY=http://127.0.0.1:7897
set MAX_TRY=3

echo [1/3] Set proxy %PROXY% ...
git config --global http.proxy %PROXY%
git config --global https.proxy %PROXY%
git config --global http.postBuffer 1048576000
git config --global http.sslVerify false
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

echo [2/3] Pushing (retry up to %MAX_TRY% times on disconnect) ...
set /a n=1
:retry
git push
if %errorlevel%==0 (
  goto success
)
set /a n+=1
if %n% leq %MAX_TRY% (
  echo [retry] push failed, retrying %n%/%MAX_TRY% ...
  timeout /t 2 >nul
  goto retry
)
echo [fail] push failed after %MAX_TRY% tries.
goto cleanup

:success
echo [ok] push succeeded.

:cleanup
echo [3/3] Unset proxy ...
git config --global --unset http.proxy
git config --global --unset https.proxy
git config --global --unset http.sslVerify

echo Done. Press any key to close.
pause >nul
