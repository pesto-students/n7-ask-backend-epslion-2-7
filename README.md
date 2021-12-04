# Ask

Postman collection link
-> https://www.getpostman.com/collections/7a35883b187ec74f5a7a

# Ask

Ask is An application where users have a centralized platform where they can ask queries on any topic. The goal of our application is to find out an expert for your queries in that specific subject. Questions are directed towards experts in that field. When knowledge is put into Ask, it is there forever to be shared with anyone in the future who is interested.

<br/>

# Table of Content

1. [Demo](#demo)
2. [Installation](#installation)
3. [Technology Stack](#technology-stack)
4. [Authors](#authors)
5. [License](#license)

<br/>

# Demo

[Live Demo](http://n7-eplison.s3-website.ap-south-1.amazonaws.com/)

<br/>

Please Note:

1. We recommend using this app in Google Chrome
2. Use the app on Laptop/desktop only as of now.
3. We are using JWT for authentication.

<br/>
Test Credentials:

For User

- Email: adit@gmail.com
- Password: 12345qwert@

<br/>

# Installation

- Fork or directly clone this repository to your local machine
- Make sure [Serverless](https://www.serverless.com/framework/docs/getting-started) is installed in your system
- Use the `npm` command to install dependencies
- Locate serverless.yml file and check all the function name for the next step. Make sure you have dummy request object which can be found in data.json, replace request object with dummy data.
- For payload reference check this [Api-Document](https://go.postman.co/workspace/My-Workspace~32d66cca-ddd9-4314-88c9-a44796f696f0/collection/9042497-505643eb-da78-4657-befe-d5df6690c338)
- Use the `serverless invoke local --function <lambda funtion name>` to locally run the application
- Database connection is live on AWS.

<br/>

# Technology Stack

We have used Serverless framework for application and database. Serverless architectures offer greater scalability, more flexibility, and quicker time to release. For storing objects we have used AWS S3 for media files and for web hosting.

- [Serverless](https://www.serverless.com/)
- [AWS](https://aws.amazon.com/)
  - [AWS Serverless](https://aws.amazon.com/serverless/)
  - [AWS MYSQL](https://aws.amazon.com/rds/mysql/)
  - [AWS S3](https://aws.amazon.com/s3/)
- [Sequelize](https://sequelize.org/)

<br/>

# Authors

- [Nikhil Kumar](https://github.com/nk900600)

<br/>

# License

[MIT](https://opensource.org/licenses/MIT)
