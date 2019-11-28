@ECHO OFF
ECHO ------------------------------------------
ECHO     Demarrage GEN
ECHO ------------------------------------------
ECHO ...
ECHO ------------------------------------------
ECHO     1/3 Suppression des fichiers TEMP
ECHO ------------------------------------------
del /Q c:\gen_tmp\*.*
ECHO ------------------------------------------
ECHO     2/3 Demarrage NGINX
ECHO ------------------------------------------
ECHO ...
cd /d C:\nginx-1.11.3
start nginx
ECHO ------------------------------------------
ECHO     3/3 Demarrage Meteor
ECHO ------------------------------------------
cd /d D:\gen
set ROOT_URL=http://marais.dev.com
call meteor --settings settings.json