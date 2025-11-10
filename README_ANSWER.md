## Analytics

El notebook `analytics.ipynb` contiene visualizaciones de las notas:
- Histograma de cantidad de notas por día
- Gráfico circular de proporción de sentimientos

### Ejecutar Analytics
```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install boto3 pandas matplotlib seaborn jupyter notebook

# Configurar AWS CLI
aws configure

# Ejecutar notebook
jupyter notebook
```

## Infraestructura como Código

El backend está definido con AWS CDK en la carpeta `/backend`.

Ver [backend/README.md](backend/README.md) para más detalles.

---

## Entregables

-  **URL de producción**: https://main.d3btk2h9ntwif2.amplifyapp.com
-  **Repositorio**: https://github.com/AleAro/pey_coding_challenge
-  **Analytics Notebook**: `.ipynb_checkpoints/analytics.ipynb`
-  **Infraestructura CDK**: `/backend`

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: AWS AppSync (GraphQL), DynamoDB
- **Hosting**: AWS Amplify
- **IaC**: AWS CDK (TypeScript)
- **Analytics**: Python, Jupyter, Boto3, Pandas, Matplotlib