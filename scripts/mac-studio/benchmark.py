#!/usr/bin/env python3
"""Summarize owner-recorded trials; never starts builds or simulators."""
import argparse
import csv
import math
from common import emit

FIELDS = {'mode', 'jobs', 'completed', 'seconds', 'failures', 'pressure', 'responsive'}


def summarize(rows):
    summary = []
    for row in rows:
        if not FIELDS <= row.keys():
            raise ValueError('missing CSV fields: ' + ', '.join(sorted(FIELDS - row.keys())))
        jobs, completed, failures = (int(row[k]) for k in ('jobs', 'completed', 'failures'))
        seconds = float(row['seconds'])
        if jobs < 1 or completed < 0 or failures < 0 or seconds <= 0 or not math.isfinite(seconds):
            raise ValueError('invalid trial numbers')
        if row['pressure'] not in {'normal', 'warning', 'critical'} or row['responsive'] not in {'yes', 'no'}:
            raise ValueError('pressure must be normal/warning/critical; responsive must be yes/no')
        summary.append({'mode': row['mode'], 'jobs': jobs, 'jobs_per_minute': 60 * completed / seconds,
                        'healthy': failures == 0 and completed > 0 and row['pressure'] == 'normal' and row['responsive'] == 'yes'})
    return summary


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('csv')
    a = p.parse_args()
    try:
        with open(a.csv, newline='') as source:
            emit(summarize(list(csv.DictReader(source))))
    except (OSError, ValueError) as error:
        p.error(str(error))


if __name__ == '__main__':
    main()
