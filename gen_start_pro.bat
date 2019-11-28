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
cd c:\nginx-1.11.3
start nginx
ECHO ------------------------------------------
ECHO     3/3 Demarrage Meteor
ECHO ------------------------------------------
cd c:\meteor\gen
set ROOT_URL=http://localhost:4000
call meteor --settings settings.json