dev:
	bun run start:dev

g:
	bun prisma generate

db:
	bun prisma db push

std:
	bun prisma studio

seed:
	bun prisma db seed

format:
	bun format && bun lint
