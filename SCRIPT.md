-- =========================================================
-- SIGEEX - Esquema base de Historia Clínica y Citas (PostgreSQL 16)
-- Motor: PostgreSQL 16
-- =========================================================
-- Crear base de datos si no existe
CREATE DATABASE sigeex;
\c sigeex; -- Conectarse a la base de datos

-- =======================
-- USUARIOS / ROLES
-- =======================
CREATE TABLE roles (
  id            BIGSERIAL PRIMARY KEY,
  nombre        VARCHAR(50)  NOT NULL UNIQUE,
  descripcion   VARCHAR(255) NULL
);

CREATE TABLE usuarios (
  id              BIGSERIAL PRIMARY KEY,
  username        VARCHAR(80)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  email           VARCHAR(120) NULL UNIQUE,
  telefono        VARCHAR(30)  NULL,
  activo          BOOLEAN   NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_rol (
  usuario_id BIGINT NOT NULL,
  rol_id     BIGINT NOT NULL,
  PRIMARY KEY (usuario_id, rol_id),
  CONSTRAINT fk_ur_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ur_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- =======================
-- CATÁLOGOS BÁSICOS
-- =======================
CREATE TABLE especialidades (
  id       BIGSERIAL PRIMARY KEY,
  nombre   VARCHAR(120) NOT NULL UNIQUE
);

-- =======================
-- PERSONAL / MÉDICOS
-- =======================
CREATE TABLE personal (
  id            BIGSERIAL PRIMARY KEY,
  usuario_id    BIGINT NULL,     -- staff con acceso al sistema
  nombres       VARCHAR(120) NOT NULL,
  apellidos     VARCHAR(120) NOT NULL,
  dpi           VARCHAR(25)  NULL,
  fecha_nac     DATE         NULL,
  telefono      VARCHAR(30)  NULL,
  email         VARCHAR(120) NULL,
  direccion     VARCHAR(255) NULL,
  creado_en     TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_personal_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE medicos (
  id               BIGSERIAL PRIMARY KEY,
  personal_id      BIGINT NOT NULL,
  especialidad_id  BIGINT NOT NULL,
  colegiado        VARCHAR(50)  NULL,
  firma_digital    VARCHAR(255) NULL,
  activo           BOOLEAN   NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_medico_personal      FOREIGN KEY (personal_id)     REFERENCES personal(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_medico_especialidad  FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- =======================
-- PACIENTES
-- =======================
CREATE TABLE pacientes (
  id               BIGSERIAL PRIMARY KEY,
  expediente_num   VARCHAR(30)  NULL UNIQUE,     -- correlativo del expediente físico/digital
  nombres          VARCHAR(120) NOT NULL,
  apellidos        VARCHAR(120) NOT NULL,
  sexo             CHAR(1) NULL,
  estado_civil     VARCHAR(15) NULL, 
  dpi              VARCHAR(25)  NULL,
  fecha_nac        DATE         NULL,
  telefono         VARCHAR(30)  NULL,
  email            VARCHAR(120) NULL,
  direccion        VARCHAR(255) NULL,
  contacto_emerg   VARCHAR(160) NULL,
  creado_en        TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =======================
-- HISTORIA CLÍNICA LONGITUDINAL (JSON)
-- =======================
/*
  antecedentes_json ejemplo:
  {
    "patologicos": {"diabetes": true, "hipertension": false, "cardiopatia": false,
                    "convulsiones": false, "alergias": ["Penicilina"]},
    "quirurgicos": {"apendicectomia": true, "colecistectomia": false, "otros": "Cesárea 2019"},
    "toxicos": {"tabaco": false, "alcohol": "ocasional"},
    "familiares": {"dm": true, "hta": false},
    "gineco_obstetricos": {"gestas": 2, "partos": 2, "abortos": 0,
                           "fur": "2025-02-15", "menarquia": 9, "ciclos_dias": 30,
                           "anticoncepcion": "Oral", "papanicolaou": "hace 1 año"}
  }
*/
CREATE TABLE historia_paciente (
  id                 BIGSERIAL PRIMARY KEY,
  paciente_id        BIGINT NOT NULL UNIQUE,
  antecedentes_json  JSONB           NOT NULL,
  notas              TEXT           NULL,
  actualizado_en     TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hist_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- =======================
-- CITAS (permite citas SIN paciente registrado)
-- =======================
CREATE TABLE citas (
  id                 BIGSERIAL PRIMARY KEY,
  medico_id          BIGINT NOT NULL,
  paciente_id        BIGINT NULL,   -- puede ser NULL si aún no está registrado
  fecha_hora         TIMESTAMPTZ       NOT NULL,
  duracion_min       INT            NOT NULL DEFAULT 30,
  motivo             VARCHAR(255)   NULL,
  estado             VARCHAR(15) NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDA', 'NO_SHOW'
  -- Campos temporales cuando no existe paciente en el sistema
  temp_nombre        VARCHAR(160)   NULL,
  temp_telefono      VARCHAR(30)    NULL,
  creado_por         BIGINT NULL,   -- usuario que agenda
  creado_en          TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en     TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cita_medico    FOREIGN KEY (medico_id)   REFERENCES medicos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cita_paciente  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_cita_usuario   FOREIGN KEY (creado_por)  REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- =======================
-- CONSULTAS / ENCOUNTERS (atención médica)
-- =======================
/*
  examen_fisico_json ejemplo:
  {"piel_mucosas":"Normocolor","corazon":"Ritmo regular",
   "pulmones":"MV presente","abdomen":"Blando depresible",
   "genitales":"Sanos","tacto_vaginal":"Cérvix cerrado",
   "neurologico":"Alerta y orientada","otros":"--"}
*/
CREATE TABLE consultas (
  id                   BIGSERIAL PRIMARY KEY,
  paciente_id          BIGINT NOT NULL,
  medico_id            BIGINT NOT NULL,
  cita_id              BIGINT NULL,
  fecha_hora           TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Signos vitales
  pa_sistolica         SMALLINT NULL,    -- mmHg
  pa_diastolica        SMALLINT NULL,
  fc                   SMALLINT NULL,    -- frecuencia cardiaca
  fr                   SMALLINT NULL,    -- frecuencia respiratoria
  temperatura_c        DECIMAL(4,1) NULL,
  peso_kg              DECIMAL(6,2) NULL,
  talla_cm             DECIMAL(6,2) NULL,
  examen_fisico_json   JSONB     NULL,
  historia_actual      TEXT     NULL,
  impresion_clinica    TEXT     NULL,
  plan_terapeutico     TEXT     NULL,
  adjuntos_json        JSONB     NULL, -- ids/urls de adjuntos asociados (opcional)
  CONSTRAINT fk_consulta_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_consulta_medico   FOREIGN KEY (medico_id)   REFERENCES medicos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_consulta_cita     FOREIGN KEY (cita_id)     REFERENCES citas(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- Diagnósticos ligados a consulta (útiles para reportes de "consultas más frecuentes")
CREATE TABLE diagnosticos (
  id            BIGSERIAL PRIMARY KEY,
  consulta_id   BIGINT NOT NULL,
  cie10         VARCHAR(10)  NULL,            -- opcional
  descripcion   VARCHAR(255) NOT NULL,
  tipo          VARCHAR(15) NOT NULL DEFAULT 'PRINCIPAL', -- 'PRINCIPAL', 'SECUNDARIO'
  CONSTRAINT fk_dx_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- Recetas / Medicación
CREATE TABLE recetas (
  id            BIGSERIAL PRIMARY KEY,
  consulta_id   BIGINT NOT NULL,
  medicamento   VARCHAR(160) NOT NULL,
  dosis         VARCHAR(80)  NULL,
  via           VARCHAR(40)  NULL,
  frecuencia    VARCHAR(80)  NULL,
  duracion      VARCHAR(80)  NULL,
  indicaciones  VARCHAR(255) NULL,
  CONSTRAINT fk_receta_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- Órdenes (laboratorio/imagen/otros) y Resultados (soportan adjuntos y JSON)
CREATE TABLE ordenes (
  id            BIGSERIAL PRIMARY KEY,
  consulta_id   BIGINT NOT NULL,
  tipo          VARCHAR(15) NOT NULL, -- 'LAB','IMAGEN','OTRO'
  nombre        VARCHAR(160) NOT NULL,
  notas         VARCHAR(255) NULL,
  estado        VARCHAR(15) NOT NULL DEFAULT 'SOLICITADA', -- 'SOLICITADA', 'RECIBIDA', 'ANULADA'
  creada_en     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orden_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE resultados (
  id            BIGSERIAL PRIMARY KEY,
  orden_id      BIGINT NOT NULL,
  recibido_en   TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resultado_txt TEXT         NULL,
  resultado_json JSONB        NULL,   -- estructura libre (valores, rangos, etc.)
  archivo_url   VARCHAR(255) NULL,   -- ruta/URL si se digitaliza
  CONSTRAINT fk_resultado_orden FOREIGN KEY (orden_id) REFERENCES ordenes(id)
    ON UPDATE CASCADE ON DELETE CASCADE
);

-- =======================
-- SEGUIMIENTO (tareas/citas de control)
-- =======================
CREATE TABLE seguimientos (
  id            BIGSERIAL PRIMARY KEY,
  paciente_id   BIGINT NOT NULL,
  consulta_id   BIGINT NULL,
  responsable_id BIGINT NULL, -- médico o administrativo (id de personal)
  motivo        VARCHAR(255)  NOT NULL,
  fecha_objetivo TIMESTAMPTZ     NOT NULL,
  estado        VARCHAR(15)  NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'REALIZADO', 'CANCELADO'
  notas         VARCHAR(255)  NULL,
  creado_en     TIMESTAMPTZ      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_seg_paciente   FOREIGN KEY (paciente_id)   REFERENCES pacientes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_seg_consulta   FOREIGN KEY (consulta_id)   REFERENCES consultas(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_seg_responsable FOREIGN KEY (responsable_id) REFERENCES personal(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

-- =======================
-- ADJUNTOS (PDF, imágenes, etc.)
-- =======================
CREATE TABLE adjuntos (
  id            BIGSERIAL PRIMARY KEY,
  paciente_id   BIGINT NULL,
  consulta_id   BIGINT NULL,
  orden_id      BIGINT NULL,
  subido_por    BIGINT NULL,  -- usuario
  nombre_archivo VARCHAR(160) NOT NULL,
  mime_type     VARCHAR(80)  NULL,
  url_storage   VARCHAR(255) NOT NULL,
  creado_en     TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_adj_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_adj_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_adj_orden    FOREIGN KEY (orden_id)   REFERENCES ordenes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_adj_usuario  FOREIGN KEY (subido_por) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);



-- ===== VISTAS DE REPORTE (corregidas) =====

-- Citas por médico y fecha
CREATE OR REPLACE VIEW rpt_citas_por_medico AS
SELECT
  m.id AS medico_id,
  CONCAT(pers.nombres, ' ', pers.apellidos) AS medico, -- o (pers.nombres || ' ' || pers.apellidos)
  DATE(c.fecha_hora) AS fecha,
  COUNT(*) AS total
FROM citas c
JOIN medicos   m    ON m.id = c.medico_id
JOIN personal  pers ON pers.id = m.personal_id
GROUP BY
  m.id,
  pers.nombres, pers.apellidos,
  DATE(c.fecha_hora);

-- Pacientes nuevos por día
CREATE OR REPLACE VIEW rpt_pacientes_nuevos AS
SELECT DATE(creado_en) AS fecha, COUNT(*) AS nuevos
FROM pacientes
GROUP BY DATE(creado_en);

-- Diagnósticos más frecuentes
CREATE OR REPLACE VIEW rpt_diagnosticos_frecuentes AS
SELECT
  COALESCE(d.cie10, '-') AS cie10,
  d.descripcion,
  COUNT(*) AS casos
FROM diagnosticos d
GROUP BY d.cie10, d.descripcion
ORDER BY casos DESC;
