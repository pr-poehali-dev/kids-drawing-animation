CREATE TABLE IF NOT EXISTS t_p51951279_kids_drawing_animati.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login VARCHAR(255) NOT NULL UNIQUE,
  login_type VARCHAR(10) NOT NULL CHECK (login_type IN ('phone', 'email')),
  name VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p51951279_kids_drawing_animati.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES t_p51951279_kids_drawing_animati.users(id),
  token VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '90 days'
);

CREATE TABLE IF NOT EXISTS t_p51951279_kids_drawing_animati.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
  used BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p51951279_kids_drawing_animati.sessions(token);
CREATE INDEX IF NOT EXISTS idx_otp_login ON t_p51951279_kids_drawing_animati.otp_codes(login, used);