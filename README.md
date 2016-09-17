# CAB432-Mashup
This mashup was made for the Cloud Computing unit

## How to use
1. `git clone https://github.com/Slypher/CAB432-Mashup.git`
2. `docker build -t cab432-mashup .`
3. `docker run -p 3000:3000 cab432-mashup`

## Helpful Commands
- `docker-machine rm default`
- `docker-machine create default --driver virtualbox`
- `docker rm -f $(docker ps -a -q)`
- `@FOR /f "tokens=*" %i IN ('docker-machine.exe env --shell cmd') DO @%i`

## auth.json Format

    {
        "igdb" : {
            "endpoint" : "https://igdbcom-internet-game-database-v1.p.mashape.com/",
            "key": {
                "testing": "key_here",
                "production": "key_here"
            }
        },

        "giantbomb": {
            "endpoint": "http://www.giantbomb.com/api/",
            "key": "key_here"
        },

        "steamweb": {
            "endpoint": "http://api.steampowered.com/",
            "key": "key_here"
        }
    }

# Credits
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/


http://www.giantbomb.com/api  
http://www.igdb.com/api  
https://steamcommunity.com/dev  


http://getbootstrap.com/  
http://fontawesome.io/