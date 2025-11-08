# 📚 EJEMPLOS DE APIs - SIGEEX BACKEND

**Base URL:** `http://localhost:3001/api/v1`

---

## 🔐 1. AUTENTICACIÓN

### 1.1 Registrar Usuario
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "dr_martinez",
  "password": "SecurePass123!",
  "email": "martinez@sigeex.com",
  "telefono": "12345678"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "dr_martinez",
      "email": "martinez@sigeex.com"
    }
  }
}
```

### 1.2 Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "dr_martinez",
  "password": "SecurePass123!"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "dr_martinez",
      "email": "martinez@sigeex.com",
      "activo": true
    }
  }
}
```

---

## 👤 2. USUARIOS

### 2.1 Listar Usuarios
```http
GET /api/v1/usuarios?page=1&limit=10&search=martinez
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "username": "dr_martinez",
        "email": "martinez@sigeex.com",
        "telefono": "12345678",
        "activo": true,
        "creado_en": "2025-11-07T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 2.2 Obtener Usuario por ID
```http
GET /api/v1/usuarios/1
Authorization: Bearer {token}
```

### 2.3 Actualizar Usuario (PATCH - Actualización Parcial)
```http
PATCH /api/v1/usuarios/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "telefono": "87654321",
  "email": "nuevo_email@sigeex.com"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 1,
    "username": "dr_martinez",
    "email": "nuevo_email@sigeex.com",
    "telefono": "87654321",
    "activo": true
  }
}
```

### 2.4 Eliminar Usuario (Soft Delete)
```http
DELETE /api/v1/usuarios/1
Authorization: Bearer {token}
```

### 2.5 Alternar Estado Activo/Inactivo
```http
PATCH /api/v1/usuarios/1/toggle-status
Authorization: Bearer {token}
```

---

## 🎭 3. ROLES

### 3.1 Crear Rol
```http
POST /api/v1/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Médico",
  "descripcion": "Médico general o especialista"
}
```

### 3.2 Asignar Rol a Usuario
```http
POST /api/v1/roles/asignar
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 1,
  "rol_id": 1
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Rol asignado exitosamente",
  "data": {
    "usuario_id": 1,
    "rol_id": 1
  }
}
```

---

## 🏥 4. ESPECIALIDADES

### 4.1 Crear Especialidad
```http
POST /api/v1/especialidades
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Cardiología"
}
```

### 4.2 Listar Especialidades
```http
GET /api/v1/especialidades
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {"id": 1, "nombre": "Cardiología"},
    {"id": 2, "nombre": "Pediatría"},
    {"id": 3, "nombre": "Ginecología"},
    {"id": 4, "nombre": "Medicina General"}
  ]
}
```

---

## 👨‍⚕️ 5. PERSONAL

### 5.1 Crear Personal
```http
POST /api/v1/personal
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 1,
  "nombres": "Carlos Eduardo",
  "apellidos": "Martínez López",
  "dpi": "2345678901234",
  "fecha_nac": "1985-05-15",
  "telefono": "12345678",
  "email": "martinez@sigeex.com",
  "direccion": "Zona 10, Ciudad de Guatemala"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Personal creado exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "nombres": "Carlos Eduardo",
    "apellidos": "Martínez López",
    "dpi": "2345678901234",
    "fecha_nac": "1985-05-15",
    "telefono": "12345678",
    "email": "martinez@sigeex.com",
    "direccion": "Zona 10, Ciudad de Guatemala",
    "creado_en": "2025-11-07T10:45:00.000Z"
  }
}
```

### 5.2 Actualizar Personal (PATCH)
```http
PATCH /api/v1/personal/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "telefono": "87654321",
  "direccion": "Nueva dirección en Zona 15"
}
```

---

## 🩺 6. MÉDICOS

### 6.1 Crear Médico
```http
POST /api/v1/medicos
Authorization: Bearer {token}
Content-Type: application/json

{
  "personal_id": 1,
  "especialidad_id": 1,
  "colegiado": "12345",
  "firma_digital": "url_to_signature.png",
  "activo": true
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Médico creado exitosamente",
  "data": {
    "id": 1,
    "personal_id": 1,
    "especialidad_id": 1,
    "colegiado": "12345",
    "firma_digital": "url_to_signature.png",
    "activo": true
  }
}
```

### 6.2 Listar Médicos
```http
GET /api/v1/medicos
Authorization: Bearer {token}
```

---

## 🧑‍🦱 7. PACIENTES

### 7.1 Crear Paciente
```http
POST /api/v1/pacientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "expediente_num": "EXP-2025-001",
  "nombres": "María José",
  "apellidos": "García Hernández",
  "sexo": "F",
  "estado_civil": "Soltera",
  "dpi": "3456789012345",
  "fecha_nac": "1992-08-20",
  "telefono": "55443322",
  "email": "maria.garcia@email.com",
  "direccion": "Zona 7, Mixco",
  "contacto_emerg": "Juan García - 99887766"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Paciente creado exitosamente",
  "data": {
    "id": 1,
    "expediente_num": "EXP-2025-001",
    "nombres": "María José",
    "apellidos": "García Hernández",
    "sexo": "F",
    "estado_civil": "Soltera",
    "dpi": "3456789012345",
    "fecha_nac": "1992-08-20",
    "telefono": "55443322",
    "email": "maria.garcia@email.com",
    "direccion": "Zona 7, Mixco",
    "contacto_emerg": "Juan García - 99887766",
    "creado_en": "2025-11-07T11:00:00.000Z"
  }
}
```

### 7.2 Buscar Pacientes
```http
GET /api/v1/pacientes/buscar?q=García
Authorization: Bearer {token}
```

### 7.3 Actualizar Paciente (PATCH)
```http
PATCH /api/v1/pacientes/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "telefono": "11223344",
  "direccion": "Nueva dirección Zona 11"
}
```

### 7.4 Eliminar Paciente
```http
DELETE /api/v1/pacientes/1
Authorization: Bearer {token}
```

---

## 📋 8. HISTORIA CLÍNICA (historia_paciente)

### 8.1 Crear Historia Clínica
```http
POST /api/v1/historia_paciente
Authorization: Bearer {token}
Content-Type: application/json

{
  "paciente_id": 1,
  "antecedentes_json": {
    "patologicos": {
      "diabetes": false,
      "hipertension": true,
      "cardiopatia": false,
      "asma": false,
      "alergias": "Penicilina"
    },
    "quirurgicos": [
      {
        "cirugia": "Apendicetomía",
        "fecha": "2010-03-15",
        "hospital": "Hospital Roosevelt"
      }
    ],
    "familiares": {
      "diabetes": "Padre",
      "hipertension": "Madre y abuelo materno",
      "cancer": "Ninguno"
    },
    "habitos": {
      "tabaco": false,
      "alcohol": "Social",
      "drogas": false,
      "ejercicio": "3 veces por semana"
    },
    "gineco_obstetricos": {
      "menarca": "13 años",
      "gestas": 2,
      "partos": 2,
      "cesareas": 0,
      "abortos": 0,
      "fum": "2025-10-15"
    }
  },
  "notas": "Paciente refiere control regular de presión arterial con enalapril 10mg diarios"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Historia clínica creada exitosamente",
  "data": {
    "id": 1,
    "paciente_id": 1,
    "antecedentes_json": { "..." },
    "notas": "Paciente refiere control regular...",
    "actualizado_en": "2025-11-07T11:15:00.000Z"
  }
}
```

### 8.2 Obtener Historia Clínica de un Paciente
```http
GET /api/v1/historia_paciente/paciente/1
Authorization: Bearer {token}
```

### 8.3 Actualizar Historia Clínica (PATCH)
```http
PATCH /api/v1/historia_paciente/paciente/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "antecedentes_json": {
    "patologicos": {
      "diabetes": false,
      "hipertension": true,
      "cardiopatia": false,
      "asma": false,
      "alergias": "Penicilina, Aspirina"
    }
  },
  "notas": "Actualización: Se agrega alergia a aspirina detectada en última consulta"
}
```

---

## 📅 9. CITAS

### 9.1 Crear Cita con Paciente Registrado
```http
POST /api/v1/citas
Authorization: Bearer {token}
Content-Type: application/json

{
  "medico_id": 1,
  "paciente_id": 1,
  "fecha_hora": "2025-11-10T10:00:00Z",
  "duracion_min": 30,
  "motivo": "Control de presión arterial",
  "estado": "PENDIENTE",
  "creado_por": 1
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "data": {
    "id": 1,
    "medico_id": 1,
    "paciente_id": 1,
    "fecha_hora": "2025-11-10T10:00:00.000Z",
    "duracion_min": 30,
    "motivo": "Control de presión arterial",
    "estado": "PENDIENTE",
    "temp_nombre": null,
    "temp_telefono": null,
    "creado_por": 1,
    "creado_en": "2025-11-07T11:30:00.000Z"
  }
}
```

### 9.2 Crear Cita SIN Paciente Registrado (Paciente Temporal)
```http
POST /api/v1/citas
Authorization: Bearer {token}
Content-Type: application/json

{
  "medico_id": 1,
  "fecha_hora": "2025-11-10T11:00:00Z",
  "duracion_min": 30,
  "motivo": "Primera consulta",
  "estado": "PENDIENTE",
  "temp_nombre": "Pedro Pérez",
  "temp_telefono": "44556677",
  "creado_por": 1
}
```

### 9.3 Listar Citas con Filtros
```http
GET /api/v1/citas?medico_id=1&estado=PENDIENTE&fecha_desde=2025-11-10&page=1&limit=20
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "medico_id": 1,
        "paciente_id": 1,
        "fecha_hora": "2025-11-10T10:00:00.000Z",
        "duracion_min": 30,
        "motivo": "Control de presión arterial",
        "estado": "PENDIENTE",
        "nombre_medico": "Carlos Eduardo Martínez López",
        "colegiado": "12345",
        "especialidad": "Cardiología",
        "nombre_paciente": "María José García Hernández",
        "expediente_num": "EXP-2025-001"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 20
    }
  }
}
```

### 9.4 Obtener Agenda de un Médico por Fecha
```http
GET /api/v1/citas/agenda?medico_id=1&fecha=2025-11-10
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fecha_hora": "2025-11-10T10:00:00.000Z",
      "duracion_min": 30,
      "motivo": "Control de presión arterial",
      "estado": "PENDIENTE",
      "paciente_nombre_display": "María José García Hernández",
      "paciente_telefono_display": "55443322"
    },
    {
      "id": 2,
      "fecha_hora": "2025-11-10T11:00:00.000Z",
      "duracion_min": 30,
      "motivo": "Primera consulta",
      "estado": "CONFIRMADA",
      "paciente_nombre_display": "Pedro Pérez",
      "paciente_telefono_display": "44556677"
    }
  ]
}
```

### 9.5 Actualizar Cita (PATCH)
```http
PATCH /api/v1/citas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "fecha_hora": "2025-11-10T14:00:00Z",
  "motivo": "Control de presión arterial y revisión de medicamentos"
}
```

### 9.6 Cambiar Estado de Cita
```http
PATCH /api/v1/citas/1/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "CONFIRMADA"
}
```

**Estados válidos:** `PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `ATENDIDA`, `NO_SHOW`

### 9.7 Cancelar Cita (Soft Delete)
```http
DELETE /api/v1/citas/1
Authorization: Bearer {token}
```

---

## 🩺 10. CONSULTAS (Atención Médica)

### 10.1 Crear Consulta
```http
POST /api/v1/consultas
Authorization: Bearer {token}
Content-Type: application/json

{
  "paciente_id": 1,
  "medico_id": 1,
  "cita_id": 1,
  "fecha_hora": "2025-11-10T10:15:00Z",
  "pa_sistolica": 135,
  "pa_diastolica": 85,
  "fc": 78,
  "fr": 18,
  "temperatura_c": 36.8,
  "peso_kg": 68.5,
  "talla_cm": 165,
  "imc": 25.2,
  "motivo_consulta": "Control de hipertensión arterial",
  "historia_enfermedad_actual": "Paciente refiere cefalea ocasional en región frontal, sin náuseas ni vómitos. Refiere adherencia al tratamiento con enalapril 10mg.",
  "examen_fisico_json": {
    "general": "Paciente alerta, orientada, cooperadora",
    "cabeza_cuello": "Normocéfalo, cuello sin adenopatías",
    "cardiovascular": "Ruidos cardíacos rítmicos, sin soplos",
    "respiratorio": "Murmullo vesicular presente en ambos campos pulmonares",
    "abdomen": "Blando, depresible, no doloroso, ruidos intestinales presentes",
    "extremidades": "Sin edema, pulsos periféricos presentes",
    "neurologico": "Sin déficit focal, pares craneales normales"
  },
  "plan_tratamiento": "1. Continuar enalapril 10mg c/24h\n2. Dieta hiposódica\n3. Control en 1 mes\n4. Solicitud de laboratorios",
  "observaciones": "Paciente en buen estado general, presión arterial en límite alto"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Consulta creada exitosamente",
  "data": {
    "id": 1,
    "paciente_id": 1,
    "medico_id": 1,
    "cita_id": 1,
    "fecha_hora": "2025-11-10T10:15:00.000Z",
    "pa_sistolica": 135,
    "pa_diastolica": 85,
    "fc": 78,
    "fr": 18,
    "temperatura_c": 36.8,
    "peso_kg": 68.5,
    "talla_cm": 165,
    "imc": 25.2,
    "motivo_consulta": "Control de hipertensión arterial",
    "historia_enfermedad_actual": "Paciente refiere cefalea...",
    "examen_fisico_json": { "..." },
    "plan_tratamiento": "1. Continuar enalapril...",
    "observaciones": "Paciente en buen estado general..."
  }
}
```

### 10.2 Listar Consultas con Filtros
```http
GET /api/v1/consultas?paciente_id=1&page=1&limit=10
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "paciente_id": 1,
        "medico_id": 1,
        "fecha_hora": "2025-11-10T10:15:00.000Z",
        "nombre_paciente": "María José García Hernández",
        "expediente_num": "EXP-2025-001",
        "nombre_medico": "Carlos Eduardo Martínez López",
        "colegiado": "12345",
        "especialidad": "Cardiología",
        "pa_sistolica": 135,
        "pa_diastolica": 85,
        "motivo_consulta": "Control de hipertensión arterial"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 10.3 Obtener Consulta por ID
```http
GET /api/v1/consultas/1
Authorization: Bearer {token}
```

### 10.4 Actualizar Consulta (PATCH)
```http
PATCH /api/v1/consultas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan_tratamiento": "1. Continuar enalapril 10mg c/24h\n2. Dieta hiposódica\n3. Agregar hidroclorotiazida 25mg c/24h\n4. Control en 2 semanas",
  "observaciones": "Se agrega diurético por persistencia de cifras tensionales elevadas"
}
```

---

## 🔬 11. DIAGNÓSTICOS

### 11.1 Crear Diagnóstico
```http
POST /api/v1/diagnosticos
Authorization: Bearer {token}
Content-Type: application/json

{
  "consulta_id": 1,
  "cie10": "I10",
  "descripcion": "Hipertensión arterial esencial (primaria)",
  "tipo": "principal"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Diagnóstico creado exitosamente",
  "data": {
    "id": 1,
    "consulta_id": 1,
    "cie10": "I10",
    "descripcion": "Hipertensión arterial esencial (primaria)",
    "tipo": "principal"
  }
}
```

### 11.2 Listar Diagnósticos por Consulta
```http
GET /api/v1/diagnosticos?consulta_id=1
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "consulta_id": 1,
      "cie10": "I10",
      "descripcion": "Hipertensión arterial esencial (primaria)",
      "tipo": "principal"
    },
    {
      "id": 2,
      "consulta_id": 1,
      "cie10": "R51",
      "descripcion": "Cefalea",
      "tipo": "secundario"
    }
  ]
}
```

### 11.3 Actualizar Diagnóstico (PATCH)
```http
PATCH /api/v1/diagnosticos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "definitivo"
}
```

### 11.4 Eliminar Diagnóstico
```http
DELETE /api/v1/diagnosticos/1
Authorization: Bearer {token}
```

---

## 💊 12. RECETAS

### 12.1 Crear Receta
```http
POST /api/v1/recetas
Authorization: Bearer {token}
Content-Type: application/json

{
  "consulta_id": 1,
  "medicamento": "Enalapril",
  "presentacion": "Tabletas 10mg",
  "dosis": "1 tableta",
  "frecuencia": "Cada 24 horas",
  "duracion": "30 días",
  "indicaciones": "Tomar en ayunas, preferiblemente en la mañana"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Receta creada exitosamente",
  "data": {
    "id": 1,
    "consulta_id": 1,
    "medicamento": "Enalapril",
    "presentacion": "Tabletas 10mg",
    "dosis": "1 tableta",
    "frecuencia": "Cada 24 horas",
    "duracion": "30 días",
    "indicaciones": "Tomar en ayunas, preferiblemente en la mañana"
  }
}
```

### 12.2 Listar Recetas por Consulta
```http
GET /api/v1/recetas?consulta_id=1
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "consulta_id": 1,
      "medicamento": "Enalapril",
      "presentacion": "Tabletas 10mg",
      "dosis": "1 tableta",
      "frecuencia": "Cada 24 horas",
      "duracion": "30 días",
      "indicaciones": "Tomar en ayunas, preferiblemente en la mañana"
    },
    {
      "id": 2,
      "consulta_id": 1,
      "medicamento": "Hidroclorotiazida",
      "presentacion": "Tabletas 25mg",
      "dosis": "1 tableta",
      "frecuencia": "Cada 24 horas",
      "duracion": "30 días",
      "indicaciones": "Tomar junto con enalapril"
    }
  ]
}
```

### 12.3 Obtener Receta por ID
```http
GET /api/v1/recetas/1
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "consulta_id": 1,
    "medicamento": "Enalapril",
    "presentacion": "Tabletas 10mg",
    "dosis": "1 tableta",
    "frecuencia": "Cada 24 horas",
    "duracion": "30 días",
    "indicaciones": "Tomar en ayunas, preferiblemente en la mañana",
    "fecha_consulta": "2025-11-10T10:15:00.000Z",
    "nombre_paciente": "María José García Hernández",
    "nombre_medico": "Carlos Eduardo Martínez López",
    "colegiado": "12345"
  }
}
```

### 12.4 Actualizar Receta (PATCH)
```http
PATCH /api/v1/recetas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "duracion": "60 días",
  "indicaciones": "Tomar en ayunas, preferiblemente en la mañana. Control en 2 meses"
}
```

### 12.5 Eliminar Receta
```http
DELETE /api/v1/recetas/1
Authorization: Bearer {token}
```

---

## 🧪 13. ÓRDENES (Laboratorios/Imágenes)

### 13.1 Crear Orden
```http
POST /api/v1/ordenes
Authorization: Bearer {token}
Content-Type: application/json

{
  "consulta_id": 1,
  "tipo": "LAB",
  "nombre": "Hemograma completo, química sanguínea, perfil lipídico",
  "notas": "Paciente en ayunas",
  "estado": "SOLICITADA"
}
```

**Tipos válidos:** `LAB`, `IMAGEN`, `OTRO`  
**Estados válidos:** `SOLICITADA`, `RECIBIDA`, `ANULADA`

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "id": 1,
    "consulta_id": 1,
    "tipo": "LAB",
    "nombre": "Hemograma completo, química sanguínea, perfil lipídico",
    "notas": "Paciente en ayunas",
    "estado": "SOLICITADA",
    "creada_en": "2025-11-10T11:00:00.000Z"
  }
}
```

### 13.2 Listar Órdenes con Filtros
```http
GET /api/v1/ordenes?consulta_id=1&tipo=LAB&estado=SOLICITADA&page=1&limit=10
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "consulta_id": 1,
        "tipo": "LAB",
        "nombre": "Hemograma completo, química sanguínea, perfil lipídico",
        "notas": "Paciente en ayunas",
        "estado": "SOLICITADA",
        "creada_en": "2025-11-10T11:00:00.000Z",
        "fecha_consulta": "2025-11-10T10:15:00.000Z",
        "nombre_paciente": "María José García Hernández",
        "expediente_num": "EXP-2025-001",
        "nombre_medico": "Carlos Eduardo Martínez López"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 13.3 Cambiar Estado de Orden
```http
PATCH /api/v1/ordenes/1/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "RECIBIDA"
}
```

### 13.4 Actualizar Orden (PATCH)
```http
PATCH /api/v1/ordenes/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "notas": "Resultados recibidos, revisar con paciente"
}
```

---

## 📋 14. RESULTADOS

### 14.1 Crear Resultado
```http
POST /api/v1/resultados
Authorization: Bearer {token}
Content-Type: application/json

{
  "orden_id": 1,
  "resultado_txt": "Hemoglobina: 14.5 g/dL, Leucocitos: 7,200/mm³, Plaquetas: 250,000/mm³",
  "resultado_json": {
    "hemoglobina": {
      "valor": 14.5,
      "unidad": "g/dL",
      "rango_normal": "12-16",
      "estado": "normal"
    },
    "leucocitos": {
      "valor": 7200,
      "unidad": "/mm³",
      "rango_normal": "4000-11000",
      "estado": "normal"
    },
    "plaquetas": {
      "valor": 250000,
      "unidad": "/mm³",
      "rango_normal": "150000-450000",
      "estado": "normal"
    },
    "glucosa": {
      "valor": 105,
      "unidad": "mg/dL",
      "rango_normal": "70-100",
      "estado": "elevado"
    }
  },
  "archivo_url": "https://storage.ejemplo.com/resultados/lab-001.pdf"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Resultado creado exitosamente",
  "data": {
    "id": 1,
    "orden_id": 1,
    "recibido_en": "2025-11-12T09:00:00.000Z",
    "resultado_txt": "Hemoglobina: 14.5 g/dL...",
    "resultado_json": { "..." },
    "archivo_url": "https://storage.ejemplo.com/resultados/lab-001.pdf"
  }
}
```

### 14.2 Listar Resultados por Orden
```http
GET /api/v1/resultados?orden_id=1
Authorization: Bearer {token}
```

### 14.3 Actualizar Resultado (PATCH)
```http
PATCH /api/v1/resultados/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "resultado_txt": "Resultados actualizados con valores corregidos",
  "archivo_url": "https://storage.ejemplo.com/resultados/lab-001-corregido.pdf"
}
```

---

## 📅 15. SEGUIMIENTOS (Tareas y Recordatorios)

### 15.1 Crear Seguimiento
```http
POST /api/v1/seguimientos
Authorization: Bearer {token}
Content-Type: application/json

{
  "paciente_id": 1,
  "consulta_id": 1,
  "responsable_id": 1,
  "motivo": "Control de presión arterial en 2 semanas",
  "fecha_objetivo": "2025-11-24T10:00:00Z",
  "estado": "PENDIENTE",
  "notas": "Revisar cifras tensionales y adherencia a tratamiento"
}
```

**Estados válidos:** `PENDIENTE`, `REALIZADO`, `CANCELADO`

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Seguimiento creado exitosamente",
  "data": {
    "id": 1,
    "paciente_id": 1,
    "consulta_id": 1,
    "responsable_id": 1,
    "motivo": "Control de presión arterial en 2 semanas",
    "fecha_objetivo": "2025-11-24T10:00:00.000Z",
    "estado": "PENDIENTE",
    "notas": "Revisar cifras tensionales y adherencia a tratamiento",
    "creado_en": "2025-11-10T11:30:00.000Z"
  }
}
```

### 15.2 Listar Seguimientos con Filtros
```http
GET /api/v1/seguimientos?paciente_id=1&estado=PENDIENTE&page=1&limit=10
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "paciente_id": 1,
        "consulta_id": 1,
        "responsable_id": 1,
        "motivo": "Control de presión arterial en 2 semanas",
        "fecha_objetivo": "2025-11-24T10:00:00.000Z",
        "estado": "PENDIENTE",
        "notas": "Revisar cifras tensionales...",
        "creado_en": "2025-11-10T11:30:00.000Z",
        "nombre_paciente": "María José García Hernández",
        "expediente_num": "EXP-2025-001",
        "nombre_responsable": "Carlos Eduardo Martínez López"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 15.3 Marcar Seguimiento como Completado
```http
PATCH /api/v1/seguimientos/1/completar
Authorization: Bearer {token}
Content-Type: application/json

{
  "notas": "Paciente acudió a control. Presión arterial 130/80 mmHg. Continúa con tratamiento."
}
```

### 15.4 Cambiar Estado de Seguimiento
```http
PATCH /api/v1/seguimientos/1/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "REALIZADO"
}
```

### 15.5 Actualizar Seguimiento (PATCH)
```http
PATCH /api/v1/seguimientos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "fecha_objetivo": "2025-11-25T14:00:00Z",
  "notas": "Fecha reprogramada a solicitud del paciente"
}
```

---

## � 16. ADJUNTOS (Archivos)

### 16.1 Crear Adjunto
```http
POST /api/v1/adjuntos
Authorization: Bearer {token}
Content-Type: application/json

{
  "paciente_id": 1,
  "consulta_id": 1,
  "subido_por": 1,
  "nombre_archivo": "radiografia-torax-2025-11-10.pdf",
  "mime_type": "application/pdf",
  "url_storage": "https://storage.ejemplo.com/adjuntos/paciente-1/rx-torax-001.pdf"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Adjunto creado exitosamente",
  "data": {
    "id": 1,
    "paciente_id": 1,
    "consulta_id": 1,
    "orden_id": null,
    "subido_por": 1,
    "nombre_archivo": "radiografia-torax-2025-11-10.pdf",
    "mime_type": "application/pdf",
    "url_storage": "https://storage.ejemplo.com/adjuntos/paciente-1/rx-torax-001.pdf",
    "creado_en": "2025-11-10T12:00:00.000Z"
  }
}
```

### 16.2 Listar Adjuntos con Filtros
```http
GET /api/v1/adjuntos?paciente_id=1&page=1&limit=10
Authorization: Bearer {token}
```

**Filtros disponibles:** `paciente_id`, `consulta_id`, `orden_id`

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "paciente_id": 1,
        "consulta_id": 1,
        "orden_id": null,
        "subido_por": 1,
        "nombre_archivo": "radiografia-torax-2025-11-10.pdf",
        "mime_type": "application/pdf",
        "url_storage": "https://storage.ejemplo.com/adjuntos/paciente-1/rx-torax-001.pdf",
        "creado_en": "2025-11-10T12:00:00.000Z",
        "nombre_paciente": "María José García Hernández",
        "expediente_num": "EXP-2025-001",
        "subido_por_username": "dr_martinez"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 16.3 Obtener Adjunto por ID
```http
GET /api/v1/adjuntos/1
Authorization: Bearer {token}
```

### 16.4 Actualizar Adjunto (PATCH)
```http
PATCH /api/v1/adjuntos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre_archivo": "radiografia-torax-actualizada-2025-11-10.pdf"
}
```

### 16.5 Eliminar Adjunto
```http
DELETE /api/v1/adjuntos/1
Authorization: Bearer {token}
```

---

## �📊 17. CÓDIGOS DE ESTADO HTTP

- **200 OK:** Solicitud exitosa
- **201 Created:** Recurso creado exitosamente
- **400 Bad Request:** Datos inválidos o faltantes
- **401 Unauthorized:** Token JWT inválido o faltante
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Conflicto (ej. email duplicado)
- **500 Internal Server Error:** Error del servidor

---

## 🔑 18. HEADERS REQUERIDOS

Todas las rutas (excepto `/auth/login` y `/auth/register`) requieren:

```http
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 📝 19. NOTAS IMPORTANTES

1. **PATCH vs PUT:** Todos los endpoints de actualización usan PATCH para permitir actualizaciones parciales
2. **Paginación:** Por defecto `page=1` y `limit=10`
3. **Soft Delete:** Algunos endpoints DELETE realizan eliminación lógica
4. **Tokens JWT:** Expiran en 1 hora, renovar con login
5. **Fechas:** Usar formato ISO 8601 (ej. `2025-11-10T10:00:00Z`)
6. **Estados de Citas:** PENDIENTE, CONFIRMADA, CANCELADA, ATENDIDA, NO_SHOW
7. **Estados de Órdenes:** SOLICITADA, RECIBIDA, ANULADA
8. **Estados de Seguimientos:** PENDIENTE, REALIZADO, CANCELADO
9. **Tipos de Órdenes:** LAB, IMAGEN, OTRO

---

## 🚀 20. FLUJO COMPLETO DEL SISTEMA

### Flujo de Atención Médica:
1. **Registrar usuario** → POST `/auth/register`
2. **Login** → POST `/auth/login` (obtener token)
3. **Crear paciente** → POST `/pacientes`
4. **Crear historia clínica** → POST `/historia_paciente`
5. **Agendar cita** → POST `/citas`
6. **Confirmar cita** → PATCH `/citas/{id}/estado` (CONFIRMADA)
7. **Atender paciente (crear consulta)** → POST `/consultas`
8. **Agregar diagnósticos** → POST `/diagnosticos`
9. **Generar recetas** → POST `/recetas`
10. **Solicitar laboratorios** → POST `/ordenes`
11. **Subir resultados** → POST `/resultados`
12. **Adjuntar documentos** → POST `/adjuntos`
13. **Programar seguimiento** → POST `/seguimientos`
14. **Marcar cita como atendida** → PATCH `/citas/{id}/estado` (ATENDIDA)

---

**Última actualización:** 2025-11-07  
**Versión del API:** 1.0.0  
**Total de Endpoints:** 100+
