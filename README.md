# Hemoglobin AI Frontend

Next.js frontend for the Hemoglobin AI blood logistics platform.

## Features

- Public emergency blood request experience
- Requester, donor, hospital, courier, ledger, simulation, and control-room dashboards
- JWT login and registration at `/login`
- Shared text and voice dashboard AI assistant
- Browser speech-to-text and spoken AI responses
- Backend API client with server-side OpenAI, MongoDB, Pinecone, SMTP, and map integrations

## Local development

From this directory:

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Set `NEXT_PUBLIC_API_URL` in `.env.local` to the FastAPI URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MAP_PROVIDER=mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_public_mapbox_token
```

Only public browser-safe values may be placed in frontend environment files. Never add MongoDB, JWT, OpenAI, Pinecone, SMTP, or private map download tokens here.

## Production

```bash
npm run build
npm run start
```

The Dockerfile uses Next.js standalone output. Build it with:

```bash
docker build -t hemoglobin-ai-frontend .
docker run --env-file .env.local -p 3000:3000 hemoglobin-ai-frontend
```

The frontend expects the backend repository to be running separately.
