# Jobs

`exec_command` returns a durable job. Poll output independently of stdin. The final exit code, cancellation state and omitted byte ranges are separate fields. A restarted frontend does not own the executor connection.
