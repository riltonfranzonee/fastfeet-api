
<h1 align="center">
    <img src="https://user-images.githubusercontent.com/58868651/75586094-56e6b600-5a52-11ea-9817-eff23d71134e.png" />
</h1>

<p align="center">
Full control system for a shipping company - RESTful API made with Node.js
</p>

🚚 About FastFeet
------------------
This project is a full control system of a fictional shipping company called FastFeet. The full system has a [**web version**](https://github.com/riltonfranzonee/fastfeet) made with ReactJS, where the admin is able to take control of all processes, from listing deliveries to handle with delivery problems and change deliverymen's info. The application also has a [**mobile version**](https://github.com/riltonfranzonee/fastfeet-mobile) made with React Native, where the deliveryman is able to list all his deliveries filtering by pending or delivered, register a problem during the process and also confirm the deliver by sending a picture of the recipient's signature. All this system is served by a [**RESTful API**](https://github.com/riltonfranzonee/fastfeet-api) made with Node.js 

:wrench: Used technologies:
----------------------
This RESTful API has a great level of complexity, combinig different types of databases, user authentication, email firing, file upload and a lot of CRUD's. To help me with all this work I used the following technologies: 

- [**Insomnia**](https://insomnia.rest/)
- [**NodeJS**](https://nodejs.org/en/)
- [**ExpressJS**](https://expressjs.com/)
- [**Nodemon**](https://nodemon.io/)
- [**Docker**](https://www.docker.com/)
- [**PostgreSQL**](https://www.postgresql.org/)
- [**Redis**](https://redis.io/)
- [**Sequelize**](https://sequelize.org/)
- [**Yup**](https://github.com/jquense/yup)
- [**jwt**](https://www.npmjs.com/package/jsonwebtoken/)
- [**bcryptJS**](https://www.npmjs.com/package/bcryptjs)
- [**multer**](https://github.com/expressjs/multer)
- [**date-fns**](https://date-fns.org/docs/Getting-Started)

## :information_source: How to use this project
To clone and run this application, you'll need Git, NodeJS, Yarn and Docker.

The first thing you need to do is to run these two containers on your machine:

- `docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine`;
- `docker run --name some-postgres -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres`;

Then you just need to run the following commands:

```bash
# Clone this repository
$ git clone https://github.com/riltonfranzonee/fastfeet-api

# Go into the repository
$ cd fastfeet-api

# Install dependencies
$ yarn

# Run the app
$ yarn dev
```

After that you can use [*Insomnia REST Client*](https://insomnia.rest/) on *port 3000" to use the routes!


:speech_balloon: Reach me
----------

[*In case you want to reach me*](https://www.linkedin.com/in/rilton-franzone-b975a7198/)



Thank you for taking a look at my project! Made with ♥
