# ChatWeb
A fully working chat app made with Angular 10, Node.js, Socket.io, MySQL and AWS S3.

It has direct and group messages, sound notifications, file upload, typing users and a lot more.

## Setup the project

To run the project in your local machine, you first need to setup some stuffs:

- angular-cli;
- node/npm;
- Create a bucket in S3 to allow file upload in the chat;
- In the `back_end/.env` file, you will have to set your database credentials.

## Running the project

After that, to run the front end, type `cd front_end && npm ci && ng serve`.

To run the backend, in project's directory, type `cd back_end && npm ci`.
After that, you will need to create a database in MySQL and put the same credentials in the .env file.
Database created, run `npm run migration` in the back_end folder to create the necessary tables.
All set, just run `npm run dev` and you're ready to go.
