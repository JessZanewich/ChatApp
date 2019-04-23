// Reqs for a basic server
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// import * as bcrypt from 'bcrypt-nodejs'; //! Don't need this yet
// import * as knex from 'knex'; //! Don't need this yet

// import * as jsonfile from 'jsonfile';

async function main() {
    // Configure the express server
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    
    // Hook up the routes to the controllers
    app.get('/', (req, res) => {
        res.json('Hello this page exists now.');
    });

    
}

main();
console.log('HULLO');