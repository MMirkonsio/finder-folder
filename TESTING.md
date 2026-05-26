# Plan de Pruebas Pre-Producción — Hellema Holland ChatBot

Checklist completa para validar la app antes de empaquetar y distribuir. Cada caso especifica **acción**, **resultado esperado**, y dónde mirar para verificar (UI / logs).

> **Logs del servidor:** `%APPDATA%\Hellema Holland ChatBot\data\server.log`
> **DB del usuario:** `%APPDATA%\Hellema Holland ChatBot\data\dev.db`
> **Modelos AI cacheados:** `%APPDATA%\Hellema Holland ChatBot\models\`

---

## 1. Instalación y primer arranque

- [ ] **Instalación limpia desde NSIS** — instalar en máquina virgen (sin AppData previo). Esperado: app arranca, ventana visible, log `Base de datos copiada exitosamente`.
- [ ] **Reinstalación sobre versión previa** — actualizar de v0.0.10 → v0.0.11. Esperado: DB del usuario se conserva, índice intacto, `last_scan` no se pierde.
- [ ] **Desinstalación** — desinstalar desde Panel de Control. Verificar que AppData NO se borra (datos del usuario persisten para reinstalación).
- [ ] **Sin internet en el primer arranque** — apagar Wi-Fi y arrancar. Esperado: app abre, AI muestra warning en logs pero la búsqueda tradicional funciona, `autoUpdater` no crashea.
- [ ] **Sin acceso al NAS (VPN apagada)** — arrancar sin red. Esperado: app abre, scan reporta "ninguna ruta accesible", búsqueda en DB local sigue funcionando.
- [ ] **Doble lanzamiento** — abrir 2 veces el .exe. Esperado: segunda instancia cierra y la primera se enfoca al frente.

## 2. Configuración

- [ ] **Marcar 1 carpeta y guardar** — esperado: configuración persistente al reabrir el modal.
- [ ] **Marcar las 7 carpetas predefinidas y guardar** — esperado: las 7 quedan marcadas al reabrir.
- [ ] **Desmarcar todas y guardar** — esperado: el modal se reabre con todo desmarcado.
- [ ] **Guardar con NAS desconectado** — el banner debe mostrar `⚠️ X ruta(s) no accesible(s)`. El modal **no** se auto-cierra para que el usuario lea el warning.
- [ ] **Cambiar el orden de selección** — marcar/desmarcar en cualquier orden, guardar. La DB respeta el orden de los slots.
- [ ] **Cerrar app mid-guardado** — apenas al hacer click en "Guardar", forzar cierre. Reabrir: la config debe estar guardada (porque `saveConfig` es awaited antes del scan).
- [ ] **Cerrar modal con X durante save** — el guardado en backend se completa aunque la UI se cierre.

## 3. Sincronización

- [ ] **Primer scan completo** — con la DB vacía, sincronizar una carpeta. Esperado: ~30s a 5min según tamaño del NAS. Logs muestran "Snapshot DB cargado: 0".
- [ ] **Segundo scan sin cambios** — sincronizar dentro de los siguientes 5 min. Esperado: log muestra `Cache de directorios cargado: N` y el scan termina en **segundos** (fast path).
- [ ] **Scan tras agregar 1 archivo en el NAS** — agregar un PDF nuevo, sincronizar. Esperado: solo esa carpeta entra en slow path, el archivo se indexa, el resto se omite.
- [ ] **Scan tras borrar 1 archivo del NAS** — eliminar un archivo, sincronizar. Esperado: el contador "Archivos Indexados" baja en 1.
- [ ] **Scan tras renombrar carpeta** — renombrar `Bodega` → `Bodega 2026`. Esperado: archivos del path viejo se borran del índice, los del nuevo se indexan.
- [ ] **Scan con VPN que se cae a mitad** — cortar conexión durante un scan. Esperado: scan termina con errores en logs, pero los archivos del índice **NO se borran** (fix de safety por raíz).
- [ ] **Auto-scan cada 20 min** — dejar la app abierta. Esperado: log `[Auto-Scan] Disparando escaneo periódico...` cada 20 min.
- [ ] **Dos scans concurrentes** — clic en "Forzar Sincronización" dos veces seguido. Esperado: segundo intento responde `Ya hay un escaneo en progreso`.
- [ ] **Cancelar scan** — desde AdminPanel, durante scan, clic en "Cancelar Sincronización". Esperado en logs: `>>> /api/scan/cancel invocado` → `cancelRequested=true` → `Cancelado por el usuario`. En UI: status pasa a "Sincronización Cancelada" en 1-2 segundos.
- [ ] **Cancelar y reintentar** — cancelar un scan, esperar 5s, clic en sincronizar otra vez. Esperado: arranca un scan nuevo desde el punto donde quedó (cache de mtimes preservada).
- [ ] **Cancelar cuando no hay scan** — endpoint `/api/scan/cancel` con `isScanning=false`. Esperado: `{ success: false, message: 'No hay escaneo en progreso' }`.

## 4. Búsqueda

- [ ] **Búsqueda básica** — `contrato`. Esperado: resultados ordenados por relevancia.
- [ ] **Búsqueda vacía** — enviar sin texto. Esperado: nada pasa, no crashea.
- [ ] **Búsqueda con solo espacios** — `   `. Esperado: array vacío, no crashea.
- [ ] **Búsqueda con caracteres especiales** — `%`, `_`, `'`, `"`, `<script>`. Esperado: no rompe la DB, no inyecta SQL (queries parametrizadas).
- [ ] **Búsqueda con acentos** — `contrato administración`. Esperado: matchea archivos sin acentos (normalización con `makeAccentInsensitive`).
- [ ] **Búsqueda con typos** — `nicoolas` debe matchear `nicolas` (deduplicación de letras repetidas en `normalizeTypo`).
- [ ] **Búsqueda multi-palabra** — `cv mirko 2026`. Esperado: aplica lógica AND, requiere ≥75% de palabras.
- [ ] **Búsqueda con frase exacta** — `"informe anual"`. Esperado: matchea solo donde aparezca la frase completa.
- [ ] **Búsqueda con prefijo `usuario:`** — `usuario:gallardo`. Esperado: filtra por `owner_user`.
- [ ] **Búsqueda con número** — `ultimas 6 facturas` → limit=6. Esperado: solo 6 resultados.
- [ ] **Búsqueda con AI** — frase semántica como `documentos sobre vacaciones`. Esperado: encuentra archivos relacionados aunque no contengan esas palabras literales (usa embeddings).
- [ ] **Búsqueda que retorna >50 resultados** — esperado: banner "Encontré demasiados resultados" con los 50 más relevantes.
- [ ] **Búsqueda que retorna 0 resultados** — `xyz123abcfake`. Esperado: mensaje amigable "No encontré archivos...".
- [ ] **Búsqueda con servidor abajo** — matar `serverProcess` y buscar. Esperado: error "No se pudo conectar al servidor".
- [ ] **Búsqueda muy larga (200+ chars)** — no crashea, retorna 0 o pocos resultados.

## 5. Apertura y previsualización de archivos

- [ ] **Abrir archivo accesible** — clic en `FolderOpen`. Esperado: se abre el Explorador con el archivo seleccionado.
- [ ] **Abrir archivo borrado del NAS** — clic en archivo cuyo path ya no existe en disco. Esperado: error 404 del proxy, mensaje claro al usuario.
- [ ] **Previsualizar PDF** — clic en `Eye`. Esperado: PDF embebido se muestra.
- [ ] **Previsualizar imagen** (jpg/png) — esperado: imagen se muestra inline.
- [ ] **Intentar previsualizar Word/Excel** — el botón `Eye` no debe aparecer (solo pdf/jpg/jpeg/png).
- [ ] **Archivo con permisos restringidos** — buscar archivo en carpeta sin acceso. Esperado: banner "Resultado Restringido", `has_access=false`.

## 6. Casos extremos en el NAS

- [ ] **Carpeta con 10.000+ archivos directos** — scan no debe colapsar memoria.
- [ ] **Carpeta con nombres unicode** — `Niños`, `Año 2026`, emojis. Esperado: se indexan correctamente.
- [ ] **Path muy largo** (>200 chars) — Windows tiene límite de 260. Verificar que paths cercanos al límite se manejan.
- [ ] **Archivo con extensión NO permitida** (`.exe`, `.zip`) — esperado: se omite del índice.
- [ ] **Archivo `~$temporal.docx`** (Word lock file) — esperado: se omite (filtro `startsWith('~$')`).
- [ ] **Subcarpeta `.git`** o `node_modules` — esperado: se omite (filtro de directorios prohibidos).
- [ ] **NAS con archivos modificados en futuro** (clock skew) — `mtime > Date.now()`. Esperado: se indexan sin error.
- [ ] **DB con embeddings corruptos** — JSON inválido en columna `embedding`. Esperado: error capturado, archivo se vuelve a procesar.

## 7. Persistencia y recuperación

- [ ] **Cerrar app durante scan** — forzar quit. Reabrir: scan no completado se descarta, datos parciales en DB son consistentes.
- [ ] **Cerrar app, mover el NAS, reabrir** — DB local sigue accesible, búsqueda funciona pero "abrir archivo" falla (esperado).
- [ ] **Cambiar IP del NAS** — modificar las predefined paths y guardar. Esperado: los archivos del path viejo quedan huérfanos en DB hasta el próximo scan completo.
- [ ] **Borrar manualmente `dev.db`** — cerrar app, borrar el archivo, reabrir. Esperado: se copia desde `resources/dev.db` (template), índice queda vacío.
- [ ] **Servidor crashea durante scan** — kill -9 al fork. La app debería detectar y mostrar error de conexión. Reabrir Electron arranca un nuevo serverProcess.

## 8. Ventana, bandeja y burbuja

- [ ] **Minimizar a burbuja** — clic en `-`. Esperado: ventana se reduce a 80x80, mantiene posición central.
- [ ] **Arrastrar burbuja** — drag con pointer. Esperado: se mueve libremente sin "snap" del SO.
- [ ] **Restaurar desde burbuja** — clic. Esperado: vuelve al tamaño anterior, centrada en la última posición de la burbuja.
- [ ] **Burbuja fuera de pantalla** — arrastrar a una zona inválida. Restaurar: la ventana se reajusta dentro del work area de la pantalla activa.
- [ ] **Tray icon** — clic muestra/oculta ventana, clic derecho muestra menú "Mostrar/Cerrar".
- [ ] **Cerrar con X** — debería ocultar la ventana (no quit), salvo si se eligió "Cerrar" del tray.
- [ ] **Cerrar definitivamente desde tray** — "Cerrar" del menú contextual. Esperado: app y serverProcess terminan, no quedan procesos huérfanos en Task Manager.

## 9. Actualizaciones automáticas

- [ ] **Sin conexión a GitHub** — `autoUpdater.checkForUpdates()` falla. Esperado: warning en consola, app sigue normal (no crashea).
- [ ] **Actualización disponible** — publicar nueva versión en GitHub Releases. Esperado: banner "Nueva actualización descargada" aparece tras unos minutos.
- [ ] **Clic en "Reiniciar y Actualizar"** — esperado: app cierra, NSIS aplica el update, app reabre con la nueva versión.

## 10. Performance

- [ ] **Tiempo de arranque** — desde clic en icono hasta ventana visible. Objetivo: <5 segundos.
- [ ] **Tiempo de scan incremental** — con cache poblado, escanear 200k archivos sin cambios. Objetivo: <30 segundos.
- [ ] **Memoria RAM en reposo** — Task Manager. Objetivo: <500 MB.
- [ ] **Memoria RAM durante scan** — picos esperados al cargar embeddings. Objetivo: <1.5 GB para 200k archivos.
- [ ] **Búsqueda con 200k+ archivos indexados** — primera query semántica. Objetivo: <2 segundos.

## 11. Empaquetado

- [ ] **`npm run package`** completa sin errores. Output en `Releases_Generados/v0.0.11/`.
- [ ] **El instalador NSIS contiene** `template.db`, `prisma/generated/client/*.node`, `node_modules/sqlite3/build/`.
- [ ] **Tamaño del instalador** razonable (~150-250 MB). Si excede 500 MB, revisar qué se está incluyendo de más.
- [ ] **Instalar en máquina sin Node.js / sin Prisma** — todo embebido, no requiere dependencias externas.
- [ ] **Logs de empaquetado** muestran `Rebuilding native modules for Electron X.Y.Z` (gracias al `@electron/rebuild` en el script).

---

## Errores de usuario más probables

Estos son los errores que **van a ocurrir** en producción. Asegurar que cada uno tiene un mensaje claro al usuario:

| Escenario | Mensaje esperado |
|---|---|
| NAS desconectado al arrancar | "Ninguna ruta configurada existe" en logs + warning visible al guardar config |
| Search con server caído | "No se pudo conectar al servidor. Verifique su conexión de red o comuníquese con Soporte TI." |
| Archivo movido/borrado entre scans | Banner "Resultado Restringido" |
| Hace clic en cancelar 2 veces | Segundo clic queda deshabilitado o no hace nada (idempotente) |
| Guarda config con todas las rutas vacías | Al sincronizar: "No hay rutas configuradas" |
| Type wrong path manually | (No aplica — los paths son fixed checkboxes ahora) |
| Cierra modal mid-save | Save completa en backend de todos modos |
| Crea archivo `~$xyz.docx` (Word abre) | Se ignora (filtro) |

---

## Verificación final antes de release

- [ ] Versionar: subir `version` en `package.json` (`0.0.11` → `0.0.12`).
- [ ] Limpiar consola: `console.log` de debug no expone datos sensibles.
- [ ] Variables hardcodeadas revisadas (`API_URL`, paths del NAS).
- [ ] `template.db` actualizada con el schema final (correr `build_template_db.cjs` si es necesario).
- [ ] Tag de git y release en GitHub creados.
- [ ] Auto-update apuntando al release correcto en `package.json > build.publish`.
- [ ] Probar instalador en máquina virgen (VM Windows 10 fresca).
