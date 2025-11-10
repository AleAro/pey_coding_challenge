# Backend Infrastructure as Code

Infraestructura del backend definida con AWS CDK (TypeScript).

## Recursos creados

- **DynamoDB Table**: `NotesTable-CDK` con GSI para filtrar por sentiment
- **AppSync API**: GraphQL API con 4 resolvers
- **Resolvers**: createNote, getNotes, updateNote, deleteNote

## Comandos
```bash
# Instalar dependencias
npm install

# Compilar
npm run build

# Ver cambios
cdk diff

# Desplegar
cdk deploy

# Destruir
cdk destroy
```

## Requisitos

- AWS CLI configurado
- Node.js 18+
- AWS CDK CLI (`npm install -g aws-cdk`)