@echo off
REM Vigila solo HTML, JS y CSS para deploy automático
chokidar "*.html" "*.js" "*.css" -c "firebase deploy --only hosting" --ignore "node_modules/**" --ignore "tools/**" --ignore ".firebase/**" --initial
