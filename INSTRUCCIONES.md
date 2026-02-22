# Sistema de Búsqueda de Archivos - Chatbot Local

Sistema optimizado para buscar archivos en un servidor de red compartida local con capacidad para +600,000 archivos.

## Características

- Búsqueda ultra rápida mediante índices en base de datos Supabase
- Interfaz de chat intuitiva
- Búsqueda por nombre de archivo o usuario
- Previsualización de archivos (imágenes, videos, audio, PDFs)
- Botones para abrir archivos directamente
- Panel de administración para sincronización
- Sistema optimizado con procesamiento por lotes

## Requisitos Previos

1. Node.js instalado en tu servidor
2. Acceso a tu servidor de archivos de red compartida

## Configuración Inicial

### 1. Configurar el Servidor de Archivos

1. Abre la aplicación en tu navegador
2. Haz clic en el ícono de configuración (⚙️) en la esquina superior derecha
3. Ingresa la URL base de tu servidor de archivos local (ejemplo: `http://192.168.1.100:8000`)
4. Guarda la configuración

### 2. Sincronizar Archivos

Hay dos métodos para sincronizar tus archivos:

#### Método A: Script Automático (Recomendado)

1. Abre el Panel de Administración (ícono de base de datos 🗄️ en la esquina inferior derecha)
2. Haz clic en "Mostrar script"
3. Copia el script completo
4. Guárdalo en tu servidor como \`scan-files.js\`
5. Modifica la variable \`ROOT_PATH\` con la ruta de tu carpeta compartida:
   \`\`\`javascript
   const ROOT_PATH = '/ruta/a/tus/archivos/compartidos';
   \`\`\`
6. Ejecuta el script:
   \`\`\`bash
   node scan-files.js
   \`\`\`

El script escaneará todos los archivos y los sincronizará automáticamente.

#### Método B: Archivo JSON Manual

1. Crea un archivo JSON con el siguiente formato:
   \`\`\`json
   [
     {
       "file_name": "documento.pdf",
       "file_path": "/carpeta/documento.pdf",
       "file_size": 1024000,
       "file_type": "pdf",
       "owner_user": "Juan Perez",
       "last_modified": "2024-01-15T10:30:00Z"
     }
   ]
   \`\`\`
2. Abre el Panel de Administración
3. Sube el archivo JSON usando el botón "Sincronizar Archivos"

## Uso del Chatbot

### Búsqueda por Nombre de Archivo

Simplemente escribe el nombre del archivo o parte de él:
- \`documento.pdf\`
- \`reporte 2024\`
- \`imagen\`

### Búsqueda por Usuario

Usa el prefijo "usuario:" seguido del nombre:
- \`usuario: Juan\`
- \`usuario: Maria Lopez\`

### Acciones Disponibles

Para cada archivo encontrado, puedes:

1. **Previsualizar**: Abre una vista previa del archivo
   - Imágenes: Muestra la imagen en pantalla completa
   - Videos: Reproduce el video con controles
   - Audio: Reproduce el audio con controles
   - PDF: Abre el PDF en una nueva pestaña

2. **Abrir**: Abre el archivo directamente desde el servidor

3. **Copiar Ruta**: Haz clic en la ruta del archivo para copiarla al portapapeles

## Optimización para 600,000+ Archivos

El sistema está optimizado mediante:

1. **Índices de Base de Datos**: Búsquedas en milisegundos
2. **Procesamiento por Lotes**: El script procesa archivos en lotes de 1,000
3. **Búsqueda Full-Text**: Índice GIN para búsquedas avanzadas
4. **Límite de Resultados**: Muestra máximo 50 archivos por búsqueda

## Sincronización Programada

Para mantener el índice actualizado, puedes programar el script:

### En Linux/Mac (usando cron):

\`\`\`bash
# Ejecutar cada noche a las 2 AM
0 2 * * * /usr/bin/node /ruta/a/scan-files.js
\`\`\`

### En Windows (usando Task Scheduler):

1. Abre el Programador de Tareas
2. Crea una nueva tarea
3. Configura el disparador (ejemplo: diariamente a las 2 AM)
4. Configura la acción: ejecutar \`node.exe\` con argumento \`C:\\ruta\\a\\scan-files.js\`

## Solución de Problemas

### No se encuentran archivos

1. Verifica que hayas sincronizado los archivos primero
2. Comprueba que la URL del servidor esté configurada correctamente
3. Revisa el Panel de Administración para ver cuántos archivos están indexados

### Error al abrir archivos

1. Verifica que la URL del servidor sea accesible desde tu navegador
2. Asegúrate de que el servidor de archivos esté ejecutándose
3. Comprueba que las rutas de los archivos sean correctas

### Sincronización lenta

Es normal con +600,000 archivos. El script muestra el progreso por lotes.
Primera sincronización puede tomar varios minutos.

## Estructura de la Base de Datos

### Tabla: files_index

- \`file_name\`: Nombre del archivo
- \`file_path\`: Ruta completa (única)
- \`file_size\`: Tamaño en bytes
- \`file_type\`: Extensión del archivo
- \`owner_user\`: Usuario propietario
- \`last_modified\`: Fecha de última modificación

### Índices Optimizados

- Índice en \`file_name\`
- Índice en \`owner_user\`
- Índice en \`file_type\`
- Índice Full-Text Search (GIN)

## Soporte

Para cualquier problema o pregunta, revisa:
1. La configuración del servidor
2. Los logs del script de sincronización
3. El Panel de Administración para estadísticas
