INSERT INTO public.cars (registration_number, manufacture_year, brand, model, license_plate)
VALUES
    ('DEMO-001', 2024, 'Fiat', 'Argo', 'ABC1D23'),
    ('DEMO-002', 2025, 'Hyundai', 'HB20', 'DEF4G56'),
    ('DEMO-003', 2023, 'Volkswagen', 'Polo', 'GHI7J89')
ON CONFLICT DO NOTHING;
