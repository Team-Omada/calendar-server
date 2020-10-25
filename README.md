# server

Our entry point for the server is index.js. Since this has a database connection now, you need a .env file! This way we don't expose the school's RDS credentials to everyone on Github. Just place the .env file that has the proper variables in the root of the project! Source control won't include it when you commit.

## Project setup

```
npm install
```

### Runs server in dev mode with hot-reload

```
npm run dev
```

### Runs without hot-reload

```
npm run start
```

### Testing database queries

To connect to the database and write some queries, download [MySQLWorkbench](https://dev.mysql.com/downloads/workbench/) and enter the info on CC. Depending on the default settings you may need to go to the SSL tab and set the "Use SSL" option to "No". Otherwise you may get an error.

### VSCode Extensions

I would recommend downloading the ESLint and Prettier extensions to keep coding styles consistent!

### Commit conventions

Just to organize our commits a bit, we could just use the "feat", "fix", "chore" convention from this [guide](https://www.conventionalcommits.org/en/v1.0.0/).
