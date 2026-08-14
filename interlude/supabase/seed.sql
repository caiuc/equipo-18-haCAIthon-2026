-- Interlude: datos sintéticos de prueba
-- Correr después de schema.sql. Todos los datos son ficticios.
-- Fecha de referencia del set: 2026-08-14.

insert into cesfams (id, nombre, comuna) values
  ('C-01', 'CESFAM La Florida', 'La Florida'),
  ('C-02', 'CESFAM Puente Alto', 'Puente Alto'),
  ('C-03', 'CESFAM Independencia', 'Independencia');

-- Casos deliberados entre los pacientes:
--   P-05  -> riesgo moderado, último control hace más de 5 meses (2026-02-10)
--   P-10  -> riesgo alto, sin ninguna llamada registrada
--   P-14  -> HTA y DM2 a la vez
--   resto -> pacientes sin nada particular

insert into pacientes
  (id, cesfam_id, edad, sexo, patologias, riesgo, fase, ultimo_control, proximo_control, telefono_hash, contacto_emergencia)
values
  ('P-01', 'C-01', 68, 'F', array['HTA'],        'moderado', 'compensado',      '2026-06-02', '2026-12-02', '2ad7f0d1555417872d9bf79cda0d2e7c2fcd5accfde92e7f9b72818944308e', false),
  ('P-02', 'C-01', 74, 'M', array['HTA', 'DLP'], 'alto',     'en_compensacion', '2026-05-20', '2026-08-20', 'ab4a628937c6ccf4d16a14bf36839715e37258be76d79c0fc00cbed6f58c2c', false),
  ('P-03', 'C-01', 59, 'F', array['DM2'],        'bajo',     'compensado',      '2026-04-18', '2026-10-18', 'ccb57841cfb719161156c6d1c6b416c3e42db49d5647a397481261fdf3527e', false),
  ('P-04', 'C-01', 81, 'M', array['HTA', 'DM2'], 'alto',     'en_compensacion', '2026-06-30', '2026-09-30', '5cddb37a1d838577bfefa2340186549027a082c556502f2615ff2d722f5cb4', true),
  ('P-05', 'C-01', 63, 'F', array['HTA'],        'moderado', 'en_compensacion', '2026-02-10', '2026-08-10', '17f72ceed2bbaa988b26381540bc7a42cde30b0787292dc9fc7425d1518f3f', false),
  ('P-06', 'C-01', 55, 'M', array['DLP'],        'bajo',     'compensado',      '2026-07-01', '2027-01-01', '473e2e2f706c2b0c0abe56ee8d766cc30f5f225b3c3f4d22608728efc76f1f', false),
  ('P-07', 'C-01', 77, 'F', array['HTA', 'DM2'], 'alto',     'compensado',      '2026-07-22', '2026-10-22', 'ddc135c565c70bbcd90959b224c52900857bcfdddc2f7885d321ff9e8c6134', false),

  ('P-08', 'C-02', 52, 'M', array['DM2'],        'moderado', 'compensado',      '2026-05-05', '2026-11-05', '3d57565e9ae98cc5fec0ab4fb3dcee0d9015ecdfbac8752aee8d7e586ca53e', false),
  ('P-09', 'C-02', 69, 'F', array['HTA'],        'bajo',     'compensado',      '2026-06-14', '2026-12-14', 'ab8185b2124bfff47c70625e2fb439ad2d79c4622a40bbc27d3dd43efb9670', false),
  ('P-10', 'C-02', 85, 'M', array['HTA', 'DLP'], 'alto',     'en_compensacion', '2026-06-25', '2026-09-25', '8625b35ded84499e59542c3f0a4c382950a332f173c3353a3182e29ccdfaf6', true),
  ('P-11', 'C-02', 60, 'F', array['DM2'],        'moderado', 'compensado',      '2026-05-30', '2026-11-30', 'e7eb8ef89fa7b9f7668833516b44c76fad675171bc8c3c34122049e2dcfcd5', false),
  ('P-12', 'C-02', 71, 'M', array['HTA'],        'alto',     'compensado',      '2026-07-10', '2026-10-10', '8eed979191f61ea30237d1cb9ce2ad2164251841ccfd08851a4e4f227f8fed', false),
  ('P-13', 'C-02', 57, 'F', array['DLP'],        'bajo',     'compensado',      '2026-07-05', '2027-01-05', 'e76aea0470cac6f2465e5c9a15f13e81789dbf6400c2e260fa992ba1dbda2d', false),
  ('P-14', 'C-02', 66, 'M', array['HTA', 'DM2'], 'alto',     'en_compensacion', '2026-06-18', '2026-09-18', '08e4215a3ee9071db8fa5ec48b958b4f83ddb2994fb87b8894b81b9328222c', true),

  ('P-15', 'C-03', 50, 'F', array['DM2'],        'bajo',     'compensado',      '2026-06-08', '2026-12-08', 'b31356366bb087a0297b59716c2f7dc8a3931ea83dc997a79c0df04100045f', false),
  ('P-16', 'C-03', 79, 'M', array['HTA', 'DLP'], 'alto',     'compensado',      '2026-07-16', '2026-10-16', 'be0544f46db3ef4e1f1f1c68b8a15da48a064164c34943eed9a8b4f38a0f30', false),
  ('P-17', 'C-03', 64, 'F', array['HTA'],        'moderado', 'compensado',      '2026-05-25', '2026-11-25', '7a2e7e7c70b9b3f0df5010cd1aa2129079505321aa00c7a5645d556c42e81a', false),
  ('P-18', 'C-03', 73, 'M', array['DM2'],        'moderado', 'en_compensacion', '2026-06-20', '2026-12-20', '208eb18310b2ed88db02ed54c238213d7b02f80172cf5ab66d96697415c611', false),
  ('P-19', 'C-03', 82, 'F', array['HTA', 'DM2'], 'alto',     'en_compensacion', '2026-07-01', '2026-10-01', '83fceafc7bd48cbc44bed750c4d4d83b87e7267e7c49e5aa95520d1924b216', true),
  ('P-20', 'C-03', 56, 'M', array['DLP'],        'bajo',     'compensado',      '2026-06-29', '2026-12-29', '30c45b3503c66c4533fc0c8a1d6012b0368d46f9b7400d9534bff6c79988de', false);

-- Llamadas. El campo respuestas replica la forma exacta del objeto final que
-- entrega Cami (sección 45 de su system prompt), para poder escribir y probar
-- las reglas de tags contra datos con la estructura real.
--
-- P-10 no aparece acá a propósito: riesgo alto y sin ninguna llamada.

-- Emergencia actual: dolor de pecho en curso.
insert into llamadas (paciente_id, conversation_id, estado, transcripcion, creado_en, respuestas) values
('P-04', 'conv_8fk20dhs71ma', 'completed',
 'Cami: Buenos días, don Luis, le llamo del CESFAM La Florida... Paciente: Sí, justo ahora tengo como un apretón en el pecho...',
 '2026-08-13 10:20:00+00',
 '{
   "call_id": "conv_8fk20dhs71ma", "patient_id": "P-04",
   "started_at": "2026-08-13T10:18:00Z", "completed_at": "2026-08-13T10:20:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "patient", "third_party_authorized": null,
   "emergency": {"active": true, "type": "CURRENT_CHEST_PAIN", "requires_immediate_escalation": true},
   "symptoms": {
     "chest_pain_past_week": true, "chest_pain_current": true,
     "shortness_of_breath_past_week": true, "shortness_of_breath_current": null,
     "palpitations_past_week": null, "palpitations_current": null,
     "dizziness_past_week": null, "fainting_past_week": null,
     "neurologic_warning_signs_current": null,
     "overall_health_worsening": null, "new_health_problem": null, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": null, "measured_last_7_days": null, "latest_reported_value": null, "reported_high_values": null},
   "medications": {"taking_as_prescribed": null, "difficulty_getting_medications": null, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": null},
   "follow_up": {"recent_cholesterol_test": null, "pending_appointment_or_test": null, "pending_appointment_or_test_detail": null},
   "priority": {"level": "EMERGENCY", "reason": ["emergency.active = true", "chest_pain_current = true"]},
   "next_best_action": "REVIEW_URGENT_ALERT",
   "summary_for_tens": "Patient reports chest pain occurring at the time of the call. Call was ended following the emergency protocol."
 }'),

-- Problema de acceso a medicamentos.
('P-02', 'conv_1kd93jfa02lz', 'completed',
 'Cami: ¿Ha podido tomar sus remedios como se los indicó el equipo? Paciente: No, se me acabaron hace como diez días y no he podido ir a buscarlos...',
 '2026-08-12 09:05:00+00',
 '{
   "call_id": "conv_1kd93jfa02lz", "patient_id": "P-02",
   "started_at": "2026-08-12T09:01:00Z", "completed_at": "2026-08-12T09:05:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "patient", "third_party_authorized": null,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": false, "chest_pain_current": false,
     "shortness_of_breath_past_week": false, "shortness_of_breath_current": false,
     "palpitations_past_week": false, "palpitations_current": null,
     "dizziness_past_week": true, "fainting_past_week": false,
     "neurologic_warning_signs_current": false,
     "overall_health_worsening": null, "new_health_problem": null, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": true, "measured_last_7_days": false, "latest_reported_value": null, "reported_high_values": null},
   "medications": {"taking_as_prescribed": false, "difficulty_getting_medications": true, "medication_issue": "MEDICATION_UNAVAILABLE", "medication_issue_detail": "Patient reports medications ran out about ten days ago."},
   "lifestyle": {"smoked_last_7_days": false},
   "follow_up": {"recent_cholesterol_test": null, "pending_appointment_or_test": true, "pending_appointment_or_test_detail": "Cardiovascular follow-up"},
   "priority": {"level": "HIGH", "reason": ["taking_as_prescribed = false", "medication_issue = MEDICATION_UNAVAILABLE"]},
   "next_best_action": "REVIEW_MEDICATION_ACCESS",
   "summary_for_tens": "Patient ran out of medications and has not been able to collect them. Reports mild dizziness, no chest pain or shortness of breath."
 }'),

-- Empeoramiento general y presiones altas reportadas.
('P-14', 'conv_77aksm31pqx0', 'completed',
 'Cami: En comparación con la semana pasada, ¿se siente igual, mejor o peor? Paciente: Peor, ando muy cansado y la presión me ha salido alta...',
 '2026-08-12 15:40:00+00',
 '{
   "call_id": "conv_77aksm31pqx0", "patient_id": "P-14",
   "started_at": "2026-08-12T15:35:00Z", "completed_at": "2026-08-12T15:40:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "patient", "third_party_authorized": null,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": false, "chest_pain_current": false,
     "shortness_of_breath_past_week": true, "shortness_of_breath_current": false,
     "palpitations_past_week": true, "palpitations_current": false,
     "dizziness_past_week": true, "fainting_past_week": false,
     "neurologic_warning_signs_current": false,
     "overall_health_worsening": true, "new_health_problem": true,
     "new_health_problem_detail": "Patient reports increased fatigue over the past week."},
   "blood_pressure": {"has_home_monitor": true, "measured_last_7_days": true, "latest_reported_value": "168/98; 160/95", "reported_high_values": true},
   "medications": {"taking_as_prescribed": true, "difficulty_getting_medications": false, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": true},
   "follow_up": {"recent_cholesterol_test": false, "pending_appointment_or_test": false, "pending_appointment_or_test_detail": null},
   "priority": {"level": "HIGH", "reason": ["overall_health_worsening = true", "reported_high_values = true"]},
   "next_best_action": "CONTACT_PATIENT",
   "summary_for_tens": "Patient reports feeling worse than last week with increased fatigue and home blood pressure readings around 168/98. Taking medications as prescribed."
 }'),

-- Síntoma reciente ya resuelto.
('P-19', 'conv_5mzq08wjr4ec', 'completed',
 'Cami: ¿Ha tenido falta de aire importante? Paciente: Sí, el lunes, pero ya se me pasó...',
 '2026-08-11 11:30:00+00',
 '{
   "call_id": "conv_5mzq08wjr4ec", "patient_id": "P-19",
   "started_at": "2026-08-11T11:26:00Z", "completed_at": "2026-08-11T11:30:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "third_party", "third_party_authorized": true,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": false, "chest_pain_current": false,
     "shortness_of_breath_past_week": true, "shortness_of_breath_current": false,
     "palpitations_past_week": false, "palpitations_current": null,
     "dizziness_past_week": false, "fainting_past_week": false,
     "neurologic_warning_signs_current": false,
     "overall_health_worsening": false, "new_health_problem": null, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": false, "measured_last_7_days": false, "latest_reported_value": null, "reported_high_values": null},
   "medications": {"taking_as_prescribed": true, "difficulty_getting_medications": false, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": false},
   "follow_up": {"recent_cholesterol_test": true, "pending_appointment_or_test": false, "pending_appointment_or_test_detail": null},
   "priority": {"level": "MEDIUM", "reason": ["shortness_of_breath_past_week = true"]},
   "next_best_action": "ROUTINE_FOLLOW_UP",
   "summary_for_tens": "Daughter reports patient had shortness of breath on Monday which has since resolved. No current symptoms."
 }'),

-- Llamada incompleta: no contesta.
('P-05', 'conv_3jd82msla09q', 'incomplete', null,
 '2026-08-13 16:10:00+00',
 '{
   "call_id": "conv_3jd82msla09q", "patient_id": "P-05",
   "started_at": "2026-08-13T16:09:00Z", "completed_at": "2026-08-13T16:10:00Z",
   "call_completed": false, "call_status": "incomplete", "call_incomplete_reason": "NO_ANSWER",
   "contact_type": null, "third_party_authorized": null,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": null, "chest_pain_current": null,
     "shortness_of_breath_past_week": null, "shortness_of_breath_current": null,
     "palpitations_past_week": null, "palpitations_current": null,
     "dizziness_past_week": null, "fainting_past_week": null,
     "neurologic_warning_signs_current": null,
     "overall_health_worsening": null, "new_health_problem": null, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": null, "measured_last_7_days": null, "latest_reported_value": null, "reported_high_values": null},
   "medications": {"taking_as_prescribed": null, "difficulty_getting_medications": null, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": null},
   "follow_up": {"recent_cholesterol_test": null, "pending_appointment_or_test": null, "pending_appointment_or_test_detail": null},
   "priority": {"level": "PENDING", "reason": []},
   "next_best_action": null, "summary_for_tens": null
 }'),

-- Control pendiente, sin síntomas.
('P-17', 'conv_9wkd01msnc4t', 'completed',
 'Cami: ¿Tiene algún control, examen u hora pendiente en el CESFAM? Paciente: Sí, tengo un examen de sangre pendiente...',
 '2026-08-11 09:15:00+00',
 '{
   "call_id": "conv_9wkd01msnc4t", "patient_id": "P-17",
   "started_at": "2026-08-11T09:12:00Z", "completed_at": "2026-08-11T09:15:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "patient", "third_party_authorized": null,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": false, "chest_pain_current": false,
     "shortness_of_breath_past_week": false, "shortness_of_breath_current": false,
     "palpitations_past_week": false, "palpitations_current": false,
     "dizziness_past_week": false, "fainting_past_week": false,
     "neurologic_warning_signs_current": false,
     "overall_health_worsening": false, "new_health_problem": false, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": true, "measured_last_7_days": true, "latest_reported_value": "132/84", "reported_high_values": false},
   "medications": {"taking_as_prescribed": true, "difficulty_getting_medications": false, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": false},
   "follow_up": {"recent_cholesterol_test": false, "pending_appointment_or_test": true, "pending_appointment_or_test_detail": "Pending blood test"},
   "priority": {"level": "MEDIUM", "reason": ["pending_appointment_or_test = true"]},
   "next_best_action": "REVIEW_PENDING_APPOINTMENT",
   "summary_for_tens": "No symptoms reported. Patient has a pending blood test and home blood pressure of 132/84."
 }'),

-- Seguimiento rutinario sin hallazgos.
('P-01', 'conv_2plq77dnsk31', 'completed',
 'Cami: Muchas gracias, doña Rosa, voy a dejar registrada la información...',
 '2026-08-10 10:45:00+00',
 '{
   "call_id": "conv_2plq77dnsk31", "patient_id": "P-01",
   "started_at": "2026-08-10T10:42:00Z", "completed_at": "2026-08-10T10:45:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "patient", "third_party_authorized": null,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": false, "chest_pain_current": false,
     "shortness_of_breath_past_week": false, "shortness_of_breath_current": false,
     "palpitations_past_week": false, "palpitations_current": false,
     "dizziness_past_week": false, "fainting_past_week": false,
     "neurologic_warning_signs_current": false,
     "overall_health_worsening": false, "new_health_problem": false, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": true, "measured_last_7_days": true, "latest_reported_value": "128/78", "reported_high_values": false},
   "medications": {"taking_as_prescribed": true, "difficulty_getting_medications": false, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": false},
   "follow_up": {"recent_cholesterol_test": true, "pending_appointment_or_test": false, "pending_appointment_or_test_detail": null},
   "priority": {"level": "LOW", "reason": []},
   "next_best_action": "NO_ACTION_REQUIRED",
   "summary_for_tens": "No symptoms, medications taken as prescribed, home blood pressure 128/78."
 }'),

-- Rutinario, con dudas del paciente (varios null).
('P-09', 'conv_6bnx44qlwe82', 'completed',
 'Cami: ¿Se ha medido la presión esta última semana? Paciente: No me acuerdo, doctora...',
 '2026-08-10 12:00:00+00',
 '{
   "call_id": "conv_6bnx44qlwe82", "patient_id": "P-09",
   "started_at": "2026-08-10T11:57:00Z", "completed_at": "2026-08-10T12:00:00Z",
   "call_completed": true, "call_status": "completed", "call_incomplete_reason": null,
   "contact_type": "patient", "third_party_authorized": null,
   "emergency": {"active": false, "type": null, "requires_immediate_escalation": false},
   "symptoms": {
     "chest_pain_past_week": false, "chest_pain_current": false,
     "shortness_of_breath_past_week": false, "shortness_of_breath_current": false,
     "palpitations_past_week": null, "palpitations_current": null,
     "dizziness_past_week": null, "fainting_past_week": false,
     "neurologic_warning_signs_current": false,
     "overall_health_worsening": false, "new_health_problem": null, "new_health_problem_detail": null},
   "blood_pressure": {"has_home_monitor": true, "measured_last_7_days": null, "latest_reported_value": null, "reported_high_values": null},
   "medications": {"taking_as_prescribed": true, "difficulty_getting_medications": false, "medication_issue": null, "medication_issue_detail": null},
   "lifestyle": {"smoked_last_7_days": false},
   "follow_up": {"recent_cholesterol_test": null, "pending_appointment_or_test": false, "pending_appointment_or_test_detail": null},
   "priority": {"level": "LOW", "reason": []},
   "next_best_action": "ROUTINE_FOLLOW_UP",
   "summary_for_tens": "No symptoms reported. Patient does not recall whether she measured her blood pressure this week."
 }');

-- Acciones ya registradas por el equipo. La de P-10 cuelga directo del
-- paciente, porque no tiene ninguna llamada asociada.
insert into acciones (llamada_id, paciente_id, tipo, nota) values
  ((select id from llamadas where conversation_id = 'conv_8fk20dhs71ma'), null, 'llamado', 'Se contactó a la familia, paciente derivado a SAPU.'),
  ((select id from llamadas where conversation_id = 'conv_3jd82msla09q'), null, 'sin_accion', 'No contesta, reintentar mañana.'),
  (null, 'P-10', 'agendado', 'Riesgo alto sin seguimiento telefónico. Se agenda llamada.');
