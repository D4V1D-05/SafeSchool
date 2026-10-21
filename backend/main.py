from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime
from typing import List
import random, string, shutil, os, joblib
from supabase import create_client, Client

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- CONEXIÓN A SUPABASE ---
SUPABASE_URL = "https://uknomspqtfmpzpxjxlqs.supabase.co" 
SUPABASE_KEY = "sb_publishable_OVIXSpHSMLOlykM-r-GPDg_4onlzMF3"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
supabase_activo = True

try:
    supabase.table("alertas").select("id").limit(1).execute()
    print("✅ Conexión a Supabase exitosa")
except Exception as e:
    print(f"⚠️ Red bloqueó Supabase ({e}). Usando memoria local de respaldo.")
    supabase_activo = False

# --- CARGAR IA ---
try:
    modelo_ia = joblib.load("modelo_riesgo.pkl")
    print("✅ Modelo de IA cargado correctamente")
except Exception as e:
    modelo_ia = None
    print("⚠️ No se encontró el modelo de IA.")

# --- BASES DE DATOS LOCALES (Respaldo por si falla el internet) ---
alertas_db = []
denuncias_db = []
mensajes_db = []

# --- MODELOS ---
class Alerta(BaseModel):
    ubicacion: str
    descripcion: str = ""

class EstadoUpdate(BaseModel):
    nuevo_estado: str

class MensajeChat(BaseModel):
    sala_id: str
    remitente: str
    texto: str

def evaluar_riesgo(texto):
    if not texto or not modelo_ia: return "Alto"
    try: return modelo_ia.predict([texto])[0]
    except: return "Alto"

# ==========================================
# RUTAS DE ALERTAS
# ==========================================
@app.post("/api/alertas")
def crear_alerta(alerta: Alerta):
    nivel = evaluar_riesgo(alerta.descripcion)
    nueva_alerta = {
        "id": len(alertas_db) + 1,
        "ubicacion": alerta.ubicacion,
        "descripcion": alerta.descripcion,
        "nivel_riesgo": nivel,
        "fecha_hora": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "estado": "Pendiente"
    }
    
    if supabase_activo:
        try:
            # Intentamos guardar en la nube (quitamos el ID para que Supabase lo genere solo)
            data_nube = {k:v for k,v in nueva_alerta.items() if k != 'id'}
            supabase.table("alertas").insert(data_nube).execute()
        except:
            pass # Si falla, igual se guarda en memoria local abajo

    alertas_db.append(nueva_alerta)
    return {"mensaje": "Alerta enviada", "data": nueva_alerta}

@app.get("/api/alertas")
def obtener_alertas():
    if supabase_activo:
        try:
            respuesta = supabase.table("alertas").select("*").order("id", desc=True).execute()
            if respuesta.data: return respuesta.data
        except:
            pass
    return alertas_db[::-1] # Retorna las locales

# ==========================================
# RUTAS DE DENUNCIAS
# ==========================================
@app.post("/api/denuncias")
async def crear_denuncia(descripcion: str = Form(...), archivos: List[UploadFile] = File(None)):
    codigo = "SCH-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    nivel = evaluar_riesgo(descripcion)
    
    nombres_archivos = []
    if archivos:
        for archivo in archivos:
            if archivo.filename:
                ruta_archivo = f"uploads/{codigo}_{archivo.filename}"
                with open(ruta_archivo, "wb") as buffer:
                    shutil.copyfileobj(archivo.file, buffer)
                nombres_archivos.append(f"{codigo}_{archivo.filename}")

    nueva_denuncia = {
        "codigo_reporte": codigo,
        "descripcion": descripcion,
        "archivos_adjuntos": nombres_archivos,
        "nivel_riesgo": nivel,
        "fecha_hora": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "estado": "RECIBIDA"
    }
    
    if supabase_activo:
        try: supabase.table("denuncias").insert(nueva_denuncia).execute()
        except: pass
        
    denuncias_db.append(nueva_denuncia)
    return {"mensaje": "Denuncia registrada", "codigo": codigo}

@app.get("/api/denuncias/{codigo}")
def consultar_denuncia(codigo: str):
    if supabase_activo:
        try:
            respuesta = supabase.table("denuncias").select("codigo_reporte, fecha_hora, estado").eq("codigo_reporte", codigo).execute()
            if len(respuesta.data) > 0: return respuesta.data[0]
        except: pass
        
    for d in denuncias_db:
        if d["codigo_reporte"] == codigo:
            return {"codigo_reporte": d["codigo_reporte"], "fecha_hora": d["fecha_hora"], "estado": d["estado"]}
    return {"error": "Código no encontrado"}

@app.get("/api/denuncias")
def obtener_todas_denuncias():
    prioridad = {"Alto": 1, "Medio": 2, "Bajo": 3}
    datos = []
    
    if supabase_activo:
        try:
            respuesta = supabase.table("denuncias").select("*").execute()
            if respuesta.data: datos = respuesta.data
        except: pass
        
    if not datos: datos = denuncias_db
    return sorted(datos, key=lambda x: prioridad.get(x.get("nivel_riesgo", "Bajo"), 4))

@app.put("/api/denuncias/{codigo}/estado")
def actualizar_estado(codigo: str, datos: EstadoUpdate):
    if supabase_activo:
        try: supabase.table("denuncias").update({"estado": datos.nuevo_estado}).eq("codigo_reporte", codigo).execute()
        except: pass
        
    for d in denuncias_db:
        if d["codigo_reporte"] == codigo: d["estado"] = datos.nuevo_estado
    return {"mensaje": "Estado actualizado"}

# ==========================================
# RUTAS DEL CHAT
# ==========================================
@app.post("/api/chat")
def enviar_mensaje(mensaje: MensajeChat):
    nuevo_mensaje = {
        "id": len(mensajes_db) + 1,
        "sala_id": mensaje.sala_id,
        "remitente": mensaje.remitente,
        "texto": mensaje.texto,
        "hora": datetime.now().strftime("%H:%M")
    }
    
    if supabase_activo:
        try:
            data_nube = {k:v for k,v in nuevo_mensaje.items() if k != 'id'}
            supabase.table("mensajes_chat").insert(data_nube).execute()
        except: pass
        
    mensajes_db.append(nuevo_mensaje)
    return {"mensaje": "Enviado"}

@app.get("/api/chat/{sala_id}")
def obtener_mensajes_sala(sala_id: str):
    if supabase_activo:
        try:
            respuesta = supabase.table("mensajes_chat").select("*").eq("sala_id", sala_id).order("id").execute()
            if respuesta.data: return respuesta.data
        except: pass
        
    return [m for m in mensajes_db if m["sala_id"] == sala_id]

@app.get("/api/chat/salas/activas")
def obtener_salas_activas():
    mensajes = []
    if supabase_activo:
        try:
            respuesta = supabase.table("mensajes_chat").select("*").execute()
            if respuesta.data: mensajes = respuesta.data
        except: pass
        
    if not mensajes: mensajes = mensajes_db
    
    salas = list(set([m["sala_id"] for m in mensajes]))
    resultado = []
    for s in salas:
        msgs_sala = [m for m in mensajes if m["sala_id"] == s]
        ultimo_msg = msgs_sala[-1]["texto"] if msgs_sala else ""
        resultado.append({"sala_id": s, "ultimo_mensaje": ultimo_msg, "total_mensajes": len(msgs_sala)})
    return resultado