@ECHO OFF
ECHO ------------------------------------------
ECHO     Mongorestore derniere version
ECHO ------------------------------------------
ECHO ...
call c:/mongodb/bin/mongorestore -h 127.0.0.1:3001 -d meteor c:/data/mongo/initial
ECHO ------------------------------------------
ECHO     MongoRestore TERMINE
ECHO ------------------------------------------