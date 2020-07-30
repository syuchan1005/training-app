# Training App

研修の一環で作ったWebアプリ

何も対策していないサイトと、少しは対策をしたサイトの2種類がある


## how to run
```terminal
$ npm install
$ npm run serve:server
$ npm run serve:client
```

> security: http://localhost:8080

> no security: http://localhost:8081

#### Docker
```terminal
$ docker build -t syuchan1005/training-app .
$ docker run -p <port>:80 syuchan1005/training-app
```

> security: http://\<dockerhost\>

> no security: http://\<dockerhost\>/pure

## admin account
username: test
password: test
