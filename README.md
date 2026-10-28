# SafeApp (SafeSchool) - Sistema de Prevención de Violencia Escolar

MVP1 desarrollado para el curso de Diseño de Productos y Servicios. Consiste en una aplicación web/móvil para estudiantes (reporte anónimo y botón de pánico) y un panel de gestión para profesores/psicólogos (SafeAdmin).

## 🛠️ Tecnologías Utilizadas
*   **Frontend:** React, Vite, Tailwind CSS.
*   **Backend:** Python, FastAPI, Uvicorn.
*   **Base de Datos:** Supabase (PostgreSQL).
*   **Inteligencia Artificial:** Scikit-Learn (Modelo `modelo_riesgo.pkl`).

## 🏗️ Arquitectura de Software (4 Capas)
Para cumplir con el diseño del proyecto, el código se organiza siguiendo los principios de la arquitectura de 4 capas:
1.  **Presentación:** Carpetas `frontend/src/paginas` y `frontend/src/componentes` (Interfaces de usuario).
2.  **Aplicación (Casos de uso):** Rutas y controladores en `backend/main.py` (Endpoints `/api/...`).
3.  **Dominio (Reglas de negocio):** Lógica de clasificación de riesgo (función `evaluar_riesgo`), generación de códigos (ej. `SCH-XXXXX`) y validación de estados.
4.  **Infraestructura y Datos:** Conexión a Supabase en `backend/main.py` y almacenamiento de evidencias en la carpeta `backend/uploads`.

## 🚀 Instrucciones de Ejecución

1. Backend (Python)
Abre una terminal en la carpeta `backend`:
```bash
# Crear y activar entorno virtual
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python -m uvicorn main:app --reload

El backend correrá en http://127.0.0.1:8000

2. Frontend (React)
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

La app correrá en http://localhost:5173

🧪 Casos de Prueba (Tabla 43)
El sistema incluye los siguientes escenarios de prueba validados durante la Iteración 1:

ESC-1 (Flujo principal): Reporte anónimo de ciberacoso en el patio. Genera código SS-XXXX y guarda la imagen sin metadatos.

ESC-2 (Urgencia): Agresión física en baños. La IA lo clasifica como prioridad ALTA y notifica al panel del profesor en menos de 10s.

ESC-3 (Seguimiento): Consulta con el código, actualización de estado a "EN ATENCIÓN" y "CUMPLIDO".

ESC-4 (Validaciones): Bloqueo de archivos no permitidos y validación de códigos inexistentes.

📝 Iteración y Mejoras (Tabla 49)
Iteración 0: Diseño de paleta de colores accesible (WCAG) y triaje por IA.

Iteración 1: Rediseño del chat con sistema de "Salas" (sala_id) para separar las conversaciones de los alumnos y evitar mezclas de información. Implementación de validación de archivos.


### Paso 2: Crear la carpeta de Pruebas
Para que el profesor vea los "datos de prueba", crea una carpeta en la raíz del proyecto llamada `tests`. Dentro de ella, crea un archivo llamado `pruebas_escenarios.md` y pega lo siguiente:

```markdown
# Escenarios de Prueba del MVP1

## ESC-1: Reporte Anónimo Completo
*   **Datos:** Tipo: Ciberacoso. Zona: Patio principal. Urgencia: Media.
*   **Resultado Esperado:** Se genera código único, se guarda la captura sin metadatos y no se solicita DNI.

## ESC-2: Reporte Urgente
*   **Datos:** Tipo: Agresión física. Zona: Baños 2do piso. Urgencia: Alta.
*   **Resultado Esperado:** El panel del profesor prioriza la alerta en primer lugar y emite un aviso sonoro.

## ESC-3: Seguimiento por Código
*   **Datos:** Código generado en ESC-1.
*   **Resultado Esperado:** El estado cambia de "RECIBIDA" a "EN ATENCIÓN" y "CUMPLIDO" reflejándose en la vista del alumno.

## ESC-4: Casos de Error
*   **Datos:** Archivos `.exe` o envío de texto vacío.
*   **Resultado Esperado:** El sistema bloquea la acción y muestra un mensaje de validación claro.