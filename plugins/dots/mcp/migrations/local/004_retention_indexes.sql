CREATE INDEX IF NOT EXISTS output_retained_job_range ON job_output_segments(job_id,start_offset) WHERE evicted=0;
CREATE INDEX IF NOT EXISTS output_retained_oldest ON job_output_segments(created_at,start_offset) WHERE evicted=0;
CREATE INDEX IF NOT EXISTS outbox_pending ON result_outbox(created_at) WHERE acknowledged=0;
