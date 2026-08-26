# Evaluate a RAG skill

Use this reference only when retrieval is part of the skill's claimed behavior.
Do not turn the evaluator into a general RAG framework.

1. Begin with end-to-end error discovery and classify failures as retrieval,
   reranking, context assembly, or generation.
2. Build query-to-relevant-chunk truth manually or from human-reviewed synthetic
   QA pairs. Include realistic distractors.
3. Evaluate first-pass retrieval with recall-oriented measures. For reranking,
   use precision, MRR, or NDCG only when the claim needs them. For multi-hop
   questions, check that every required chunk is present.
4. Evaluate generation faithfulness and relevance separately after retrieval is
   shown to work.
5. Treat chunking, embedding, index data, filters, and reranking as configuration
   fields. Change one controlled dimension when assigning causality.
6. Use stable local indexes and data for comparisons, then validate conclusions
   against real queries before generalizing from synthetic cases.

Keep retrieval and generation criteria separate in the suite and aggregate. A
good final answer does not prove retrieval worked, and retrieved evidence does
not prove the answer used it faithfully.
