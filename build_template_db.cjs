const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const backupEnvPath = path.join(__dirname, '.env.backup');
const dbPath = path.join(__dirname, 'template.db');

try {
  // Solo respaldar .env si existe
  if (fs.existsSync(envPath)) {
    fs.renameSync(envPath, backupEnvPath);
  }

  // Crear entorno temporal apuntando a template.db
  fs.writeFileSync(envPath, `DATABASE_URL="file:./template.db"\n`);

  // Asegurarnos que la bd no exista arrastrando datos viejos
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // Ejecutar prisma push para crear el esquema en la base de datos limpia
  console.log('Generando esquema en template.db...');
  execSync(`npx prisma db push`, { stdio: 'inherit' });
  console.log('template.db generada con éxito!');

} catch (error) {
  console.error('Error generando DB:', error);
} finally {
  // Limpiar el env temporal
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
  // Restaurar el real
  if (fs.existsSync(backupEnvPath)) {
    fs.renameSync(backupEnvPath, envPath);
  }
}
