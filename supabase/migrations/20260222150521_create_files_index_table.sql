/*
  # Sistema de Índice de Archivos para Búsqueda Local

  1. Nueva Tabla
    - `files_index`
      - `id` (uuid, primary key) - Identificador único del archivo
      - `file_name` (text) - Nombre del archivo
      - `file_path` (text) - Ruta completa del archivo en el servidor
      - `file_size` (bigint) - Tamaño del archivo en bytes
      - `file_type` (text) - Extensión o tipo del archivo
      - `owner_user` (text) - Usuario propietario del archivo
      - `last_modified` (timestamptz) - Última modificación del archivo
      - `created_at` (timestamptz) - Fecha de creación del registro
      - `updated_at` (timestamptz) - Fecha de actualización del registro
    
    - `server_config`
      - `id` (uuid, primary key) - Identificador único
      - `server_url` (text) - URL del servidor local
      - `last_scan` (timestamptz) - Última vez que se escaneó el servidor
      - `total_files` (integer) - Total de archivos indexados
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de actualización

  2. Índices
    - Índice en `file_name` para búsquedas rápidas por nombre
    - Índice en `owner_user` para búsquedas rápidas por usuario
    - Índice en `file_type` para filtros por tipo
    - Índice GIN para búsqueda full-text en file_name y file_path

  3. Seguridad
    - Enable RLS en ambas tablas
    - Políticas para lectura pública (servidor local)
    - Políticas para escritura por servicio
*/

-- Crear tabla de índice de archivos
CREATE TABLE IF NOT EXISTS files_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_size bigint DEFAULT 0,
  file_type text DEFAULT '',
  owner_user text DEFAULT '',
  last_modified timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de configuración del servidor
CREATE TABLE IF NOT EXISTS server_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_url text NOT NULL,
  last_scan timestamptz,
  total_files integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear índices para búsquedas optimizadas
CREATE INDEX IF NOT EXISTS idx_files_file_name ON files_index USING btree (file_name);
CREATE INDEX IF NOT EXISTS idx_files_owner_user ON files_index USING btree (owner_user);
CREATE INDEX IF NOT EXISTS idx_files_file_type ON files_index USING btree (file_type);
CREATE INDEX IF NOT EXISTS idx_files_last_modified ON files_index USING btree (last_modified DESC);

-- Crear índice para búsqueda full-text
CREATE INDEX IF NOT EXISTS idx_files_search ON files_index USING gin (
  to_tsvector('spanish', coalesce(file_name, '') || ' ' || coalesce(file_path, '') || ' ' || coalesce(owner_user, ''))
);

-- Habilitar RLS
ALTER TABLE files_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_config ENABLE ROW LEVEL SECURITY;

-- Políticas para files_index (lectura pública, escritura restringida)
CREATE POLICY "Permitir lectura pública de archivos"
  ON files_index FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir inserción con service role"
  ON files_index FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Permitir actualización con service role"
  ON files_index FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir eliminación con service role"
  ON files_index FOR DELETE
  TO service_role
  USING (true);

-- Políticas para server_config
CREATE POLICY "Permitir lectura pública de configuración"
  ON server_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir escritura con service role en configuración"
  ON server_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para files_index
DROP TRIGGER IF EXISTS update_files_index_updated_at ON files_index;
CREATE TRIGGER update_files_index_updated_at
  BEFORE UPDATE ON files_index
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para server_config
DROP TRIGGER IF EXISTS update_server_config_updated_at ON server_config;
CREATE TRIGGER update_server_config_updated_at
  BEFORE UPDATE ON server_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();