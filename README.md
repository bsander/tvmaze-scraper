# TVMaze scraper and API

- Has a single queue for performing requests serially with simple retry functionality
- Joi validation on input boundary to conform to TS definition
- Containerized solution

## Get started:

Make sure Docker is installed and running:

- `docker`: https://docs.docker.com/install/
- `docker-compose`: https://docs.docker.com/compose/install/

```sh
# Launch database and webservice
docker-compose up --build -d

# Initialize database
docker-compose run db psql -U postgres -h db < db.sql

# Start scraper
docker-compose run server yarn run scrape

# Watch what happens on the server and db
docker-compose logs -f

# Check out some results (pagination is performed by changing the final digit)
open http://localhost:12000/shows/1

# End it all
docker-compose down
```

It is also possible to run everything without docker, see `package.json` for the
relevant commands. A compatible postgresql setup on the user's machine is still
required and the `DB_*` environment variables need to be adjusted appropriately.

## Some considerations for improvement

- Add unit and integration tests
- Retry/queue error handling is crude. Deal with different statusCodes (500,404), timeouts, etc
- Separate api and scraper in containers, with distinct roles and restrictions
  in DB (reader vs writer)
- Separation of types between TVMaze, DB and API response. There's a lot of
  overlap but currently this is mostly implicit.
- Streamline DB inserts, create indices, optimize query plan
