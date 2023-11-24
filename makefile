dev:
	pnpm run start:dev

db:
	pnpm prisma db push

std:
	pnpm prisma studio

seed:
	pnpm prisma db seed

format:
	pnpm format && pnpm lint
