# Search

Use a literal search unless regex is necessary. `search.start({path:".",pattern:"Portal",kind:"literal",fileGlob:"**/*.ts"})` returns a durable search ID. Poll `search.read` until complete; retain source hashes and truncation.
