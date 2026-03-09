# Testing Data Pack

## Generate all sample data

```bash
bash testing/scripts/prepare_test_data.sh
```

## Generate SEC sample data only

```bash
python3 testing/scripts/fetch_sec_data.py \
  --ticker AAPL --ticker SBUX --ticker CAT \
  --recent-years 6 \
  --out-dir testing/data/sec
```

Add `--save-raw` only if you explicitly want full SEC JSON payloads.

## Generate simulated data rooms only

```bash
bash testing/scripts/generate_data_room_samples.sh
```

## Files

- Manual scenarios: `testing/manual-test-plan.md`
- Scenario inputs are described inline in `testing/manual-test-plan.md` and generated under `testing/data/`
- SEC input packs: `testing/data/sec/`
- Simulated data rooms: `testing/data/data_rooms/`
