-- Interlude: datos sintéticos de prueba
-- Correr después de schema.sql. Todos los datos son ficticios.

insert into cesfams (id, nombre, comuna) values
  ('C-01', 'CESFAM La Florida', 'La Florida'),
  ('C-02', 'CESFAM Puente Alto', 'Puente Alto'),
  ('C-03', 'CESFAM Independencia', 'Independencia');

-- Nota sobre los casos deliberados:
--   P-05  -> riesgo moderado, último control hace más de 5 meses (2026-02-10)
--   P-10  -> riesgo alto, sin llamadas registradas (no aparece en tabla llamadas)
--   P-14  -> HTA y DM2 a la vez
--   resto -> pacientes sin nada particular

insert into pacientes
  (id, cesfam_id, edad, sexo, patologias, riesgo, fase, ultimo_control, proximo_control, ultima_llamada, telefono_hash, contacto_emergencia)
values
  ('P-01', 'C-01', 68, 'F', array['HTA'],           'moderado', 'compensado',      '2026-06-02', '2026-12-02', '2026-08-05 10:15:00+00', '2ad7f0d1555417872d9bf79cda0d2e7c2fcd5accfde92e7f9b72818944308e', false),
  ('P-02', 'C-01', 74, 'M', array['HTA', 'DLP'],    'alto',     'en_compensacion', '2026-05-20', '2026-08-20', '2026-08-01 09:30:00+00', 'ab4a628937c6ccf4d16a14bf36839715e37258be76d79c0fc00cbed6f58c2c', false),
  ('P-03', 'C-01', 59, 'F', array['DM2'],           'bajo',     'compensado',      '2026-04-18', '2026-10-18', '2026-07-28 14:00:00+00', 'ccb57841cfb719161156c6d1c6b416c3e42db49d5647a397481261fdf3527e', false),
  ('P-04', 'C-01', 81, 'M', array['HTA', 'DM2'],    'alto',     'en_compensacion', '2026-06-30', '2026-09-30', '2026-08-10 11:45:00+00', '5cddb37a1d838577bfefa2340186549027a082c556502f2615ff2d722f5cb4', true),
  ('P-05', 'C-01', 63, 'F', array['HTA'],           'moderado', 'en_compensacion', '2026-02-10', '2026-08-10', '2026-02-12 16:20:00+00', '17f72ceed2bbaa988b26381540bc7a42cde30b0787292dc9fc7425d1518f3f', false),
  ('P-06', 'C-01', 55, 'M', array['DLP'],           'bajo',     'compensado',      '2026-07-01', '2027-01-01', '2026-07-15 08:50:00+00', '473e2e2f706c2b0c0abe56ee8d766cc30f5f225b3c3f4d22608728efc76f1f', false),
  ('P-07', 'C-01', 77, 'F', array['HTA', 'DM2'],    'alto',     'compensado',      '2026-07-22', '2026-10-22', '2026-08-03 13:10:00+00', 'ddc135c565c70bbcd90959b224c52900857bcfdddc2f7885d321ff9e8c6134', false),

  ('P-08', 'C-02', 52, 'M', array['DM2'],           'moderado', 'compensado',      '2026-05-05', '2026-11-05', '2026-07-20 10:00:00+00', '3d57565e9ae98cc5fec0ab4fb3dcee0d9015ecdfbac8752aee8d7e586ca53e', false),
  ('P-09', 'C-02', 69, 'F', array['HTA'],           'bajo',     'compensado',      '2026-06-14', '2026-12-14', '2026-08-06 09:00:00+00', 'ab8185b2124bfff47c70625e2fb439ad2d79c4622a40bbc27d3dd43efb96701', false),
  ('P-10', 'C-02', 85, 'M', array['HTA', 'DLP'],    'alto',     'en_compensacion', '2026-06-25', '2026-09-25', null,                     '8625b35ded84499e59542c3f0a4c382950a332f173c3353a3182e29ccdfaf6', true),
  ('P-11', 'C-02', 60, 'F', array['DM2'],           'moderado', 'compensado',      '2026-05-30', '2026-11-30', '2026-07-30 15:30:00+00', 'e7eb8ef89fa7b9f7668833516b44c76fad675171bc8c3c34122049e2dcfcd54', false),
  ('P-12', 'C-02', 71, 'M', array['HTA'],           'alto',     'compensado',      '2026-07-10', '2026-10-10', '2026-08-09 12:00:00+00', '8eed979191f61ea30237d1cb9ce2ad2164251841ccfd08851a4e4f227f8fed', false),
  ('P-13', 'C-02', 57, 'F', array['DLP'],           'bajo',     'compensado',      '2026-07-05', '2027-01-05', '2026-07-25 11:20:00+00', 'e76aea0470cac6f2465e5c9a15f13e81789dbf6400c2e260fa992ba1dbda2d', false),
  ('P-14', 'C-02', 66, 'M', array['HTA', 'DM2'],    'alto',     'en_compensacion', '2026-06-18', '2026-09-18', '2026-08-04 09:45:00+00', '08e4215a3ee9071db8fa5ec48b958b4f83ddb2994fb87b8894b81b9328222c4', true),

  ('P-15', 'C-03', 50, 'F', array['DM2'],           'bajo',     'compensado',      '2026-06-08', '2026-12-08', '2026-08-02 10:30:00+00', 'b31356366bb087a0297b59716c2f7dc8a3931ea83dc997a79c0df04100045f', false),
  ('P-16', 'C-03', 79, 'M', array['HTA', 'DLP'],    'alto',     'compensado',      '2026-07-16', '2026-10-16', '2026-08-11 14:15:00+00', 'be0544f46db3ef4e1f1f1c68b8a15da48a064164c34943eed9a8b4f38a0f30', false),
  ('P-17', 'C-03', 64, 'F', array['HTA'],           'moderado', 'compensado',      '2026-05-25', '2026-11-25', '2026-07-22 16:00:00+00', '7a2e7e7c70b9b3f0df5010cd1aa2129079505321aa00c7a5645d556c42e81a0', false),
  ('P-18', 'C-03', 73, 'M', array['DM2'],           'moderado', 'en_compensacion', '2026-06-20', '2026-12-20', '2026-08-07 08:40:00+00', '208eb18310b2ed88db02ed54c238213d7b02f80172cf5ab66d96697415c6119', false),
  ('P-19', 'C-03', 82, 'F', array['HTA', 'DM2'],    'alto',     'en_compensacion', '2026-07-01', '2026-10-01', '2026-08-12 09:10:00+00', '83fceafc7bd48cbc44bed750c4d4d83b87e7267e7c49e5aa95520d1924b2161', true),
  ('P-20', 'C-03', 56, 'M', array['DLP'],           'bajo',     'compensado',      '2026-06-29', '2026-12-29', '2026-07-31 13:50:00+00', '30c45b3503c66c4533fc0c8a1d6012b0368d46f9b7400d9534bff6c79988de', false);
