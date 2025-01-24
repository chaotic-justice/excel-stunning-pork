# [Excel Peachy](https://lichess.org)

playing chess at cliffside park

**More features are in development, aiming to complete the full development of the starter this year.**

## Features

- [x] user oauth (google) authentication and api authorization using jose jwt token
- [x] api to upload documents to r2 bucket
- [x] a list of workers
  - [x] a submission form to create a new worker
  - [x] details page to view a worker
- [x] CF serverless backend to interact with D1 db and to serve /upload endpoint
- [ ] sync analyzer python api to fetch documents from r2 bucket, parse them and analyze them
  - [ ] write reports to the `reports` table
  - [ ] display data from the reports table on details page

## TODO

- [ ] migrate analyzer code from local jupyter notebook to fastapi repo
- [ ] ship fastapi repo to DO via dokku
  - [x] give up on fastapi postgres despite its ease for i'm not familiar in working with DB in python