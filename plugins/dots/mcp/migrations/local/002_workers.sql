CREATE TABLE worker_configs(job_id TEXT PRIMARY KEY REFERENCES jobs(id), config TEXT NOT NULL);
CREATE TABLE worker_controls(operation_id TEXT PRIMARY KEY, job_id TEXT NOT NULL, request_hash TEXT NOT NULL, state TEXT NOT NULL, result TEXT);
CREATE TABLE credential_rotation(generation INTEGER PRIMARY KEY, key_ref TEXT NOT NULL, state TEXT NOT NULL, created_at INTEGER NOT NULL);
