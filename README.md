# CAB432-Mashup
Cloud Computing - Assignment 1

## How to use
1. `git clone https://github.com/Slypher/CAB432-Mashup.git`
2. `docker build -t cab432-mashup .`
3. `docker run -p 3000:3000 cab432-mashup`

## Helpful Commands
- `docker-machine rm default`
- `docker-machine create default --driver virtualbox`
- `@FOR /f "tokens=*" %i IN ('docker-machine.exe env --shell cmd') DO @%i`
- `docker rm -f $(docker ps -a -q)`

# Credits
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/