# SRS module

## How to run
`docker build .`
`docker exec -it srs-api node ace migration:run`
`docker-compose up`


## How to debug
# On VSCode add this to your launch.json config file, it will attach your already running docker container
 ```
 {
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach to Node",
      "remoteRoot": "/usr/app"
    }
  ]
}
```
