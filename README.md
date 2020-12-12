# Omada Calendar Server

An Express server designed specifically for the Omada Calendar client using a MySQL RDS instance hosted by Cal State San Marcos. Some basic CREATE statements are provided, but some indexes were not included in this file. Unfortunately, these indexes are the only pieces of the project not documented.

The server structure follows a fairly standard structure based on our research. The flow is as follows:
index.js =>
routes.js =>
./controllers =>
./services =>
./db =>
Handle any thrown errors in ./utils/errors.js middleware that is called from controllers

All data retrieved from the database is then bubbled up to the controller and sent out to the client. For the most part we tried to stick to REST standards to make it as unopinionated as possible.

Check out the client at https://omada-calendar.netlify.app/login

## Development

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

### Commit conventions

Just to organize commits, we could just use the "feat", "fix", "chore" convention from this [guide](https://www.conventionalcommits.org/en/v1.0.0/).
