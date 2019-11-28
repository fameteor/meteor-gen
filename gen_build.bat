@ECHO OFF
ECHO ------------------------------------------
ECHO     Lancement du BUILD
ECHO ------------------------------------------
ECHO ...
call meteor build --architecture=os.linux.x86_64 ./
ECHO ------------------------------------------
ECHO     BUILD fini (voir les erreurs) TERMINEE
ECHO ------------------------------------------