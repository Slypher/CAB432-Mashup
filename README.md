# CAB432-Mashup
Cloud Computing - Assignment 1

# How to use
1. `git clone https://github.com/Slypher/CAB432-Mashup.git`
2. `docker build -t cab432-mashup .`
3. `docker run -p 8080:8080 -d cab432-mashup`

# Docker from command prompt
`@FOR /f "tokens=*" @%i IN ('docker-machine.exe env --shell default') DO @%i`

# Credits
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/