# Partial Failure

Example: read a file; replace exact text with its SHA and stepKey="edit-title"; start a test command with stepKey="test-build"; return the receipt and job ID. If a later step fails, inspect child receipts before a new continuation. Repeating the parent key retrieves the existing result.
