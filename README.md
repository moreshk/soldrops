# Soldrops

## how to run project locally

### cloning repo

```cmd
git clone
cd repo
```

### running docker

```cmd
cd docker && docker compose up
```

### Running Frontend server

`ask for local env variables`

```cmd
bun run db:generate
bun run db:migrate
bun run dev
```

Open <http://localhost:3000> in your browser
