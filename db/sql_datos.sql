SET NAMES utf8mb4;
START TRANSACTION;

-- =========================
-- WORKERS
-- =========================
INSERT INTO workers (dni, names, role, work_area, shift)
VALUES (41234567, 'Luis Alberto Rojas Paredes', 'Almacén', 'Herramientas', 1),
       (45678912, 'María Fernanda Torres Salazar', 'Técnico', 'Mantenimiento', 0),
       (47890123, 'Carlos Eduardo Mejía Rivas', 'Supervisor', 'Operaciones', 1),
       (40123456, 'Ana Lucía Herrera Soto', 'Técnico', 'Electricidad', 0),
       (43567890, 'Jorge Miguel Cárdenas León', 'Almacén', 'Recepción', 1),
       (48901234, 'Sofía Valeria Núñez Prado', 'Técnico', 'Carpintería', 0),
       (42345678, 'Diego Andrés Montalvo Cruz', 'Operaciones', 'Campo', 1),
       (46789012, 'Patricia Elena Vega Castillo', 'Soporte', 'Inventario', 0);

-- =========================
-- CREDENTIALS
-- =========================
INSERT INTO credentials (`id_user`, `user`, `pass`, `enable`, `creation_date`, `id_worker`)
VALUES (1, 'admin_cmejia', 'Admin2026!', 1, '2026-01-05', 47890123),
       (2, 'almacen_lrojas', 'Almacen2026!', 1, '2026-01-06', 41234567),
       (3, 'tec_mtsalazar', 'Tec2026!', 1, '2026-01-06', 45678912),
       (4, 'tec_alucas', 'Tec2026!', 1, '2026-01-07', 40123456),
       (5, 'almacen_jcleon', 'Almacen2026!', 1, '2026-01-08', 43567890),
       (6, 'tec_svnp', 'Tec2026!', 1, '2026-01-09', 48901234),
       (7, 'op_damc', 'Op2026!', 1, '2026-01-10', 42345678),
       (8, 'soporte_pevc', 'Soporte2026!', 1, '2026-01-11', 46789012);

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id_roles, role)
VALUES (1, 'Administrador'),
       (2, 'Almacén'),
       (3, 'Técnico'),
       (4, 'Supervisor');

-- =========================
-- ASSIGNED ROLES
-- =========================
INSERT INTO asigned_roles (user_id, roles_id)
VALUES (1, 1),
       (1, 4),
       (2, 2),
       (2, 4),
       (3, 3),
       (4, 3),
       (5, 2),
       (6, 3),
       (7, 4),
       (8, 2);

-- =========================
-- BRANDS
-- =========================
INSERT INTO brands (id_brand, brand)
VALUES (1, 'Bosch'),
       (2, 'Makita'),
       (3, 'DeWalt'),
       (4, 'Stanley'),
       (5, 'Truper'),
       (6, 'Klein Tools'),
       (7, 'Karcher'),
       (8, 'Fluke'),
       (9, 'Irwin'),
       (10, 'Lincoln'),
       (11, 'Miller');

-- =========================
-- PROVIDERS
-- =========================
INSERT INTO provider (id_provider, provaider, addres)
VALUES (1, 'Ferremax Perú SAC', 'Av. Argentina 1542, Lima'),
       (2, 'Suministros Industriales Andina SAC', 'Av. Nicolás Arriola 2480, Lima'),
       (3, 'Corporación Herramientas del Sur EIRL', 'Av. Ejército 701, Arequipa'),
       (4, 'Distribuidora Técnica Norte SAC', 'Jr. Cusco 410, Trujillo');

-- =========================
-- STORAGES
-- =========================
INSERT INTO storages (id_storage, addres)
VALUES (1, 'Almacén Central - Lima'),
       (2, 'Taller de Mantenimiento'),
       (3, 'Depósito de Campo'),
       (4, 'Sala de Herramientas Eléctricas');

-- =========================
-- MODELS
-- =========================
INSERT INTO models (id_model, model, kind_of_tool, id_brand)
VALUES (1, 'GSR 120-LI', 'Taladro inalámbrico', 1),
       (2, 'GA4530', 'Esmeril angular', 2),
       (3, 'DWE560', 'Sierra circular', 3),
       (4, 'FMHT0-74880', 'Cinta métrica', 4),
       (5, 'MUL-600', 'Multímetro digital', 5),
       (6, '69142', 'Juego de destornilladores', 6),
       (7, 'WD 3', 'Aspiradora industrial', 7),
       (8, '15B+', 'Multímetro profesional', 8),
       (9, 'VISE-GRIP', 'Alicate de presión', 9),
       (10, 'Power MIG 140', 'Soldadora inverter', 10),
       (11, 'GLL 2-15', 'Nivel láser', 1),
       (12, 'DCH273', 'Rotomartillo', 3),
       (13, 'Multimatic 215', 'Soldadora multiproceso', 11),
       (14, 'PISA-10', 'Pistola de calor', 5),
       (15, 'TLM99', 'Medidor láser', 4);

-- =========================
-- RECEIPTS
-- =========================
INSERT INTO receipts (id_receipt, receipt_img_url, id_provider)
VALUES (1, '/uploads/receipts/2025/rcp-001.jpg', 1),
       (2, '/uploads/receipts/2025/rcp-002.jpg', 1),
       (3, '/uploads/receipts/2025/rcp-003.jpg', 2),
       (4, '/uploads/receipts/2025/rcp-004.jpg', 2),
       (5, '/uploads/receipts/2025/rcp-005.jpg', 3),
       (6, '/uploads/receipts/2025/rcp-006.jpg', 3),
       (7, '/uploads/receipts/2025/rcp-007.jpg', 4),
       (8, '/uploads/receipts/2025/rcp-008.jpg', 4),
       (9, '/uploads/receipts/2025/rcp-009.jpg', 1),
       (10, '/uploads/receipts/2025/rcp-010.jpg', 2);

-- =========================
-- LOCKERS
-- =========================
INSERT INTO locker (id_locker, locker, id_storage)
VALUES (1, 'A-01', 1),
       (2, 'A-02', 1),
       (3, 'B-01', 2),
       (4, 'B-02', 2),
       (5, 'C-01', 3),
       (6, 'C-02', 3),
       (7, 'D-01', 4),
       (8, 'D-02', 4);

-- =========================
-- TOOLS
-- =========================
INSERT INTO tools
(id_tool, serial, inv_code, state, oos_reason, purchase_cost, purchase_date, oss_responsable, id_model, id_receipt,
 id_storage)
VALUES (1, 'BOS-GSR120-24001', 'INV-0001', 'loaned', NULL, 289.90, '2025-10-12', 1, 1, 1, 4),
       (2, 'MAK-GA4530-24002', 'INV-0002', 'available', NULL, 179.50, '2025-09-20', 2, 2, 2, 1),
       (3, 'DWT-DWE560-24003', 'INV-0003', 'loaned', NULL, 410.00, '2025-11-03', 1, 3, 3, 3),
       (4, 'STN-FMHT-24004', 'INV-0004', 'available', NULL, 18.90, '2025-08-15', 5, 4, 4, 1),
       (5, 'TRP-MUL600-24005', 'INV-0005', 'maintenance', 'Calibración pendiente', 86.00, '2025-12-01', 8, 5, 5, 2),
       (6, 'KLE-69142-24006', 'INV-0006', 'available', NULL, 64.75, '2025-07-24', 2, 6, 6, 1),
       (7, 'KCH-WD3-24007', 'INV-0007', 'available', NULL, 349.00, '2025-06-10', 8, 7, 7, 2),
       (8, 'FLK-15B-24008', 'INV-0008', 'loaned', NULL, 589.00, '2025-10-28', 1, 8, 8, 4),
       (9, 'IRW-VG-24009', 'INV-0009', 'repair', 'Motor quemado', 27.40, '2025-05-19', 7, 9, 9, 3),
       (10, 'LNC-PM140-24010', 'INV-0010', 'available', NULL, 1299.00, '2025-11-18', 1, 10, 10, 3),
       (11, 'BOS-GLL2-24011', 'INV-0011', 'loaned', NULL, 459.00, '2025-12-05', 1, 11, 1, 4),
       (12, 'DWT-DCH273-24012', 'INV-0012', 'available', NULL, 1129.00, '2025-10-03', 4, 12, 2, 3),
       (13, 'MIL-215-24013', 'INV-0013', 'available', NULL, 1899.00, '2025-09-28', 1, 13, 3, 2),
       (14, 'TRP-PISA10-24014', 'INV-0014', 'out_of_service', 'Resistencia dañada', 72.00, '2025-08-22', 6, 14, 4, 1),
       (15, 'STN-TLM99-24015', 'INV-0015', 'available', NULL, 499.00, '2025-11-30', 5, 15, 5, 4),
       (16, 'BOS-GSR120-24016', 'INV-0016', 'available', NULL, 305.00, '2025-12-07', 1, 1, 6, 1),
       (17, 'MAK-GA4530-24017', 'INV-0017', 'loaned', NULL, 182.00, '2025-07-01', 2, 2, 7, 2),
       (18, 'DWT-DWE560-24018', 'INV-0018', 'available', NULL, 425.00, '2025-10-25', 4, 3, 8, 3),
       (19, 'KCH-WD3-24019', 'INV-0019', 'maintenance', 'Filtro saturado', 359.00, '2025-11-11', 8, 7, 9, 2),
       (20, 'FLK-15B-24020', 'INV-0020', 'available', NULL, 615.00, '2025-12-11', 1, 8, 10, 4);

-- =========================
-- LOANS
-- =========================
INSERT INTO loans (id_loan, loanTo, loanBy, reason)
VALUES (1, 41234567, 2, 1),
       (2, 45678912, 1, 1),
       (3, 40123456, 2, 1),
       (4, 48901234, 1, 1),
       (5, 42345678, 4, 1),
       (6, 46789012, 8, 0),
       (7, 43567890, 1, 1),
       (8, 41234567, 2, 0),
       (9, 45678912, 4, 1),
       (10, 42345678, 1, 1);

-- =========================
-- TOOLS_LOANS
-- =========================
INSERT INTO tools_loans
(id_tool, id_loan, start_tool_state, end_tool_state, loan_start, loan_end)
VALUES (1, 1, '2026-02-01 08:00:00', '2026-02-05 17:30:00', '2026-02-01 08:00:00', '2026-02-05 17:30:00'),
       (3, 1, '2026-02-01 08:00:00', '2026-02-05 17:30:00', '2026-02-01 08:00:00', '2026-02-05 17:30:00'),
       (2, 2, '2026-02-03 09:00:00', '2026-02-04 18:00:00', '2026-02-03 09:00:00', '2026-02-04 18:00:00'),
       (4, 2, '2026-02-03 09:00:00', '2026-02-04 18:00:00', '2026-02-03 09:00:00', '2026-02-04 18:00:00'),
       (11, 3, '2026-02-06 08:15:00', '2026-02-10 19:00:00', '2026-02-06 08:15:00', '2026-02-10 19:00:00'),
       (12, 4, '2026-02-07 08:00:00', '2026-02-08 16:45:00', '2026-02-07 08:00:00', '2026-02-08 16:45:00'),
       (13, 4, '2026-02-07 08:00:00', '2026-02-08 16:45:00', '2026-02-07 08:00:00', '2026-02-08 16:45:00'),
       (5, 5, '2026-02-12 07:45:00', '2026-02-14 17:00:00', '2026-02-12 07:45:00', '2026-02-14 17:00:00'),
       (8, 6, '2026-02-15 09:10:00', '2026-02-16 18:10:00', '2026-02-15 09:10:00', '2026-02-16 18:10:00'),
       (17, 7, '2026-02-18 08:30:00', '2026-02-20 17:20:00', '2026-02-18 08:30:00', '2026-02-20 17:20:00'),
       (6, 8, '2026-02-21 08:00:00', '2026-02-22 12:00:00', '2026-02-21 08:00:00', '2026-02-22 12:00:00'),
       (7, 8, '2026-02-21 08:00:00', '2026-02-22 12:00:00', '2026-02-21 08:00:00', '2026-02-22 12:00:00'),
       (18, 9, '2026-02-24 09:00:00', '2026-02-26 18:00:00', '2026-02-24 09:00:00', '2026-02-26 18:00:00'),
       (9, 10, '2026-02-27 08:00:00', '2026-03-01 19:00:00', '2026-02-27 08:00:00', '2026-03-01 19:00:00'),
       (20, 10, '2026-02-27 08:00:00', '2026-03-01 19:00:00', '2026-02-27 08:00:00', '2026-03-01 19:00:00');

COMMIT;