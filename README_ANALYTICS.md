## Analytics Notebook

### Requisitos
- Python 3.x
- AWS CLI configurado con credenciales

### Instalación
```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install boto3 pandas matplotlib seaborn jupyter notebook
```

### Configurar AWS
```bash
aws configure
```

Ingresa tus credenciales de AWS con permisos de lectura a DynamoDB.


AWS Access Key ID [****************F7QM]: 
AWS Secret Access Key [****************qrAa]: 

### Ejecutar
```bash
jupyter notebook
```

Abre `analytics.ipynb` y ejecuta todas las celdas.