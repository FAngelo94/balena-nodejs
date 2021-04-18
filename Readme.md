# Bazel-Compose with BalenaCLI-Nodejs-Mysql

Application run in a docker compose where user can interact with Balena CLI using a NodeJS application. Some action done by user are saved in the db.

## Command to run
To execute all docker run the following command in the main directory:
```sh
docker-compose up
```

## Scope of application

Exaple of application to understand ho create a docker-compose with Balena CLI, NodeJS and Mysql that interact each other.

## Architecture

I implemented the application using 3 docker that it is possible to run using docker-compose

### fangelo1994/ubuntu-nodejs-balenacli

Docker image I created and pushed in docker hub. Starting from Ubuntu docker image I installed inside NodeJS and Balena CLI

### mysql:8.0

Basic docker image where we have inside our db

### phpmyadmin/phpmyadmin

Basic docker image with inside phpmyadmin. We can use the phpmyadmin dashboard to interact with the mysql db

## Most Important Documentation Links read/used:
* https://www.npmjs.com/package/balena-cli
* https://github.com/balena-io/balena-cli/blob/master/INSTALL-LINUX.md
* https://github.com/balena-io/balena-cli/blob/master/INSTALL-ADVANCED.md#npm-installation 
* https://hub.docker.com/r/samibourouis/balena-cli
* https://hub.docker.com/r/balenalib/bananapi-m1-plus-alpine-node
* https://codeshack.io/basic-login-system-nodejs-express-mysql/
* https://www.scalyr.com/blog/create-docker-image/
