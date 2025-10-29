# Restaurant Analytics Dashboard

Sistema de analytics para restaurantes construído com Next.js 15, TypeScript,
Prisma e shadcn/ui.

## Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Charts**: Recharts

## Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando (via Docker do projeto principal)
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Rodar desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## Estrutura do Projeto

```
restaurant-analytics/
├── app/              # Next.js App Router
│   ├── api/          # API Routes (backend)
│   └── dashboard/    # Dashboard pages
├── components/       # UI components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities
│   ├── db.ts        # Prisma client
│   └── queries/     # Database queries
├── prisma/
│   └── schema.prisma # Database schema
└── types/           # TypeScript types
```

## Features

- [ ] Dashboard overview
- [ ] Filtros por período, loja, canal
- [ ] Métricas principais (faturamento, ticket médio, etc)
- [ ] Gráficos interativos
- [ ] Análise de produtos
- [ ] Análise de clientes
- [ ] Performance por canal/loja

## Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Rodar produção
- `npm run prisma:generate` - Gerar Prisma Client
- `npm run prisma:studio` - Abrir Prisma Studio
