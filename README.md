# CAB432-Mashup
Cloud Computing - Assignment 1

# How to use
1. `git clone https://github.com/Slypher/CAB432-Mashup.git`
2. `docker build -t cab432-mashup .`
3. `docker run -p 8080:8080 cab432-mashup`

# Helpful Commands
docker from command prompt - `@FOR /f "tokens=*" %i IN ('docker-machine.exe env --shell cmd') DO @%i`
docker stop all containers - `docker stop $(docker ps -a -q)`
docker remove all containers - `docker rm $(docker ps -a -q)`

# Credits
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/