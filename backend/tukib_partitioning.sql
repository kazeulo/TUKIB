DO $$
DECLARE
    next_quarter_start DATE;
    next_quarter_end DATE;
    partition_name TEXT;
BEGIN
    -- Calculate first day of the next quarter
    next_quarter_start := 
        date_trunc('quarter', CURRENT_DATE) + INTERVAL '3 months';

    -- Calculate first day of the quarter after next quarter
    next_quarter_end := next_quarter_start + INTERVAL '3 months';

    -- Format partition name, e.g. serviceRequestTable_2025_Q2
    partition_name := format('serviceRequestTable_%s_Q%s',
                            to_char(next_quarter_start, 'YYYY'),
                            extract(quarter from next_quarter_start));

    -- Create partition for that quarter
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I PARTITION OF serviceRequestTable
        FOR VALUES FROM (%L) TO (%L);',
        partition_name, next_quarter_start, next_quarter_end);

    RAISE NOTICE 'Partition % created for range % to %', partition_name, next_quarter_start, next_quarter_end;
END $$;
