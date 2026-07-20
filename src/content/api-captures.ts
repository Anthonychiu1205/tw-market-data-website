// REAL captured 200 responses from the public read API, one per dataset. Captured by calling
// https://api.twmarketdata.com/v2/datasets/<slug> directly — every byte below came back from the API.
//
// WHY PER-DATASET AND NOT ONE TEMPLATE (this is the whole point of this file):
// the envelope is NOT uniform. Across the 23 datasets captured here the row array is `data` (17),
// `rows` (4) or `items` (2), and there are nine distinct top-level shapes. Provenance differs too —
// twse/tpex-daily-price expose a singular top-level `source_role`, while the dominant shape exposes
// `lineage.source_roles` (plural, array). None of that is normalized here: each dataset shows its own
// real shape, because normalizing would be inventing a contract the API does not honour.
//
// A dataset ABSENT from this map has not been captured (it needs an entitled sk_live_ key, or its
// required parameters are not yet known). Those pages must show an honest TODO — never a template.
//
// zh  = the captured body, verbatim (values trimmed only by row count; see TRIM below).
// en  = present only when the captured body contains Chinese DATA VALUES. It is the same JSON with
//       those values replaced by a marker, so /en stays CJK-free without inventing English data that
//       the API never returned. When absent, the body is already ASCII and `zh` is used for both.
//
// TRIM: row arrays are capped at 2 entries and other arrays at 3, purely for page length. Keys,
// nesting, types and values are otherwise untouched.
//
// To re-capture: curl "https://api.twmarketdata.com/v2/datasets/<slug>?symbol=2330&limit=2"

export type ApiCapture = {
  // The key holding the row array in THIS dataset's envelope: "data" | "rows" | "items", or null when
  // the response has no row array at all. Never assume one dataset's key applies to another.
  rowsKey: string | null;
  envelopeKeys: string[];
  zh: string;
  en?: string;
};

export const API_CAPTURED_AT = "2026-07-20";

export const API_CAPTURES: Record<string, ApiCapture> = {
  "bond-convertible-reference": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "bond_convertible_reference",
  "request_context": {
    "scope": "bond_convertible_reference_latest_snapshot_only",
    "coverage_type": "latest_snapshot_only",
    "filters": {
      "bond_code": null,
      "market": null,
      "issuer": null,
      "underlying_ticker": null,
      "source_family": null,
      "limit": 2
    }
  },
  "quality": {
    "row_count": 2,
    "bond_code_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "tpex_official"
    ],
    "source_roles": [
      "bond_convertible_reference_issuance_master"
    ],
    "source_families": [
      "bond_ISSBD5_data"
    ]
  },
  "error": null,
  "data": [
    {
      "bond_code": "11011",
      "market": "TPEx",
      "bond_name": "台泥一永",
      "issuer": "台泥",
      "bond_type": "5",
      "issue_date": "2024-12-10",
      "maturity_date": "2029-12-10",
      "coupon_rate": 0.0,
      "conversion_terms": {
        "Currency": "1",
        "SeriesNumber": "1",
        "PutOptionDate": "20271210",
        "OfferingMethod": "7",
        "PutOptionPrice": "100.0000",
        "PrincipalRepayment": "1",
        "Conversion/ExchangePeriodEndDate": "20291210",
        "Conversion/ExchangePeriodStartDate": "20250311",
        "Conversion/ExchangePriceAtIssuance": "36.5000"
      },
      "underlying_ticker": null,
      "source_provider": "tpex_official",
      "source_role": "bond_convertible_reference_issuance_master",
      "source_family": "bond_ISSBD5_data",
      "lineage": {
        "v1_scope": "clean_bondcode_reference_only",
        "source_url": "https://www.tpex.org.tw/openapi/v1/bond_ISSBD5_data",
        "issuer_code": "1101",
        "source_date": "20260605",
        "source_index": 2,
        "series_number": "1",
        "tranche_number": null
      },
      "data_gaps": [
        "underlying_ticker_not_provided"
      ],
      "not_investment_advice": true
    },
    {
      "bond_code": "12561",
      "market": "TPEx",
      "bond_name": "鮮活果汁一KY",
      "issuer": "鮮活果汁-KY",
      "bond_type": "5",
      "issue_date": "2025-10-08",
      "maturity_date": "2028-10-08",
      "coupon_rate": 0.0,
      "conversion_terms": {
        "Currency": "1",
        "SeriesNumber": "1",
        "PutOptionDate": "20271008",
        "OfferingMethod": "7",
        "PutOptionPrice": "100.5006",
        "PrincipalRepayment": "1",
        "Conversion/ExchangePeriodEndDate": "20281008",
        "Conversion/ExchangePeriodStartDate": "20260109",
        "Conversion/ExchangePriceAtIssuance": "190.0000"
      },
      "underlying_ticker": null,
      "source_provider": "tpex_official",
      "source_role": "bond_convertible_reference_issuance_master",
      "source_family": "bond_ISSBD5_data",
      "lineage": {
        "v1_scope": "clean_bondcode_reference_only",
        "source_url": "https://www.tpex.org.tw/openapi/v1/bond_ISSBD5_data",
        "issuer_code": "1256",
        "source_date": "20260605",
        "source_index": 3,
        "series_number": "1",
        "tranche_number": null
      },
      "data_gaps": [
        "underlying_ticker_not_provided"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "clean_bondcode_reference_only",
    "latest_snapshot_only",
    "blank_or_placeholder_bondcode_rows_excluded"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "bond_convertible_reference",
    "scope": "bond_convertible_reference_latest_snapshot_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "bond_convertible_reference",
  "request_context": {
    "scope": "bond_convertible_reference_latest_snapshot_only",
    "coverage_type": "latest_snapshot_only",
    "filters": {
      "bond_code": null,
      "market": null,
      "issuer": null,
      "underlying_ticker": null,
      "source_family": null,
      "limit": 2
    }
  },
  "quality": {
    "row_count": 2,
    "bond_code_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "tpex_official"
    ],
    "source_roles": [
      "bond_convertible_reference_issuance_master"
    ],
    "source_families": [
      "bond_ISSBD5_data"
    ]
  },
  "error": null,
  "data": [
    {
      "bond_code": "11011",
      "market": "TPEx",
      "bond_name": "<Chinese value - see the zh page>",
      "issuer": "<Chinese value - see the zh page>",
      "bond_type": "5",
      "issue_date": "2024-12-10",
      "maturity_date": "2029-12-10",
      "coupon_rate": 0.0,
      "conversion_terms": {
        "Currency": "1",
        "SeriesNumber": "1",
        "PutOptionDate": "20271210",
        "OfferingMethod": "7",
        "PutOptionPrice": "100.0000",
        "PrincipalRepayment": "1",
        "Conversion/ExchangePeriodEndDate": "20291210",
        "Conversion/ExchangePeriodStartDate": "20250311",
        "Conversion/ExchangePriceAtIssuance": "36.5000"
      },
      "underlying_ticker": null,
      "source_provider": "tpex_official",
      "source_role": "bond_convertible_reference_issuance_master",
      "source_family": "bond_ISSBD5_data",
      "lineage": {
        "v1_scope": "clean_bondcode_reference_only",
        "source_url": "https://www.tpex.org.tw/openapi/v1/bond_ISSBD5_data",
        "issuer_code": "1101",
        "source_date": "20260605",
        "source_index": 2,
        "series_number": "1",
        "tranche_number": null
      },
      "data_gaps": [
        "underlying_ticker_not_provided"
      ],
      "not_investment_advice": true
    },
    {
      "bond_code": "12561",
      "market": "TPEx",
      "bond_name": "<Chinese value - see the zh page>",
      "issuer": "<Chinese value - see the zh page>",
      "bond_type": "5",
      "issue_date": "2025-10-08",
      "maturity_date": "2028-10-08",
      "coupon_rate": 0.0,
      "conversion_terms": {
        "Currency": "1",
        "SeriesNumber": "1",
        "PutOptionDate": "20271008",
        "OfferingMethod": "7",
        "PutOptionPrice": "100.5006",
        "PrincipalRepayment": "1",
        "Conversion/ExchangePeriodEndDate": "20281008",
        "Conversion/ExchangePeriodStartDate": "20260109",
        "Conversion/ExchangePriceAtIssuance": "190.0000"
      },
      "underlying_ticker": null,
      "source_provider": "tpex_official",
      "source_role": "bond_convertible_reference_issuance_master",
      "source_family": "bond_ISSBD5_data",
      "lineage": {
        "v1_scope": "clean_bondcode_reference_only",
        "source_url": "https://www.tpex.org.tw/openapi/v1/bond_ISSBD5_data",
        "issuer_code": "1256",
        "source_date": "20260605",
        "source_index": 3,
        "series_number": "1",
        "tranche_number": null
      },
      "data_gaps": [
        "underlying_ticker_not_provided"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "clean_bondcode_reference_only",
    "latest_snapshot_only",
    "blank_or_placeholder_bondcode_rows_excluded"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "bond_convertible_reference",
    "scope": "bond_convertible_reference_latest_snapshot_only",
    "row_count": 2
  }
}`,
  },
  "broker-branch-reference": {
    rowsKey: "data",
    envelopeKeys: ["api_version", "data", "data_as_of", "data_count", "dataset", "dataset_id", "dataset_version", "error", "known_gaps", "lineage", "quality", "release_date", "release_version", "request_context", "warnings"],
    zh: `{
  "api_version": "v2",
  "dataset": "broker_branch_reference",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-07-20.preview",
  "release_date": "2026-07-20",
  "data_as_of": "2026-07-20",
  "request_context": {
    "ticker": "犇亞",
    "as_of_date": "2026-07-20",
    "family": "discovery_reference",
    "field_group_type": "canonical",
    "dataset_view": "broker_branch_reference_v1",
    "source_table": "broker_branch_reference_items",
    "scope": "broker_branch_reference_only",
    "coverage_type": "current_reference_snapshot",
    "supported_sort_by": [
      "parent_broker_code",
      "branch_code"
    ],
    "supported_filter_fields": [
      "parent_broker_code",
      "branch_code",
      "parent_broker_name"
    ],
    "parent_broker_count": 52,
    "branch_count": 811,
    "market_filter": "TWSE",
    "source_provider_filter": null,
    "source_role_filter": null,
    "source_family_filter": null
  },
  "data": [
    {
      "parent_broker_code": "犇亞",
      "parent_broker_name": "犇亞",
      "branch_code": "601T",
      "branch_name": "自營",
      "market": "TWSE",
      "address": "台北市松山區復興北路99號3樓",
      "source_provider": "twse_official",
      "source_role": "official_twse_broker_branch_reference",
      "source_family": "official_twse_broker_branch_reference",
      "source_lineage": {
        "open_date": "830923",
        "branch_code": "601T",
        "broker_code": "&#29319;亞",
        "source_date": "1150608",
        "source_role": "official_twse_broker_branch_reference",
        "source_family": "official_twse_broker_branch_reference",
        "source_tables": {
          "broker_list": "brokerService/brokerList",
          "sec_reg_data": "brokerService/secRegData",
          "branch_reference": "opendata/OpenData_BRK02"
        },
        "raw_branch_name": "&#29319;亞-自營",
        "source_provider": "twse_official",
        "broker_id_source": "derived_from_branch_name",
        "source_canonical": "official_twse_broker_branch_reference",
        "branch_name_guess": "自營",
        "broker_name_guess": "&#29319;亞"
      },
      "data_gaps": []
    },
    {
      "parent_broker_code": "犇亞",
      "parent_broker_name": "犇亞",
      "branch_code": "601d",
      "branch_name": "鑫豐",
      "market": "TWSE",
      "address": "台北市松山區復興北路99號4樓之5",
      "source_provider": "twse_official",
      "source_role": "official_twse_broker_branch_reference",
      "source_family": "official_twse_broker_branch_reference",
      "source_lineage": {
        "open_date": "1080102",
        "branch_code": "601d",
        "broker_code": "&#29319;亞",
        "source_date": "1150608",
        "source_role": "official_twse_broker_branch_reference",
        "source_family": "official_twse_broker_branch_reference",
        "source_tables": {
          "broker_list": "brokerService/brokerList",
          "sec_reg_data": "brokerService/secRegData",
          "branch_reference": "opendata/OpenData_BRK02"
        },
        "raw_branch_name": "&#29319;亞-鑫豐",
        "source_provider": "twse_official",
        "broker_id_source": "derived_from_branch_name",
        "source_canonical": "official_twse_broker_branch_reference",
        "branch_name_guess": "鑫豐",
        "broker_name_guess": "&#29319;亞"
      },
      "data_gaps": []
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-07-20",
    "completeness_ratio": 1.0,
    "quality_status": "ready"
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "broker_branch_reference_items",
    "fallback_chain": [
      "brokerService/brokerList",
      "brokerService/secRegData",
      "opendata/OpenData_BRK02"
    ],
    "policy_notes": [
      "reference_only",
      "not_investment_advice",
      "not_trading_activity_coverage"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "broker_branch_reference",
    "request_id": "read-api-20260720",
    "blocking_gate": null
  },
  "dataset_id": "broker_branch_reference",
  "data_count": 2,
  "known_gaps": [
    "not_investment_advice",
    "not_trading_activity_coverage",
    "reference_only"
  ],
  "warnings": [
    "not_investment_advice",
    "reference_only",
    "not_trading_activity_coverage"
  ]
}`,
    en: `{
  "api_version": "v2",
  "dataset": "broker_branch_reference",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-07-20.preview",
  "release_date": "2026-07-20",
  "data_as_of": "2026-07-20",
  "request_context": {
    "ticker": "<Chinese value - see the zh page>",
    "as_of_date": "2026-07-20",
    "family": "discovery_reference",
    "field_group_type": "canonical",
    "dataset_view": "broker_branch_reference_v1",
    "source_table": "broker_branch_reference_items",
    "scope": "broker_branch_reference_only",
    "coverage_type": "current_reference_snapshot",
    "supported_sort_by": [
      "parent_broker_code",
      "branch_code"
    ],
    "supported_filter_fields": [
      "parent_broker_code",
      "branch_code",
      "parent_broker_name"
    ],
    "parent_broker_count": 52,
    "branch_count": 811,
    "market_filter": "TWSE",
    "source_provider_filter": null,
    "source_role_filter": null,
    "source_family_filter": null
  },
  "data": [
    {
      "parent_broker_code": "<Chinese value - see the zh page>",
      "parent_broker_name": "<Chinese value - see the zh page>",
      "branch_code": "601T",
      "branch_name": "<Chinese value - see the zh page>",
      "market": "TWSE",
      "address": "<Chinese value - see the zh page>",
      "source_provider": "twse_official",
      "source_role": "official_twse_broker_branch_reference",
      "source_family": "official_twse_broker_branch_reference",
      "source_lineage": {
        "open_date": "830923",
        "branch_code": "601T",
        "broker_code": "<Chinese value - see the zh page>",
        "source_date": "1150608",
        "source_role": "official_twse_broker_branch_reference",
        "source_family": "official_twse_broker_branch_reference",
        "source_tables": {
          "broker_list": "brokerService/brokerList",
          "sec_reg_data": "brokerService/secRegData",
          "branch_reference": "opendata/OpenData_BRK02"
        },
        "raw_branch_name": "<Chinese value - see the zh page>",
        "source_provider": "twse_official",
        "broker_id_source": "derived_from_branch_name",
        "source_canonical": "official_twse_broker_branch_reference",
        "branch_name_guess": "<Chinese value - see the zh page>",
        "broker_name_guess": "<Chinese value - see the zh page>"
      },
      "data_gaps": []
    },
    {
      "parent_broker_code": "<Chinese value - see the zh page>",
      "parent_broker_name": "<Chinese value - see the zh page>",
      "branch_code": "601d",
      "branch_name": "<Chinese value - see the zh page>",
      "market": "TWSE",
      "address": "<Chinese value - see the zh page>",
      "source_provider": "twse_official",
      "source_role": "official_twse_broker_branch_reference",
      "source_family": "official_twse_broker_branch_reference",
      "source_lineage": {
        "open_date": "1080102",
        "branch_code": "601d",
        "broker_code": "<Chinese value - see the zh page>",
        "source_date": "1150608",
        "source_role": "official_twse_broker_branch_reference",
        "source_family": "official_twse_broker_branch_reference",
        "source_tables": {
          "broker_list": "brokerService/brokerList",
          "sec_reg_data": "brokerService/secRegData",
          "branch_reference": "opendata/OpenData_BRK02"
        },
        "raw_branch_name": "<Chinese value - see the zh page>",
        "source_provider": "twse_official",
        "broker_id_source": "derived_from_branch_name",
        "source_canonical": "official_twse_broker_branch_reference",
        "branch_name_guess": "<Chinese value - see the zh page>",
        "broker_name_guess": "<Chinese value - see the zh page>"
      },
      "data_gaps": []
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-07-20",
    "completeness_ratio": 1.0,
    "quality_status": "ready"
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "broker_branch_reference_items",
    "fallback_chain": [
      "brokerService/brokerList",
      "brokerService/secRegData",
      "opendata/OpenData_BRK02"
    ],
    "policy_notes": [
      "reference_only",
      "not_investment_advice",
      "not_trading_activity_coverage"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "broker_branch_reference",
    "request_id": "read-api-20260720",
    "blocking_gate": null
  },
  "dataset_id": "broker_branch_reference",
  "data_count": 2,
  "known_gaps": [
    "not_investment_advice",
    "not_trading_activity_coverage",
    "reference_only"
  ],
  "warnings": [
    "not_investment_advice",
    "reference_only",
    "not_trading_activity_coverage"
  ]
}`,
  },
  "day-trading-suspension": {
    rowsKey: "data",
    envelopeKeys: ["api_version", "data", "data_as_of", "data_count", "dataset", "dataset_id", "dataset_version", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "release_date", "release_version", "request_context", "warnings"],
    zh: `{
  "api_version": "v2",
  "dataset": "day_trading_suspension",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-06-09.preview",
  "release_date": "2026-06-09",
  "data_as_of": "2026-06-09",
  "request_context": {
    "ticker": "TWSE",
    "as_of_date": "2026-06-09",
    "family": "market_structure_corporate_actions",
    "field_group_type": "canonical",
    "dataset_view": "day_trading_suspension_v1",
    "source_table": "day_trading_suspension_items",
    "scope": "day_trading_suspension_twse_current_snapshot_only",
    "coverage_type": "twse_current_snapshot_reference",
    "snapshot_mode": "current_snapshot_only",
    "supported_filter_fields": [
      "market",
      "ticker",
      "date_from"
    ],
    "market_filter": "TWSE",
    "ticker_filter": null,
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "ticker": "1218",
      "market": "TWSE",
      "security_name": "泰山",
      "suspension_start_date": "2026-06-09",
      "suspension_end_date": "2026-06-15",
      "event_indicator": "除息",
      "event_name": "TWSE current day-trading suspension",
      "source_family": "twse_current_day_trading_suspension",
      "lineage": {
        "endpoint": "https://www.twse.com.tw/exchangeReport/TWTBAU2",
        "source_role": "official_current_list",
        "source_title": "115/06/09 至 115/06/09 暫停先賣後買當日沖銷查詢",
        "source_family": "twse_current_day_trading_suspension",
        "request_params": {
          "date": "20260609",
          "response": "json"
        },
        "source_provider": "twse_openapi"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "ticker": "1776",
      "market": "TWSE",
      "security_name": "展宇",
      "suspension_start_date": "2026-06-09",
      "suspension_end_date": "2026-06-15",
      "event_indicator": "除息",
      "event_name": "TWSE current day-trading suspension",
      "source_family": "twse_current_day_trading_suspension",
      "lineage": {
        "endpoint": "https://www.twse.com.tw/exchangeReport/TWTBAU2",
        "source_role": "official_current_list",
        "source_title": "115/06/09 至 115/06/09 暫停先賣後買當日沖銷查詢",
        "source_family": "twse_current_day_trading_suspension",
        "request_params": {
          "date": "20260609",
          "response": "json"
        },
        "source_provider": "twse_openapi"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-06-09",
    "completeness_ratio": 1.0,
    "quality_status": "ready",
    "ticker_count": 2
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "day_trading_suspension",
    "fallback_chain": [],
    "policy_notes": [
      "official/public-first canonical",
      "TWSE current snapshot only",
      "no historical completeness claim"
    ],
    "source_families": [
      "twse_current_day_trading_suspension"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "day_trading_suspension",
    "request_id": "read-api-20260609",
    "blocking_gate": null
  },
  "dataset_id": "day_trading_suspension",
  "data_count": 2,
  "known_gaps": [
    "twse_only_scope",
    "no_tpex_coverage",
    "no_historical_completeness"
  ],
  "warnings": [
    "not_investment_advice",
    "twse_only_scope"
  ],
  "not_investment_advice": true
}`,
    en: `{
  "api_version": "v2",
  "dataset": "day_trading_suspension",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-06-09.preview",
  "release_date": "2026-06-09",
  "data_as_of": "2026-06-09",
  "request_context": {
    "ticker": "TWSE",
    "as_of_date": "2026-06-09",
    "family": "market_structure_corporate_actions",
    "field_group_type": "canonical",
    "dataset_view": "day_trading_suspension_v1",
    "source_table": "day_trading_suspension_items",
    "scope": "day_trading_suspension_twse_current_snapshot_only",
    "coverage_type": "twse_current_snapshot_reference",
    "snapshot_mode": "current_snapshot_only",
    "supported_filter_fields": [
      "market",
      "ticker",
      "date_from"
    ],
    "market_filter": "TWSE",
    "ticker_filter": null,
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "ticker": "1218",
      "market": "TWSE",
      "security_name": "<Chinese value - see the zh page>",
      "suspension_start_date": "2026-06-09",
      "suspension_end_date": "2026-06-15",
      "event_indicator": "<Chinese value - see the zh page>",
      "event_name": "TWSE current day-trading suspension",
      "source_family": "twse_current_day_trading_suspension",
      "lineage": {
        "endpoint": "https://www.twse.com.tw/exchangeReport/TWTBAU2",
        "source_role": "official_current_list",
        "source_title": "<Chinese value - see the zh page>",
        "source_family": "twse_current_day_trading_suspension",
        "request_params": {
          "date": "20260609",
          "response": "json"
        },
        "source_provider": "twse_openapi"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "ticker": "1776",
      "market": "TWSE",
      "security_name": "<Chinese value - see the zh page>",
      "suspension_start_date": "2026-06-09",
      "suspension_end_date": "2026-06-15",
      "event_indicator": "<Chinese value - see the zh page>",
      "event_name": "TWSE current day-trading suspension",
      "source_family": "twse_current_day_trading_suspension",
      "lineage": {
        "endpoint": "https://www.twse.com.tw/exchangeReport/TWTBAU2",
        "source_role": "official_current_list",
        "source_title": "<Chinese value - see the zh page>",
        "source_family": "twse_current_day_trading_suspension",
        "request_params": {
          "date": "20260609",
          "response": "json"
        },
        "source_provider": "twse_openapi"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-06-09",
    "completeness_ratio": 1.0,
    "quality_status": "ready",
    "ticker_count": 2
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "day_trading_suspension",
    "fallback_chain": [],
    "policy_notes": [
      "official/public-first canonical",
      "TWSE current snapshot only",
      "no historical completeness claim"
    ],
    "source_families": [
      "twse_current_day_trading_suspension"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "day_trading_suspension",
    "request_id": "read-api-20260609",
    "blocking_gate": null
  },
  "dataset_id": "day_trading_suspension",
  "data_count": 2,
  "known_gaps": [
    "twse_only_scope",
    "no_tpex_coverage",
    "no_historical_completeness"
  ],
  "warnings": [
    "not_investment_advice",
    "twse_only_scope"
  ],
  "not_investment_advice": true
}`,
  },
  "disposition-securities-period": {
    rowsKey: "data",
    envelopeKeys: ["api_version", "data", "data_as_of", "data_count", "dataset", "dataset_id", "dataset_version", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "release_date", "release_version", "request_context", "warnings"],
    zh: `{
  "api_version": "v2",
  "dataset": "disposition_securities_period",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-06-09.preview",
  "release_date": "2026-06-09",
  "data_as_of": "2026-06-09",
  "request_context": {
    "ticker": "TWSE",
    "as_of_date": "2026-06-09",
    "family": "market_structure_corporate_actions",
    "field_group_type": "canonical",
    "dataset_view": "disposition_securities_period_v1",
    "source_table": "disposition_securities_period_items",
    "scope": "disposition_securities_period_twse_current_snapshot_only",
    "coverage_type": "twse_current_disposition_snapshot",
    "snapshot_mode": "current_snapshot_only",
    "supported_filter_fields": [
      "market",
      "ticker",
      "date_from"
    ],
    "market_filter": "TWSE",
    "ticker_filter": null,
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "ticker": "6890",
      "market": "TWSE",
      "security_name": "來億-KY",
      "disposition_start_date": "2026-06-09",
      "disposition_end_date": "2026-06-23",
      "disposition_type": "第一次處置",
      "disposition_category": "連續三次",
      "reason": "１處置原因：該有價證券之交易，連續三個營業日達本公司「公布注意交易資訊」標準。\\n２處置期間：自民國一百十五年六月九日起至一百十五年六月二十三日﹝十個營業日，如遇：ａ有價證券最後交易日在處置期間，僅處置至最後交易日，ｂ有價證券停止買賣、全日暫停交易則順延執行，ｃ開休市日變動則調整處置迄日〕。\\n３處置措施：\\nａ以人工管制之撮合終端機執行撮合作業（約每五分鐘撮合一次）。\\nｂ投資人每日委託買賣該有價證券數量單筆達十交易單位或多筆累積達三十交易單位以上時，應就其當日已委託之買賣，向該投資人收取全部之買進價金或賣出證券。\\nｃ信用交易部分，應收足融資自備款或融券保證金。有關信用交易了結部分，則依相關規定辦理。",
      "industry": null,
      "source_family": "twse_current_disposition_securities_period",
      "lineage": {
        "note": "提供處置有價證券連結資訊<br>\\n1.<a href='notice.html?querytype=2&startDate=20260508&endDate=20260608&stockNo=6890' target='_blank'>處置原因</a>：提供公布日期近一個月之「公布注意交易資訊」數據標準<br>\\n2.<a href='https://mopsov.twse.com.tw/mops/web/t146sb05?step=1&firstin=Y&co_id=6890' target='_blank'>公開資訊觀測站</a>：提供財務業務與重大訊息之精華版資訊",
        "endpoint": "https://www.twse.com.tw/announcement/punish",
        "source_role": "official_current_list",
        "source_title": "公布處置有價證券資訊 (115/06/09 至 115/06/09)",
        "source_family": "twse_current_disposition_securities_period",
        "request_params": {
          "endDate": "20260609",
          "stockNo": "",
          "response": "json",
          "startDate": "20260609"
        },
        "source_provider": "twse_openapi",
        "announcement_date": "2026-06-08"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "ticker": "1718",
      "market": "TWSE",
      "security_name": "中纖",
      "disposition_start_date": "2026-06-08",
      "disposition_end_date": "2026-06-22",
      "disposition_type": "第一次處置",
      "disposition_category": "連續三次",
      "reason": "１處置原因：該有價證券之交易，連續三個營業日達本公司「公布注意交易資訊」標準。\\n２處置期間：自民國一百十五年六月八日起至一百十五年六月二十二日﹝十個營業日，如遇：ａ有價證券最後交易日在處置期間，僅處置至最後交易日，ｂ有價證券停止買賣、全日暫停交易則順延執行，ｃ開休市日變動則調整處置迄日〕。\\n３處置措施：\\nａ以人工管制之撮合終端機執行撮合作業（約每五分鐘撮合一次）。\\nｂ投資人每日委託買賣該有價證券數量單筆達十交易單位或多筆累積達三十交易單位以上時，應就其當日已委託之買賣，向該投資人收取全部之買進價金或賣出證券。\\nｃ信用交易部分，應收足融資自備款或融券保證金。有關信用交易了結部分，則依相關規定辦理。",
      "industry": null,
      "source_family": "twse_current_disposition_securities_period",
      "lineage": {
        "note": "提供處置有價證券連結資訊<br>\\n1.<a href='notice.html?querytype=2&startDate=20260505&endDate=20260605&stockNo=1718' target='_blank'>處置原因</a>：提供公布日期近一個月之「公布注意交易資訊」數據標準<br>\\n2.<a href='https://mopsov.twse.com.tw/mops/web/t146sb05?step=1&firstin=Y&co_id=1718' target='_blank'>公開資訊觀測站</a>：提供財務業務與重大訊息之精華版資訊",
        "endpoint": "https://www.twse.com.tw/announcement/punish",
        "source_role": "official_current_list",
        "source_title": "公布處置有價證券資訊 (115/06/09 至 115/06/09)",
        "source_family": "twse_current_disposition_securities_period",
        "request_params": {
          "endDate": "20260609",
          "stockNo": "",
          "response": "json",
          "startDate": "20260609"
        },
        "source_provider": "twse_openapi",
        "announcement_date": "2026-06-05"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-06-09",
    "completeness_ratio": 1.0,
    "quality_status": "ready",
    "ticker_count": 2
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "disposition_securities_period",
    "fallback_chain": [],
    "policy_notes": [
      "official/public-first canonical",
      "TWSE current snapshot only",
      "no historical completeness claim"
    ],
    "source_families": [
      "twse_current_disposition_securities_period"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "disposition_securities_period",
    "request_id": "read-api-20260609",
    "blocking_gate": null
  },
  "dataset_id": "disposition_securities_period",
  "data_count": 2,
  "known_gaps": [
    "twse_only_scope",
    "no_tpex_coverage",
    "no_historical_completeness"
  ],
  "warnings": [
    "not_investment_advice",
    "twse_only_scope"
  ],
  "not_investment_advice": true
}`,
    en: `{
  "api_version": "v2",
  "dataset": "disposition_securities_period",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-06-09.preview",
  "release_date": "2026-06-09",
  "data_as_of": "2026-06-09",
  "request_context": {
    "ticker": "TWSE",
    "as_of_date": "2026-06-09",
    "family": "market_structure_corporate_actions",
    "field_group_type": "canonical",
    "dataset_view": "disposition_securities_period_v1",
    "source_table": "disposition_securities_period_items",
    "scope": "disposition_securities_period_twse_current_snapshot_only",
    "coverage_type": "twse_current_disposition_snapshot",
    "snapshot_mode": "current_snapshot_only",
    "supported_filter_fields": [
      "market",
      "ticker",
      "date_from"
    ],
    "market_filter": "TWSE",
    "ticker_filter": null,
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "ticker": "6890",
      "market": "TWSE",
      "security_name": "<Chinese value - see the zh page>",
      "disposition_start_date": "2026-06-09",
      "disposition_end_date": "2026-06-23",
      "disposition_type": "<Chinese value - see the zh page>",
      "disposition_category": "<Chinese value - see the zh page>",
      "reason": "<Chinese value - see the zh page>",
      "industry": null,
      "source_family": "twse_current_disposition_securities_period",
      "lineage": {
        "note": "<Chinese value - see the zh page>",
        "endpoint": "https://www.twse.com.tw/announcement/punish",
        "source_role": "official_current_list",
        "source_title": "<Chinese value - see the zh page>",
        "source_family": "twse_current_disposition_securities_period",
        "request_params": {
          "endDate": "20260609",
          "stockNo": "",
          "response": "json",
          "startDate": "20260609"
        },
        "source_provider": "twse_openapi",
        "announcement_date": "2026-06-08"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "ticker": "1718",
      "market": "TWSE",
      "security_name": "<Chinese value - see the zh page>",
      "disposition_start_date": "2026-06-08",
      "disposition_end_date": "2026-06-22",
      "disposition_type": "<Chinese value - see the zh page>",
      "disposition_category": "<Chinese value - see the zh page>",
      "reason": "<Chinese value - see the zh page>",
      "industry": null,
      "source_family": "twse_current_disposition_securities_period",
      "lineage": {
        "note": "<Chinese value - see the zh page>",
        "endpoint": "https://www.twse.com.tw/announcement/punish",
        "source_role": "official_current_list",
        "source_title": "<Chinese value - see the zh page>",
        "source_family": "twse_current_disposition_securities_period",
        "request_params": {
          "endDate": "20260609",
          "stockNo": "",
          "response": "json",
          "startDate": "20260609"
        },
        "source_provider": "twse_openapi",
        "announcement_date": "2026-06-05"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-06-09",
    "completeness_ratio": 1.0,
    "quality_status": "ready",
    "ticker_count": 2
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "disposition_securities_period",
    "fallback_chain": [],
    "policy_notes": [
      "official/public-first canonical",
      "TWSE current snapshot only",
      "no historical completeness claim"
    ],
    "source_families": [
      "twse_current_disposition_securities_period"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "disposition_securities_period",
    "request_id": "read-api-20260609",
    "blocking_gate": null
  },
  "dataset_id": "disposition_securities_period",
  "data_count": 2,
  "known_gaps": [
    "twse_only_scope",
    "no_tpex_coverage",
    "no_historical_completeness"
  ],
  "warnings": [
    "not_investment_advice",
    "twse_only_scope"
  ],
  "not_investment_advice": true
}`,
  },
  "esg-tesg": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "esg_tesg",
  "request_context": {
    "scope": "esg_tesg_official_open_ghg_only",
    "coverage_type": "official_open_current_snapshot_only",
    "filters": {
      "ticker": null,
      "market": null,
      "report_year": null,
      "as_of_date": null,
      "subfamily": null,
      "metric_name": null,
      "disclosure_status": null,
      "source_family": null,
      "limit": 2
    },
    "min_as_of_date": "2026-06-05",
    "max_as_of_date": "2026-06-05"
  },
  "quality": {
    "row_count": 2,
    "ticker_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "esg_tesg_official_open"
    ],
    "source_families": [
      "twse_ghg"
    ]
  },
  "error": null,
  "data": [
    {
      "ticker": "1101",
      "market": "TWSE",
      "report_year": 2024,
      "as_of_date": "2026-06-05",
      "subfamily": "ghg_carbon_disclosure",
      "metric_name": "scope1_assurance",
      "metric_value": "是",
      "metric_unit": null,
      "disclosure_status": "disclosed",
      "source_provider": "twse_official",
      "source_role": "esg_tesg_official_open",
      "source_family": "twse_ghg",
      "lineage": {
        "row_index": 0,
        "source_url": "https://openapi.twse.com.tw/v1/opendata/t187ap46_L_1",
        "source_column": "範疇一取得驗證"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "ticker": "1101",
      "market": "TWSE",
      "report_year": 2024,
      "as_of_date": "2026-06-05",
      "subfamily": "ghg_carbon_disclosure",
      "metric_name": "scope1_emissions_tco2e",
      "metric_value": "39544430.9992",
      "metric_unit": "噸CO2e",
      "disclosure_status": "disclosed",
      "source_provider": "twse_official",
      "source_role": "esg_tesg_official_open",
      "source_family": "twse_ghg",
      "lineage": {
        "row_index": 0,
        "source_url": "https://openapi.twse.com.tw/v1/opendata/t187ap46_L_1",
        "source_column": "範疇一排放量(噸CO2e)"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "official_open_current_snapshot_only",
    "ghg_only_initial_baseline",
    "no_paid_commercial_tesg_parity_claim"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "esg_tesg",
    "scope": "esg_tesg_official_open_ghg_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "esg_tesg",
  "request_context": {
    "scope": "esg_tesg_official_open_ghg_only",
    "coverage_type": "official_open_current_snapshot_only",
    "filters": {
      "ticker": null,
      "market": null,
      "report_year": null,
      "as_of_date": null,
      "subfamily": null,
      "metric_name": null,
      "disclosure_status": null,
      "source_family": null,
      "limit": 2
    },
    "min_as_of_date": "2026-06-05",
    "max_as_of_date": "2026-06-05"
  },
  "quality": {
    "row_count": 2,
    "ticker_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "esg_tesg_official_open"
    ],
    "source_families": [
      "twse_ghg"
    ]
  },
  "error": null,
  "data": [
    {
      "ticker": "1101",
      "market": "TWSE",
      "report_year": 2024,
      "as_of_date": "2026-06-05",
      "subfamily": "ghg_carbon_disclosure",
      "metric_name": "scope1_assurance",
      "metric_value": "<Chinese value - see the zh page>",
      "metric_unit": null,
      "disclosure_status": "disclosed",
      "source_provider": "twse_official",
      "source_role": "esg_tesg_official_open",
      "source_family": "twse_ghg",
      "lineage": {
        "row_index": 0,
        "source_url": "https://openapi.twse.com.tw/v1/opendata/t187ap46_L_1",
        "source_column": "<Chinese value - see the zh page>"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "ticker": "1101",
      "market": "TWSE",
      "report_year": 2024,
      "as_of_date": "2026-06-05",
      "subfamily": "ghg_carbon_disclosure",
      "metric_name": "scope1_emissions_tco2e",
      "metric_value": "39544430.9992",
      "metric_unit": "<Chinese value - see the zh page>",
      "disclosure_status": "disclosed",
      "source_provider": "twse_official",
      "source_role": "esg_tesg_official_open",
      "source_family": "twse_ghg",
      "lineage": {
        "row_index": 0,
        "source_url": "https://openapi.twse.com.tw/v1/opendata/t187ap46_L_1",
        "source_column": "<Chinese value - see the zh page>"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "official_open_current_snapshot_only",
    "ghg_only_initial_baseline",
    "no_paid_commercial_tesg_parity_claim"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "esg_tesg",
    "scope": "esg_tesg_official_open_ghg_only",
    "row_count": 2
  }
}`,
  },
  "etf-holdings": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "etf_holdings",
  "request_context": {
    "scope": "fubon_issuer_limited_latest_available_snapshot_set",
    "coverage_type": "latest_available_snapshot_set",
    "filters": {
      "etf_code": null,
      "issuer": null,
      "as_of_date": null,
      "holding_ticker": null,
      "market": null,
      "source_family": null,
      "limit": 2
    },
    "min_as_of_date": "2026-07-16",
    "max_as_of_date": "2026-07-16"
  },
  "quality": {
    "row_count": 2,
    "etf_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "etfapi.yuantaetfs.com"
    ],
    "source_roles": [
      "etf_holdings"
    ],
    "source_families": [
      "pcf_yuanta"
    ]
  },
  "error": null,
  "data": [
    {
      "etf_code": "0050",
      "etf_name": "元大台灣卓越50基金",
      "issuer": "yuanta",
      "market": "TWSE",
      "as_of_date": "2026-07-16",
      "holding_ticker": "1216",
      "holding_name": "統一",
      "holding_weight": 0.38,
      "holding_units": 108225075.0,
      "holding_market": null,
      "source_provider": "etfapi.yuantaetfs.com",
      "source_role": "etf_holdings",
      "source_family": "pcf_yuanta",
      "lineage": {
        "url": "https://etfapi.yuantaetfs.com/ectranslation/api/bridge?APIType=ETFAPI&CompanyName=YUANTAFUNDS&PageName=%2FtradeInfo%2Fpcf%2F0050&DeviceId=null&FuncId=PCF%2FDaily&AppName=ETF&Device=3&Platform=ETF&ticker=0050&ndate=20260716",
        "parser": "feature_engine.etf.pcf_sources:yuanta",
        "source": "official_issuer_pcf",
        "pcf_meta": {
          "nav": 106.36,
          "fundid": "1066",
          "osunit": 21113000000,
          "anndate": "20260717",
          "totalav": 2245633183230,
          "upddate": "2026-07-16 16:24:05",
          "trandate": "20260716",
          "inkind_rows": 50
        },
        "fetched_at": "2026-07-18T17:47:07.565821+00:00",
        "parser_version": "v1"
      },
      "data_gaps": []
    },
    {
      "etf_code": "0050",
      "etf_name": "元大台灣卓越50基金",
      "issuer": "yuanta",
      "market": "TWSE",
      "as_of_date": "2026-07-16",
      "holding_ticker": "1303",
      "holding_name": "南亞",
      "holding_weight": 1.07,
      "holding_units": 108086690.0,
      "holding_market": null,
      "source_provider": "etfapi.yuantaetfs.com",
      "source_role": "etf_holdings",
      "source_family": "pcf_yuanta",
      "lineage": {
        "url": "https://etfapi.yuantaetfs.com/ectranslation/api/bridge?APIType=ETFAPI&CompanyName=YUANTAFUNDS&PageName=%2FtradeInfo%2Fpcf%2F0050&DeviceId=null&FuncId=PCF%2FDaily&AppName=ETF&Device=3&Platform=ETF&ticker=0050&ndate=20260716",
        "parser": "feature_engine.etf.pcf_sources:yuanta",
        "source": "official_issuer_pcf",
        "pcf_meta": {
          "nav": 106.36,
          "fundid": "1066",
          "osunit": 21113000000,
          "anndate": "20260717",
          "totalav": 2245633183230,
          "upddate": "2026-07-16 16:24:05",
          "trandate": "20260716",
          "inkind_rows": 50
        },
        "fetched_at": "2026-07-18T17:47:07.565821+00:00",
        "parser_version": "v1"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_available_snapshot_only",
    "issuer_limited_fubon_only",
    "approved_etf_scope_only=fubon_page_discovered_50_etfs"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "envelope": {
    "dataset_id": "etf_holdings",
    "scope": "fubon_issuer_limited_latest_available_snapshot_set",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "etf_holdings",
  "request_context": {
    "scope": "fubon_issuer_limited_latest_available_snapshot_set",
    "coverage_type": "latest_available_snapshot_set",
    "filters": {
      "etf_code": null,
      "issuer": null,
      "as_of_date": null,
      "holding_ticker": null,
      "market": null,
      "source_family": null,
      "limit": 2
    },
    "min_as_of_date": "2026-07-16",
    "max_as_of_date": "2026-07-16"
  },
  "quality": {
    "row_count": 2,
    "etf_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "etfapi.yuantaetfs.com"
    ],
    "source_roles": [
      "etf_holdings"
    ],
    "source_families": [
      "pcf_yuanta"
    ]
  },
  "error": null,
  "data": [
    {
      "etf_code": "0050",
      "etf_name": "<Chinese value - see the zh page>",
      "issuer": "yuanta",
      "market": "TWSE",
      "as_of_date": "2026-07-16",
      "holding_ticker": "1216",
      "holding_name": "<Chinese value - see the zh page>",
      "holding_weight": 0.38,
      "holding_units": 108225075.0,
      "holding_market": null,
      "source_provider": "etfapi.yuantaetfs.com",
      "source_role": "etf_holdings",
      "source_family": "pcf_yuanta",
      "lineage": {
        "url": "https://etfapi.yuantaetfs.com/ectranslation/api/bridge?APIType=ETFAPI&CompanyName=YUANTAFUNDS&PageName=%2FtradeInfo%2Fpcf%2F0050&DeviceId=null&FuncId=PCF%2FDaily&AppName=ETF&Device=3&Platform=ETF&ticker=0050&ndate=20260716",
        "parser": "feature_engine.etf.pcf_sources:yuanta",
        "source": "official_issuer_pcf",
        "pcf_meta": {
          "nav": 106.36,
          "fundid": "1066",
          "osunit": 21113000000,
          "anndate": "20260717",
          "totalav": 2245633183230,
          "upddate": "2026-07-16 16:24:05",
          "trandate": "20260716",
          "inkind_rows": 50
        },
        "fetched_at": "2026-07-18T17:47:07.565821+00:00",
        "parser_version": "v1"
      },
      "data_gaps": []
    },
    {
      "etf_code": "0050",
      "etf_name": "<Chinese value - see the zh page>",
      "issuer": "yuanta",
      "market": "TWSE",
      "as_of_date": "2026-07-16",
      "holding_ticker": "1303",
      "holding_name": "<Chinese value - see the zh page>",
      "holding_weight": 1.07,
      "holding_units": 108086690.0,
      "holding_market": null,
      "source_provider": "etfapi.yuantaetfs.com",
      "source_role": "etf_holdings",
      "source_family": "pcf_yuanta",
      "lineage": {
        "url": "https://etfapi.yuantaetfs.com/ectranslation/api/bridge?APIType=ETFAPI&CompanyName=YUANTAFUNDS&PageName=%2FtradeInfo%2Fpcf%2F0050&DeviceId=null&FuncId=PCF%2FDaily&AppName=ETF&Device=3&Platform=ETF&ticker=0050&ndate=20260716",
        "parser": "feature_engine.etf.pcf_sources:yuanta",
        "source": "official_issuer_pcf",
        "pcf_meta": {
          "nav": 106.36,
          "fundid": "1066",
          "osunit": 21113000000,
          "anndate": "20260717",
          "totalav": 2245633183230,
          "upddate": "2026-07-16 16:24:05",
          "trandate": "20260716",
          "inkind_rows": 50
        },
        "fetched_at": "2026-07-18T17:47:07.565821+00:00",
        "parser_version": "v1"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_available_snapshot_only",
    "issuer_limited_fubon_only",
    "approved_etf_scope_only=fubon_page_discovered_50_etfs"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "envelope": {
    "dataset_id": "etf_holdings",
    "scope": "fubon_issuer_limited_latest_available_snapshot_set",
    "row_count": 2
  }
}`,
  },
  "fund-etf-metadata": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "fund_etf_metadata",
  "request_context": {
    "scope": "fund_etf_metadata_latest_snapshot_only",
    "coverage_type": "latest_snapshot_only",
    "filters": {
      "fund_code": null,
      "market": null,
      "issuer": null,
      "fund_type": null,
      "source_as_of_date": null,
      "source_family": null,
      "limit": 2
    },
    "min_source_as_of_date": "2026-06-04",
    "max_source_as_of_date": "2026-06-04"
  },
  "quality": {
    "row_count": 2,
    "fund_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "official_twse_t187ap47_l"
    ],
    "source_families": [
      "twse_fund_etf_metadata"
    ]
  },
  "error": null,
  "data": [
    {
      "fund_code": "00400A",
      "market": "TWSE",
      "fund_name": "國泰台股動能高息主動式ETF證券投資信託基金",
      "issuer": null,
      "listing_date": "2026-04-09",
      "fund_type": "國內成分證券主動式交易所交易基金(股票)",
      "underlying_index": "不適用",
      "currency": null,
      "source_as_of_date": "2026-06-04",
      "source_provider": "twse_official",
      "source_role": "official_twse_t187ap47_l",
      "source_family": "twse_fund_etf_metadata",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "t187ap47_L",
        "tpex_supplemental_probe_status": "pass"
      },
      "data_gaps": [
        "issuer_not_provided_by_source",
        "currency_not_provided_by_source"
      ],
      "not_investment_advice": true
    },
    {
      "fund_code": "00401A",
      "market": "TWSE",
      "fund_name": "摩根台灣鑫收益主動式ETF證券投資信託基金",
      "issuer": null,
      "listing_date": "2026-04-10",
      "fund_type": "國內成分證券主動式交易所交易基金(股票)",
      "underlying_index": "不適用",
      "currency": null,
      "source_as_of_date": "2026-06-04",
      "source_provider": "twse_official",
      "source_role": "official_twse_t187ap47_l",
      "source_family": "twse_fund_etf_metadata",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "t187ap47_L",
        "tpex_supplemental_probe_status": "pass"
      },
      "data_gaps": [
        "issuer_not_provided_by_source",
        "currency_not_provided_by_source"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_snapshot_only",
    "twse_first_baseline",
    "tpex_supplemental_not_full_baseline"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "fund_etf_metadata",
    "scope": "fund_etf_metadata_latest_snapshot_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "fund_etf_metadata",
  "request_context": {
    "scope": "fund_etf_metadata_latest_snapshot_only",
    "coverage_type": "latest_snapshot_only",
    "filters": {
      "fund_code": null,
      "market": null,
      "issuer": null,
      "fund_type": null,
      "source_as_of_date": null,
      "source_family": null,
      "limit": 2
    },
    "min_source_as_of_date": "2026-06-04",
    "max_source_as_of_date": "2026-06-04"
  },
  "quality": {
    "row_count": 2,
    "fund_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "official_twse_t187ap47_l"
    ],
    "source_families": [
      "twse_fund_etf_metadata"
    ]
  },
  "error": null,
  "data": [
    {
      "fund_code": "00400A",
      "market": "TWSE",
      "fund_name": "<Chinese value - see the zh page>",
      "issuer": null,
      "listing_date": "2026-04-09",
      "fund_type": "<Chinese value - see the zh page>",
      "underlying_index": "<Chinese value - see the zh page>",
      "currency": null,
      "source_as_of_date": "2026-06-04",
      "source_provider": "twse_official",
      "source_role": "official_twse_t187ap47_l",
      "source_family": "twse_fund_etf_metadata",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "t187ap47_L",
        "tpex_supplemental_probe_status": "pass"
      },
      "data_gaps": [
        "issuer_not_provided_by_source",
        "currency_not_provided_by_source"
      ],
      "not_investment_advice": true
    },
    {
      "fund_code": "00401A",
      "market": "TWSE",
      "fund_name": "<Chinese value - see the zh page>",
      "issuer": null,
      "listing_date": "2026-04-10",
      "fund_type": "<Chinese value - see the zh page>",
      "underlying_index": "<Chinese value - see the zh page>",
      "currency": null,
      "source_as_of_date": "2026-06-04",
      "source_provider": "twse_official",
      "source_role": "official_twse_t187ap47_l",
      "source_family": "twse_fund_etf_metadata",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "t187ap47_L",
        "tpex_supplemental_probe_status": "pass"
      },
      "data_gaps": [
        "issuer_not_provided_by_source",
        "currency_not_provided_by_source"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_snapshot_only",
    "twse_first_baseline",
    "tpex_supplemental_not_full_baseline"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "fund_etf_metadata",
    "scope": "fund_etf_metadata_latest_snapshot_only",
    "row_count": 2
  }
}`,
  },
  "insider-director-holdings": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "insider_director_holdings",
  "request_context": {
    "scope": "insider_director_holdings_latest_balance_snapshot_only",
    "coverage_type": "latest_balance_snapshot_only",
    "filters": {
      "ticker": null,
      "market": null,
      "source_as_of_date": null,
      "holder_name": null,
      "holder_role": null,
      "holder_category": null,
      "source_family": null,
      "limit": 2
    },
    "min_source_as_of_date": "2026-05-20",
    "max_source_as_of_date": "2026-05-20"
  },
  "quality": {
    "row_count": 2,
    "ticker_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "tpex_official"
    ],
    "source_roles": [
      "insider_director_holdings_snapshot"
    ],
    "source_families": [
      "tpex_insider_balance_snapshot"
    ]
  },
  "error": null,
  "data": [
    {
      "ticker": "1240",
      "market": "TPEx",
      "source_as_of_date": "2026-05-20",
      "holder_name": "鍾亮宏",
      "holder_role": "副總經理本人",
      "holder_category": "manager",
      "holding_shares": 111169.0,
      "holding_ratio": null,
      "pledge_shares": 0.0,
      "source_provider": "tpex_official",
      "source_role": "insider_director_holdings_snapshot",
      "source_family": "tpex_insider_balance_snapshot",
      "source_row_key": "TPEx|2026-05-20|1240|副總經理本人|鍾亮宏",
      "lineage": {
        "source_family": "tpex_insider_balance_snapshot",
        "source_dataset": "t187ap11_balance_snapshot",
        "source_provider": "tpex_official"
      },
      "data_gaps": [
        "holding_ratio_not_source_provided"
      ],
      "not_investment_advice": true
    },
    {
      "ticker": "1240",
      "market": "TPEx",
      "source_as_of_date": "2026-05-20",
      "holder_name": "黃大中",
      "holder_role": "副總經理本人",
      "holder_category": "manager",
      "holding_shares": 612766.0,
      "holding_ratio": null,
      "pledge_shares": 0.0,
      "source_provider": "tpex_official",
      "source_role": "insider_director_holdings_snapshot",
      "source_family": "tpex_insider_balance_snapshot",
      "source_row_key": "TPEx|2026-05-20|1240|副總經理本人|黃大中",
      "lineage": {
        "source_family": "tpex_insider_balance_snapshot",
        "source_dataset": "t187ap11_balance_snapshot",
        "source_provider": "tpex_official"
      },
      "data_gaps": [
        "holding_ratio_not_source_provided"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_balance_snapshot_only",
    "holding_ratio_nullable_by_policy",
    "not_transaction_reconstruction"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "insider_director_holdings",
    "scope": "insider_director_holdings_latest_balance_snapshot_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "insider_director_holdings",
  "request_context": {
    "scope": "insider_director_holdings_latest_balance_snapshot_only",
    "coverage_type": "latest_balance_snapshot_only",
    "filters": {
      "ticker": null,
      "market": null,
      "source_as_of_date": null,
      "holder_name": null,
      "holder_role": null,
      "holder_category": null,
      "source_family": null,
      "limit": 2
    },
    "min_source_as_of_date": "2026-05-20",
    "max_source_as_of_date": "2026-05-20"
  },
  "quality": {
    "row_count": 2,
    "ticker_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "tpex_official"
    ],
    "source_roles": [
      "insider_director_holdings_snapshot"
    ],
    "source_families": [
      "tpex_insider_balance_snapshot"
    ]
  },
  "error": null,
  "data": [
    {
      "ticker": "1240",
      "market": "TPEx",
      "source_as_of_date": "2026-05-20",
      "holder_name": "<Chinese value - see the zh page>",
      "holder_role": "<Chinese value - see the zh page>",
      "holder_category": "manager",
      "holding_shares": 111169.0,
      "holding_ratio": null,
      "pledge_shares": 0.0,
      "source_provider": "tpex_official",
      "source_role": "insider_director_holdings_snapshot",
      "source_family": "tpex_insider_balance_snapshot",
      "source_row_key": "<Chinese value - see the zh page>",
      "lineage": {
        "source_family": "tpex_insider_balance_snapshot",
        "source_dataset": "t187ap11_balance_snapshot",
        "source_provider": "tpex_official"
      },
      "data_gaps": [
        "holding_ratio_not_source_provided"
      ],
      "not_investment_advice": true
    },
    {
      "ticker": "1240",
      "market": "TPEx",
      "source_as_of_date": "2026-05-20",
      "holder_name": "<Chinese value - see the zh page>",
      "holder_role": "<Chinese value - see the zh page>",
      "holder_category": "manager",
      "holding_shares": 612766.0,
      "holding_ratio": null,
      "pledge_shares": 0.0,
      "source_provider": "tpex_official",
      "source_role": "insider_director_holdings_snapshot",
      "source_family": "tpex_insider_balance_snapshot",
      "source_row_key": "<Chinese value - see the zh page>",
      "lineage": {
        "source_family": "tpex_insider_balance_snapshot",
        "source_dataset": "t187ap11_balance_snapshot",
        "source_provider": "tpex_official"
      },
      "data_gaps": [
        "holding_ratio_not_source_provided"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_balance_snapshot_only",
    "holding_ratio_nullable_by_policy",
    "not_transaction_reconstruction"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "insider_director_holdings",
    "scope": "insider_director_holdings_latest_balance_snapshot_only",
    "row_count": 2
  }
}`,
  },
  "market-index": {
    rowsKey: "items",
    envelopeKeys: ["dataset_id", "held_policy", "items", "row_count"],
    zh: `{
  "dataset_id": "market-index",
  "row_count": 2,
  "items": [
    {
      "index_identity": {
        "index_code": "TWSE_TAIEX",
        "index_name": "發行量加權股價指數",
        "index_version": "v1",
        "index_type": "price"
      },
      "market_identity": {
        "market": "TWSE",
        "as_of_date": "2026-07-17",
        "provider": "twse_official",
        "source_role": "official_twse_mi_index"
      },
      "index_level": {
        "value": 42671.27
      },
      "daily_change": {
        "points": -2953.71,
        "return_pct": -6.47
      },
      "turnover": {
        "turnover_value": 1112606276770.0,
        "volume_shares": 6545776248.0
      },
      "source_lineage": {
        "source": "TWSE_MI_INDEX",
        "source_date": "2026-07-17",
        "source_type": "ALLBUT0999",
        "special_note": null,
        "identity_rule": "exact_index_name_match",
        "source_lineage": {
          "row_number": 1,
          "table_index": 0,
          "table_title": "115年07月17日 價格指數(臺灣證券交易所)"
        },
        "source_table_id": "table_0",
        "turnover_lineage": {
          "stat_item": "1.一般股票",
          "row_number": 0,
          "table_index": 6,
          "table_title": "115年07月17日 大盤統計資訊"
        }
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "breadth_overview_sector_rows_are_held",
        "not_investment_advice",
        "twse_taiex_index_only_scope"
      ],
      "available_tools_or_endpoints": {
        "dataset_endpoint": "/v2/datasets/market-index",
        "lookup_hint": "index_code=TWSE_TAIEX&market=TWSE",
        "scope_note": "taiex_index_only_read_model"
      }
    },
    {
      "index_identity": {
        "index_code": "TWSE_TAIEX",
        "index_name": "發行量加權股價指數",
        "index_version": "v1",
        "index_type": "price"
      },
      "market_identity": {
        "market": "TWSE",
        "as_of_date": "2026-07-16",
        "provider": "twse_official",
        "source_role": "official_twse_mi_index"
      },
      "index_level": {
        "value": 45624.98
      },
      "daily_change": {
        "points": -6.61,
        "return_pct": -0.01
      },
      "turnover": {
        "turnover_value": 868077385100.0,
        "volume_shares": 5342533123.0
      },
      "source_lineage": {
        "source": "TWSE_MI_INDEX",
        "source_date": "2026-07-16",
        "source_type": "ALLBUT0999",
        "special_note": null,
        "identity_rule": "exact_index_name_match",
        "source_lineage": {
          "row_number": 1,
          "table_index": 0,
          "table_title": "115年07月16日 價格指數(臺灣證券交易所)"
        },
        "source_table_id": "table_0",
        "turnover_lineage": {
          "stat_item": "1.一般股票",
          "row_number": 0,
          "table_index": 6,
          "table_title": "115年07月16日 大盤統計資訊"
        }
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "breadth_overview_sector_rows_are_held",
        "not_investment_advice",
        "twse_taiex_index_only_scope"
      ],
      "available_tools_or_endpoints": {
        "dataset_endpoint": "/v2/datasets/market-index",
        "lookup_hint": "index_code=TWSE_TAIEX&market=TWSE",
        "scope_note": "taiex_index_only_read_model"
      }
    }
  ],
  "held_policy": {
    "market_breadth_items": "held",
    "market_overview_snapshots": "held",
    "sector_or_unknown_index_rows": "held"
  }
}`,
    en: `{
  "dataset_id": "market-index",
  "row_count": 2,
  "items": [
    {
      "index_identity": {
        "index_code": "TWSE_TAIEX",
        "index_name": "<Chinese value - see the zh page>",
        "index_version": "v1",
        "index_type": "price"
      },
      "market_identity": {
        "market": "TWSE",
        "as_of_date": "2026-07-17",
        "provider": "twse_official",
        "source_role": "official_twse_mi_index"
      },
      "index_level": {
        "value": 42671.27
      },
      "daily_change": {
        "points": -2953.71,
        "return_pct": -6.47
      },
      "turnover": {
        "turnover_value": 1112606276770.0,
        "volume_shares": 6545776248.0
      },
      "source_lineage": {
        "source": "TWSE_MI_INDEX",
        "source_date": "2026-07-17",
        "source_type": "ALLBUT0999",
        "special_note": null,
        "identity_rule": "exact_index_name_match",
        "source_lineage": {
          "row_number": 1,
          "table_index": 0,
          "table_title": "<Chinese value - see the zh page>"
        },
        "source_table_id": "table_0",
        "turnover_lineage": {
          "stat_item": "<Chinese value - see the zh page>",
          "row_number": 0,
          "table_index": 6,
          "table_title": "<Chinese value - see the zh page>"
        }
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "breadth_overview_sector_rows_are_held",
        "not_investment_advice",
        "twse_taiex_index_only_scope"
      ],
      "available_tools_or_endpoints": {
        "dataset_endpoint": "/v2/datasets/market-index",
        "lookup_hint": "index_code=TWSE_TAIEX&market=TWSE",
        "scope_note": "taiex_index_only_read_model"
      }
    },
    {
      "index_identity": {
        "index_code": "TWSE_TAIEX",
        "index_name": "<Chinese value - see the zh page>",
        "index_version": "v1",
        "index_type": "price"
      },
      "market_identity": {
        "market": "TWSE",
        "as_of_date": "2026-07-16",
        "provider": "twse_official",
        "source_role": "official_twse_mi_index"
      },
      "index_level": {
        "value": 45624.98
      },
      "daily_change": {
        "points": -6.61,
        "return_pct": -0.01
      },
      "turnover": {
        "turnover_value": 868077385100.0,
        "volume_shares": 5342533123.0
      },
      "source_lineage": {
        "source": "TWSE_MI_INDEX",
        "source_date": "2026-07-16",
        "source_type": "ALLBUT0999",
        "special_note": null,
        "identity_rule": "exact_index_name_match",
        "source_lineage": {
          "row_number": 1,
          "table_index": 0,
          "table_title": "<Chinese value - see the zh page>"
        },
        "source_table_id": "table_0",
        "turnover_lineage": {
          "stat_item": "<Chinese value - see the zh page>",
          "row_number": 0,
          "table_index": 6,
          "table_title": "<Chinese value - see the zh page>"
        }
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "breadth_overview_sector_rows_are_held",
        "not_investment_advice",
        "twse_taiex_index_only_scope"
      ],
      "available_tools_or_endpoints": {
        "dataset_endpoint": "/v2/datasets/market-index",
        "lookup_hint": "index_code=TWSE_TAIEX&market=TWSE",
        "scope_note": "taiex_index_only_read_model"
      }
    }
  ],
  "held_policy": {
    "market_breadth_items": "held",
    "market_overview_snapshots": "held",
    "sector_or_unknown_index_rows": "held"
  }
}`,
  },
  "market-overview-snapshots": {
    rowsKey: "data",
    envelopeKeys: ["api_version", "data", "data_as_of", "data_count", "dataset", "dataset_id", "dataset_version", "error", "known_gaps", "lineage", "quality", "release_date", "release_version", "request_context", "warnings"],
    zh: `{
  "api_version": "v2",
  "dataset": "market_overview_snapshots",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-05-28.preview",
  "release_date": "2026-05-28",
  "data_as_of": "2026-05-28",
  "request_context": {
    "ticker": "TWSE",
    "as_of_date": "2026-05-28",
    "family": "taiwan_macro",
    "field_group_type": "canonical",
    "dataset_view": "market_overview_snapshots_v1",
    "source_table": "market_overview_snapshots",
    "scope": "market_overview_snapshots_only",
    "coverage_type": "seeded_anchor_snapshot_set",
    "supported_sort_by": [
      "as_of_date"
    ],
    "supported_filter_fields": [
      "market",
      "as_of_date",
      "date_from"
    ],
    "market_filter": "TWSE",
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "market_code": "TWSE",
      "as_of_date": "2026-05-28",
      "index_level": 43636.44,
      "index_change": -620.36,
      "index_change_pct": -1.4,
      "advancers": null,
      "decliners": null,
      "unchanged": null,
      "turnover_value": 1531713564563.0,
      "volume_shares": 11122477394.0,
      "transaction_count": null,
      "listed_count": null,
      "traded_count": null,
      "provider": "twse_official",
      "source_role": "official_market_overview",
      "lineage": {
        "index_data": {
          "lineage": {
            "source": "TWSE_MI_INDEX",
            "source_date": "2026-05-28",
            "source_type": "ALLBUT0999",
            "special_note": null,
            "identity_rule": "exact_index_name_match",
            "source_lineage": {
              "row_number": 1,
              "table_index": 0,
              "table_title": "115年05月28日 價格指數(臺灣證券交易所)"
            },
            "source_table_id": "table_0",
            "turnover_lineage": {
              "stat_item": "1.一般股票",
              "row_number": 0,
              "table_index": 6,
              "table_title": "115年05月28日 大盤統計資訊"
            }
          },
          "provider": "twse_official",
          "as_of_date": "2026-05-28",
          "source_role": "official_twse_mi_index"
        },
        "mapping_rule": "full_outer_union_on_as_of_date_for_twse_aggregate_anchor",
        "source_family": "official_first:market_overview",
        "source_tables": [
          "index_data_items",
          "market_breadth_items"
        ],
        "market_breadth": null
      },
      "data_gaps": [
        "missing_market_breadth_items_row",
        "missing_transaction_count_from_approved_inputs",
        "missing_listed_count_from_approved_inputs"
      ],
      "not_investment_advice": true,
      "market_scope": "TWSE",
      "currency": "TWD",
      "is_placeholder": false
    },
    {
      "market_code": "TWSE",
      "as_of_date": "2026-05-27",
      "index_level": 44256.8,
      "index_change": 731.43,
      "index_change_pct": 1.68,
      "advancers": 333,
      "decliners": 672,
      "unchanged": 68,
      "turnover_value": 1518335225482.0,
      "volume_shares": 10767509251.0,
      "transaction_count": null,
      "listed_count": null,
      "traded_count": 1073.0,
      "provider": "twse_official",
      "source_role": "official_market_overview",
      "lineage": {
        "index_data": {
          "lineage": {
            "source": "TWSE_MI_INDEX",
            "source_date": "2026-05-27",
            "source_type": "ALLBUT0999",
            "special_note": null,
            "identity_rule": "exact_index_name_match",
            "source_lineage": {
              "row_number": 1,
              "table_index": 0,
              "table_title": "115年05月27日 價格指數(臺灣證券交易所)"
            },
            "source_table_id": "table_0",
            "turnover_lineage": {
              "stat_item": "1.一般股票",
              "row_number": 0,
              "table_index": 6,
              "table_title": "115年05月27日 大盤統計資訊"
            }
          },
          "provider": "twse_official",
          "as_of_date": "2026-05-27",
          "source_role": "official_twse_mi_index"
        },
        "mapping_rule": "full_outer_union_on_as_of_date_for_twse_aggregate_anchor",
        "source_family": "official_first:market_overview",
        "source_tables": [
          "index_data_items",
          "market_breadth_items"
        ],
        "market_breadth": {
          "lineage": {
            "derived_from": "twse_mi_index_market_breadth",
            "upstream_lineage": {
              "request_type": "MS",
              "parser_source_date": "2026-05-27",
              "source_lineage_rows": [
                {
                  "row_number": 0,
                  "table_index": 7,
                  "table_title": "漲跌證券數合計"
                },
                {
                  "row_number": 1,
                  "table_index": 7,
                  "table_title": "漲跌證券數合計"
                },
                {
                  "row_number": 2,
                  "table_index": 7,
                  "table_title": "漲跌證券數合計"
                }
              ]
            }
          },
          "provider": "twse_official",
          "as_of_date": "2026-05-27",
          "source_role": "derived_market_breadth"
        }
      },
      "data_gaps": [
        "missing_transaction_count_from_approved_inputs",
        "missing_listed_count_from_approved_inputs"
      ],
      "not_investment_advice": true,
      "market_scope": "TWSE",
      "currency": "TWD",
      "is_placeholder": false
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-05-28",
    "completeness_ratio": 1.0,
    "quality_status": "ready"
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "market_overview_snapshots",
    "fallback_chain": [
      "index_data_items",
      "market_breadth_items"
    ],
    "policy_notes": [
      "official/public-first canonical",
      "market_overview_snapshots is the seeded anchor surface for index and breadth derivations",
      "not_investment_advice"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "market_overview_snapshots",
    "request_id": "read-api-20260528",
    "blocking_gate": null
  },
  "dataset_id": "market_overview_snapshots",
  "data_count": 2,
  "known_gaps": [
    "missing_listed_count_from_approved_inputs",
    "missing_market_breadth_items_row",
    "missing_transaction_count_from_approved_inputs"
  ],
  "warnings": [
    "not_investment_advice"
  ]
}`,
    en: `{
  "api_version": "v2",
  "dataset": "market_overview_snapshots",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-05-28.preview",
  "release_date": "2026-05-28",
  "data_as_of": "2026-05-28",
  "request_context": {
    "ticker": "TWSE",
    "as_of_date": "2026-05-28",
    "family": "taiwan_macro",
    "field_group_type": "canonical",
    "dataset_view": "market_overview_snapshots_v1",
    "source_table": "market_overview_snapshots",
    "scope": "market_overview_snapshots_only",
    "coverage_type": "seeded_anchor_snapshot_set",
    "supported_sort_by": [
      "as_of_date"
    ],
    "supported_filter_fields": [
      "market",
      "as_of_date",
      "date_from"
    ],
    "market_filter": "TWSE",
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "market_code": "TWSE",
      "as_of_date": "2026-05-28",
      "index_level": 43636.44,
      "index_change": -620.36,
      "index_change_pct": -1.4,
      "advancers": null,
      "decliners": null,
      "unchanged": null,
      "turnover_value": 1531713564563.0,
      "volume_shares": 11122477394.0,
      "transaction_count": null,
      "listed_count": null,
      "traded_count": null,
      "provider": "twse_official",
      "source_role": "official_market_overview",
      "lineage": {
        "index_data": {
          "lineage": {
            "source": "TWSE_MI_INDEX",
            "source_date": "2026-05-28",
            "source_type": "ALLBUT0999",
            "special_note": null,
            "identity_rule": "exact_index_name_match",
            "source_lineage": {
              "row_number": 1,
              "table_index": 0,
              "table_title": "<Chinese value - see the zh page>"
            },
            "source_table_id": "table_0",
            "turnover_lineage": {
              "stat_item": "<Chinese value - see the zh page>",
              "row_number": 0,
              "table_index": 6,
              "table_title": "<Chinese value - see the zh page>"
            }
          },
          "provider": "twse_official",
          "as_of_date": "2026-05-28",
          "source_role": "official_twse_mi_index"
        },
        "mapping_rule": "full_outer_union_on_as_of_date_for_twse_aggregate_anchor",
        "source_family": "official_first:market_overview",
        "source_tables": [
          "index_data_items",
          "market_breadth_items"
        ],
        "market_breadth": null
      },
      "data_gaps": [
        "missing_market_breadth_items_row",
        "missing_transaction_count_from_approved_inputs",
        "missing_listed_count_from_approved_inputs"
      ],
      "not_investment_advice": true,
      "market_scope": "TWSE",
      "currency": "TWD",
      "is_placeholder": false
    },
    {
      "market_code": "TWSE",
      "as_of_date": "2026-05-27",
      "index_level": 44256.8,
      "index_change": 731.43,
      "index_change_pct": 1.68,
      "advancers": 333,
      "decliners": 672,
      "unchanged": 68,
      "turnover_value": 1518335225482.0,
      "volume_shares": 10767509251.0,
      "transaction_count": null,
      "listed_count": null,
      "traded_count": 1073.0,
      "provider": "twse_official",
      "source_role": "official_market_overview",
      "lineage": {
        "index_data": {
          "lineage": {
            "source": "TWSE_MI_INDEX",
            "source_date": "2026-05-27",
            "source_type": "ALLBUT0999",
            "special_note": null,
            "identity_rule": "exact_index_name_match",
            "source_lineage": {
              "row_number": 1,
              "table_index": 0,
              "table_title": "<Chinese value - see the zh page>"
            },
            "source_table_id": "table_0",
            "turnover_lineage": {
              "stat_item": "<Chinese value - see the zh page>",
              "row_number": 0,
              "table_index": 6,
              "table_title": "<Chinese value - see the zh page>"
            }
          },
          "provider": "twse_official",
          "as_of_date": "2026-05-27",
          "source_role": "official_twse_mi_index"
        },
        "mapping_rule": "full_outer_union_on_as_of_date_for_twse_aggregate_anchor",
        "source_family": "official_first:market_overview",
        "source_tables": [
          "index_data_items",
          "market_breadth_items"
        ],
        "market_breadth": {
          "lineage": {
            "derived_from": "twse_mi_index_market_breadth",
            "upstream_lineage": {
              "request_type": "MS",
              "parser_source_date": "2026-05-27",
              "source_lineage_rows": [
                {
                  "row_number": 0,
                  "table_index": 7,
                  "table_title": "<Chinese value - see the zh page>"
                },
                {
                  "row_number": 1,
                  "table_index": 7,
                  "table_title": "<Chinese value - see the zh page>"
                },
                {
                  "row_number": 2,
                  "table_index": 7,
                  "table_title": "<Chinese value - see the zh page>"
                }
              ]
            }
          },
          "provider": "twse_official",
          "as_of_date": "2026-05-27",
          "source_role": "derived_market_breadth"
        }
      },
      "data_gaps": [
        "missing_transaction_count_from_approved_inputs",
        "missing_listed_count_from_approved_inputs"
      ],
      "not_investment_advice": true,
      "market_scope": "TWSE",
      "currency": "TWD",
      "is_placeholder": false
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-05-28",
    "completeness_ratio": 1.0,
    "quality_status": "ready"
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "market_overview_snapshots",
    "fallback_chain": [
      "index_data_items",
      "market_breadth_items"
    ],
    "policy_notes": [
      "official/public-first canonical",
      "market_overview_snapshots is the seeded anchor surface for index and breadth derivations",
      "not_investment_advice"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "market_overview_snapshots",
    "request_id": "read-api-20260528",
    "blocking_gate": null
  },
  "dataset_id": "market_overview_snapshots",
  "data_count": 2,
  "known_gaps": [
    "missing_listed_count_from_approved_inputs",
    "missing_market_breadth_items_row",
    "missing_transaction_count_from_approved_inputs"
  ],
  "warnings": [
    "not_investment_advice"
  ]
}`,
  },
  "monthly-revenue": {
    rowsKey: "rows",
    envelopeKeys: ["count", "dataset", "rows"],
    zh: `{
  "dataset": "monthly_revenue",
  "rows": [
    {
      "symbol": "2330",
      "month": "2026-04",
      "revenue_month": "2026-04",
      "revenue": 410725118.0,
      "mom": -1.075787644781405,
      "yoy": 17.495412466636576,
      "announcement_date": "2026-05-17",
      "source_publish_date": "2026-05-17",
      "currency": "TWD",
      "is_revision": false,
      "revision_key": null,
      "source_id": "mops_official"
    },
    {
      "symbol": "2330",
      "month": "2026-03",
      "revenue_month": "2026-03",
      "revenue": 415191699.0,
      "mom": 30.704566506222868,
      "yoy": 45.193838874210485,
      "announcement_date": "2026-05-17",
      "source_publish_date": "2026-05-17",
      "currency": "TWD",
      "is_revision": false,
      "revision_key": null,
      "source_id": "mops_official"
    }
  ],
  "count": 2
}`,
  },
  "options-daily-taifex": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "options_daily_taifex",
  "request_context": {
    "scope": "options_daily_taifex_latest_daily_file_only",
    "coverage_type": "latest_daily_file_only",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "contract_symbol": null,
      "option_type": null,
      "expiry_month": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-06-04",
    "max_trade_date": "2026-06-04"
  },
  "quality": {
    "row_count": 2,
    "contract_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "taifex_official"
    ],
    "source_roles": [
      "options_daily_quote_settlement_open_interest"
    ],
    "source_families": [
      "optDataDown"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "call",
      "strike_price": 60.0,
      "expiry_month": "202606",
      "open": null,
      "high": null,
      "low": null,
      "close": null,
      "volume": 0,
      "open_interest": 0,
      "settlement_price": 51.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "一般"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "call",
      "strike_price": 65.0,
      "expiry_month": "202606",
      "open": null,
      "high": null,
      "low": null,
      "close": null,
      "volume": 0,
      "open_interest": 0,
      "settlement_price": 46.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "一般"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_daily_file_only",
    "single_trading_date_baseline",
    "no_historical_options_coverage_claim"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "options_daily_taifex",
    "scope": "options_daily_taifex_latest_daily_file_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "options_daily_taifex",
  "request_context": {
    "scope": "options_daily_taifex_latest_daily_file_only",
    "coverage_type": "latest_daily_file_only",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "contract_symbol": null,
      "option_type": null,
      "expiry_month": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-06-04",
    "max_trade_date": "2026-06-04"
  },
  "quality": {
    "row_count": 2,
    "contract_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "taifex_official"
    ],
    "source_roles": [
      "options_daily_quote_settlement_open_interest"
    ],
    "source_families": [
      "optDataDown"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "call",
      "strike_price": 60.0,
      "expiry_month": "202606",
      "open": null,
      "high": null,
      "low": null,
      "close": null,
      "volume": 0,
      "open_interest": 0,
      "settlement_price": 51.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "<Chinese value - see the zh page>"
      },
      "data_gaps": [],
      "not_investment_advice": true
    },
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "call",
      "strike_price": 65.0,
      "expiry_month": "202606",
      "open": null,
      "high": null,
      "low": null,
      "close": null,
      "volume": 0,
      "open_interest": 0,
      "settlement_price": 46.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "<Chinese value - see the zh page>"
      },
      "data_gaps": [],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_daily_file_only",
    "single_trading_date_baseline",
    "no_historical_options_coverage_claim"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "options_daily_taifex",
    "scope": "options_daily_taifex_latest_daily_file_only",
    "row_count": 2
  }
}`,
  },
  "return-index-daily": {
    rowsKey: "rows",
    envelopeKeys: ["dataset_id", "filters", "generated_at", "metadata", "not_investment_advice", "request_context", "row_count", "rows", "warnings"],
    zh: `{
  "generated_at": "2026-07-20T07:23:09Z",
  "dataset_id": "return_index_daily",
  "row_count": 2,
  "rows": [
    {
      "trade_date": "2026-07-17",
      "market": "TPEx",
      "index_id": "TPEX_RETURN_INDEX",
      "index_name": "TPEx Return Index",
      "return_index_value": "699.920000",
      "source_name": "tpex_roe",
      "source_url": "https://www.tpex.org.tw/www/zh-tw/indexInfo/ROE?date=2026/07/15"
    },
    {
      "trade_date": "2026-07-16",
      "market": "TPEx",
      "index_id": "TPEX_RETURN_INDEX",
      "index_name": "TPEx Return Index",
      "return_index_value": "752.560000",
      "source_name": "tpex_roe",
      "source_url": "https://www.tpex.org.tw/www/zh-tw/indexInfo/ROE?date=2026/07/15"
    }
  ],
  "filters": {
    "market": null,
    "index_id": null,
    "start_date": null,
    "end_date": null,
    "limit": 2
  },
  "request_context": {
    "not_investment_advice": true,
    "public_exposure": true
  },
  "metadata": {
    "public_exposure": true,
    "data_status": "public_api",
    "default_limit": 100,
    "max_limit": 500,
    "allowed_filters": [
      "market",
      "index_id",
      "start_date"
    ],
    "boundary_module": "feature_engine.read_api.return_index_daily_api_boundary",
    "planned_route": "/v2/datasets/return-index-daily",
    "route_public": true
  },
  "not_investment_advice": true,
  "warnings": [
    "not_investment_advice"
  ]
}`,
  },
  "security-master": {
    rowsKey: "items",
    envelopeKeys: ["as_of_date", "available_tools_or_endpoints", "dataset_id", "generated_at", "items", "row_count", "safe_usage_notes", "survivorship_bias_warning"],
    zh: `{
  "generated_at": "2026-07-20T07:23:09Z",
  "dataset_id": "security-master",
  "as_of_date": "2026-07-20",
  "row_count": 2,
  "survivorship_bias_warning": {
    "enabled": true,
    "level": "warning",
    "message": "Current security master is not point-in-time complete; survivorship bias may exist for backtests."
  },
  "items": [
    {
      "generated_at": "2026-07-20T07:23:09Z",
      "as_of_date": "2026-07-20",
      "ticker": "1260",
      "security_identity": {
        "ticker": "1260",
        "name_zh": "富味鄉",
        "name_en": null,
        "security_type": "common_stock",
        "is_active": true
      },
      "market_identity": {
        "market": "Emerging",
        "source_provider": "twse_isin_public",
        "source_role": "canonical",
        "source_confidence": "high"
      },
      "dataset_coverage": {
        "price": "unknown",
        "technical_indicators": "unknown",
        "margin_short": "unknown",
        "valuation": "unknown",
        "financials": "unknown"
      },
      "source_lineage": {
        "isin": "TW0001260008",
        "source": "TWSE ISIN C_public.jsp",
        "source_market": "Emerging",
        "market_section": "興櫃"
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "current_master_not_survivorship_safe_for_backtests",
        "not_investment_advice"
      ],
      "survivorship_bias_warning": {
        "enabled": true,
        "level": "warning",
        "message": "Current security master is not point-in-time complete; survivorship bias may exist for backtests."
      },
      "available_tools_or_endpoints": [
        {
          "name": "security_master_lookup",
          "path": "/v2/read/mcp-tool"
        },
        {
          "name": "security_master_dataset",
          "path": "/v2/datasets/security-master"
        },
        {
          "name": "security_lookup",
          "path": "/v2/securities/{ticker}"
        }
      ]
    },
    {
      "generated_at": "2026-07-20T07:23:09Z",
      "as_of_date": "2026-07-20",
      "ticker": "1269",
      "security_identity": {
        "ticker": "1269",
        "name_zh": "乾杯",
        "name_en": null,
        "security_type": "common_stock",
        "is_active": true
      },
      "market_identity": {
        "market": "Emerging",
        "source_provider": "twse_isin_public",
        "source_role": "canonical",
        "source_confidence": "high"
      },
      "dataset_coverage": {
        "price": "unknown",
        "technical_indicators": "unknown",
        "margin_short": "unknown",
        "valuation": "unknown",
        "financials": "unknown"
      },
      "source_lineage": {
        "isin": "TW0001269009",
        "source": "TWSE ISIN C_public.jsp",
        "source_market": "Emerging",
        "market_section": "興櫃"
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "current_master_not_survivorship_safe_for_backtests",
        "not_investment_advice"
      ],
      "survivorship_bias_warning": {
        "enabled": true,
        "level": "warning",
        "message": "Current security master is not point-in-time complete; survivorship bias may exist for backtests."
      },
      "available_tools_or_endpoints": [
        {
          "name": "security_master_lookup",
          "path": "/v2/read/mcp-tool"
        },
        {
          "name": "security_master_dataset",
          "path": "/v2/datasets/security-master"
        },
        {
          "name": "security_lookup",
          "path": "/v2/securities/{ticker}"
        }
      ]
    }
  ],
  "safe_usage_notes": [
    "not_investment_advice",
    "official_first_source_policy",
    "active_snapshot_only"
  ],
  "available_tools_or_endpoints": [
    {
      "name": "security_master_lookup",
      "path": "/v2/read/mcp-tool"
    },
    {
      "name": "security_master_dataset",
      "path": "/v2/datasets/security-master"
    },
    {
      "name": "security_lookup",
      "path": "/v2/securities/{ticker}"
    }
  ]
}`,
    en: `{
  "generated_at": "2026-07-20T07:23:09Z",
  "dataset_id": "security-master",
  "as_of_date": "2026-07-20",
  "row_count": 2,
  "survivorship_bias_warning": {
    "enabled": true,
    "level": "warning",
    "message": "Current security master is not point-in-time complete; survivorship bias may exist for backtests."
  },
  "items": [
    {
      "generated_at": "2026-07-20T07:23:09Z",
      "as_of_date": "2026-07-20",
      "ticker": "1260",
      "security_identity": {
        "ticker": "1260",
        "name_zh": "<Chinese value - see the zh page>",
        "name_en": null,
        "security_type": "common_stock",
        "is_active": true
      },
      "market_identity": {
        "market": "Emerging",
        "source_provider": "twse_isin_public",
        "source_role": "canonical",
        "source_confidence": "high"
      },
      "dataset_coverage": {
        "price": "unknown",
        "technical_indicators": "unknown",
        "margin_short": "unknown",
        "valuation": "unknown",
        "financials": "unknown"
      },
      "source_lineage": {
        "isin": "TW0001260008",
        "source": "TWSE ISIN C_public.jsp",
        "source_market": "Emerging",
        "market_section": "<Chinese value - see the zh page>"
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "current_master_not_survivorship_safe_for_backtests",
        "not_investment_advice"
      ],
      "survivorship_bias_warning": {
        "enabled": true,
        "level": "warning",
        "message": "Current security master is not point-in-time complete; survivorship bias may exist for backtests."
      },
      "available_tools_or_endpoints": [
        {
          "name": "security_master_lookup",
          "path": "/v2/read/mcp-tool"
        },
        {
          "name": "security_master_dataset",
          "path": "/v2/datasets/security-master"
        },
        {
          "name": "security_lookup",
          "path": "/v2/securities/{ticker}"
        }
      ]
    },
    {
      "generated_at": "2026-07-20T07:23:09Z",
      "as_of_date": "2026-07-20",
      "ticker": "1269",
      "security_identity": {
        "ticker": "1269",
        "name_zh": "<Chinese value - see the zh page>",
        "name_en": null,
        "security_type": "common_stock",
        "is_active": true
      },
      "market_identity": {
        "market": "Emerging",
        "source_provider": "twse_isin_public",
        "source_role": "canonical",
        "source_confidence": "high"
      },
      "dataset_coverage": {
        "price": "unknown",
        "technical_indicators": "unknown",
        "margin_short": "unknown",
        "valuation": "unknown",
        "financials": "unknown"
      },
      "source_lineage": {
        "isin": "TW0001269009",
        "source": "TWSE ISIN C_public.jsp",
        "source_market": "Emerging",
        "market_section": "<Chinese value - see the zh page>"
      },
      "data_gaps": [],
      "safe_usage_notes": [
        "current_master_not_survivorship_safe_for_backtests",
        "not_investment_advice"
      ],
      "survivorship_bias_warning": {
        "enabled": true,
        "level": "warning",
        "message": "Current security master is not point-in-time complete; survivorship bias may exist for backtests."
      },
      "available_tools_or_endpoints": [
        {
          "name": "security_master_lookup",
          "path": "/v2/read/mcp-tool"
        },
        {
          "name": "security_master_dataset",
          "path": "/v2/datasets/security-master"
        },
        {
          "name": "security_lookup",
          "path": "/v2/securities/{ticker}"
        }
      ]
    }
  ],
  "safe_usage_notes": [
    "not_investment_advice",
    "official_first_source_policy",
    "active_snapshot_only"
  ],
  "available_tools_or_endpoints": [
    {
      "name": "security_master_lookup",
      "path": "/v2/read/mcp-tool"
    },
    {
      "name": "security_master_dataset",
      "path": "/v2/datasets/security-master"
    },
    {
      "name": "security_lookup",
      "path": "/v2/securities/{ticker}"
    }
  ]
}`,
  },
  "stock-delisting-lifecycle": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "stock_delisting_lifecycle",
  "request_context": {
    "scope": "stock_delisting_lifecycle_twse_only",
    "coverage_type": "twse_delisted_company_reference",
    "snapshot_mode": "current_snapshot_only",
    "filters": {
      "market": "TWSE",
      "code": null,
      "date_from": null,
      "date_to": null,
      "event_type": null,
      "source_family": null,
      "limit": 2
    },
    "min_event_date": "2026-01-22",
    "max_event_date": "2026-03-27"
  },
  "quality": {
    "row_count": 2,
    "code_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "official_twse_delisted_company_table"
    ],
    "source_families": [
      "twse_delisted_company_table"
    ]
  },
  "error": null,
  "data": [
    {
      "market": "TWSE",
      "code": "3454",
      "company_name": null,
      "event_type": "delisting",
      "announcement_date": null,
      "suspension_date": null,
      "delisting_date": "2026-03-27",
      "reason_summary": null,
      "source_provider": "twse_official",
      "source_role": "official_twse_delisted_company_table",
      "source_family": "twse_delisted_company_table",
      "source_event_ref": "TWSE:suspendListing|3454|2026-03-27",
      "lineage": {
        "source_url": "https://www.twse.com.tw/rwd/en/company/suspendListing?response=html",
        "source_scope": "TWSE_ONLY",
        "source_title": "De-listed Companies",
        "source_family": "twse_delisted_company_table",
        "source_endpoint": "company/suspendListing"
      },
      "data_gaps": [
        "company_name_missing"
      ]
    },
    {
      "market": "TWSE",
      "code": "6423",
      "company_name": "YMC",
      "event_type": "delisting",
      "announcement_date": null,
      "suspension_date": null,
      "delisting_date": "2026-01-22",
      "reason_summary": null,
      "source_provider": "twse_official",
      "source_role": "official_twse_delisted_company_table",
      "source_family": "twse_delisted_company_table",
      "source_event_ref": "TWSE:suspendListing|6423|2026-01-22",
      "lineage": {
        "source_url": "https://www.twse.com.tw/rwd/en/company/suspendListing?response=html",
        "source_scope": "TWSE_ONLY",
        "source_title": "De-listed Companies",
        "source_family": "twse_delisted_company_table",
        "source_endpoint": "company/suspendListing"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "twse_only_scope",
    "no_tpex_coverage",
    "no_unified_security_lifecycle_claim"
  ],
  "warnings": [
    "not_investment_advice",
    "twse_only_scope"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "stock_delisting_lifecycle",
    "scope": "stock_delisting_lifecycle_twse_only",
    "row_count": 2
  }
}`,
  },
  "stock-price-limit-daily": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "stock_price_limit_daily",
  "request_context": {
    "scope": "tpex_price_limit_only",
    "coverage_type": "latest_snapshot_baseline",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "ticker": null,
      "market": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-07-14",
    "max_trade_date": "2026-07-14"
  },
  "quality": {
    "row_count": 2,
    "ticker_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "official_stock_price_limit_daily"
    ],
    "source_families": [
      "TWSE_TWT49U_EX_RIGHT"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-07-14",
      "ticker": "1402",
      "market": "TWSE",
      "limit_up_price": 28.15,
      "limit_down_price": 23.05,
      "reference_price": 25.6,
      "source_provider": "twse_official",
      "source_role": "official_stock_price_limit_daily",
      "source_family": "TWSE_TWT49U_EX_RIGHT",
      "lineage": {
        "event_type": "ex_dividend",
        "endpoint_name": "twse_exchangeReport_TWT49U",
        "event_category": "息",
        "knowledge_date": "2026-07-14",
        "reference_basis": "開盤競價基準"
      },
      "data_gaps": []
    },
    {
      "trade_date": "2026-07-14",
      "ticker": "1603",
      "market": "TWSE",
      "limit_up_price": 32.8,
      "limit_down_price": 26.9,
      "reference_price": 29.85,
      "source_provider": "twse_official",
      "source_role": "official_stock_price_limit_daily",
      "source_family": "TWSE_TWT49U_EX_RIGHT",
      "lineage": {
        "event_type": "ex_dividend",
        "endpoint_name": "twse_exchangeReport_TWT49U",
        "event_category": "息",
        "knowledge_date": "2026-07-14",
        "reference_basis": "開盤競價基準"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "tpex_only",
    "no_twse_price_limit_coverage",
    "no_historical_full_depth_claim"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "envelope": {
    "dataset_id": "stock_price_limit_daily",
    "scope": "tpex_price_limit_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "stock_price_limit_daily",
  "request_context": {
    "scope": "tpex_price_limit_only",
    "coverage_type": "latest_snapshot_baseline",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "ticker": null,
      "market": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-07-14",
    "max_trade_date": "2026-07-14"
  },
  "quality": {
    "row_count": 2,
    "ticker_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "official_stock_price_limit_daily"
    ],
    "source_families": [
      "TWSE_TWT49U_EX_RIGHT"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-07-14",
      "ticker": "1402",
      "market": "TWSE",
      "limit_up_price": 28.15,
      "limit_down_price": 23.05,
      "reference_price": 25.6,
      "source_provider": "twse_official",
      "source_role": "official_stock_price_limit_daily",
      "source_family": "TWSE_TWT49U_EX_RIGHT",
      "lineage": {
        "event_type": "ex_dividend",
        "endpoint_name": "twse_exchangeReport_TWT49U",
        "event_category": "<Chinese value - see the zh page>",
        "knowledge_date": "2026-07-14",
        "reference_basis": "<Chinese value - see the zh page>"
      },
      "data_gaps": []
    },
    {
      "trade_date": "2026-07-14",
      "ticker": "1603",
      "market": "TWSE",
      "limit_up_price": 32.8,
      "limit_down_price": 26.9,
      "reference_price": 29.85,
      "source_provider": "twse_official",
      "source_role": "official_stock_price_limit_daily",
      "source_family": "TWSE_TWT49U_EX_RIGHT",
      "lineage": {
        "event_type": "ex_dividend",
        "endpoint_name": "twse_exchangeReport_TWT49U",
        "event_category": "<Chinese value - see the zh page>",
        "knowledge_date": "2026-07-14",
        "reference_basis": "<Chinese value - see the zh page>"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "tpex_only",
    "no_twse_price_limit_coverage",
    "no_historical_full_depth_claim"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "envelope": {
    "dataset_id": "stock_price_limit_daily",
    "scope": "tpex_price_limit_only",
    "row_count": 2
  }
}`,
  },
  "stock-split-par-value-events": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "stock_split_par_value_events",
  "request_context": {
    "scope": "stock_split_par_value_events_twse_only",
    "coverage_type": "twse_split_par_value_reference",
    "snapshot_mode": "current_snapshot_only",
    "filters": {
      "market": "TWSE",
      "security_code": null,
      "date_from": null,
      "date_to": null,
      "event_type": null,
      "source_family": null,
      "limit": 2
    },
    "min_event_date": "2026-01-19",
    "max_event_date": "2026-04-22"
  },
  "quality": {
    "row_count": 2,
    "security_code_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "twse_official"
    ],
    "source_roles": [
      "official_twse_etf_split_reverse_split_reference_price",
      "official_twse_par_value_change_reference_price"
    ],
    "source_families": [
      "twse_etf_split_reverse_split_reference_price",
      "twse_reference_price_after_par_value_change"
    ]
  },
  "error": null,
  "data": [
    {
      "market": "TWSE",
      "security_code": "00674R",
      "security_type": "etf_certificate",
      "event_type": "split_reference_price",
      "event_date": "2026-04-22",
      "announcement_date": null,
      "suspend_trading_date": null,
      "resume_trading_date": "2026-04-22",
      "par_value_before": null,
      "par_value_after": null,
      "par_value_ratio": null,
      "closing_price_on_last_trading_day": 5.18,
      "reference_price": 25.9,
      "limit_up_price": 9999.95,
      "limit_down_price": 0.01,
      "opening_reference_price": 25.9,
      "source_provider": "twse_official",
      "source_role": "official_twse_etf_split_reverse_split_reference_price",
      "source_family": "twse_etf_split_reverse_split_reference_price",
      "source_event_ref": "TWSE:TWTCAU|00674R|2026-04-22",
      "lineage": {
        "source_url": "https://www.twse.com.tw/rwd/en/split/TWTCAU?response=json",
        "source_family": "twse_etf_split_reverse_split_reference_price",
        "official_fields": [
          "Resume Trading Date",
          "Security Code",
          "Closing Price on The Last Trading Day"
        ],
        "source_row_type": "etf_split_reverse_split_reference_price"
      },
      "data_gaps": [
        "announcement_date_missing"
      ]
    },
    {
      "market": "TWSE",
      "security_code": "7780",
      "security_type": "stock",
      "event_type": "split_reference_price",
      "event_date": "2026-01-19",
      "announcement_date": null,
      "suspend_trading_date": null,
      "resume_trading_date": "2026-01-19",
      "par_value_before": null,
      "par_value_after": null,
      "par_value_ratio": null,
      "closing_price_on_last_trading_day": 185.0,
      "reference_price": 18.5,
      "limit_up_price": 20.35,
      "limit_down_price": 16.65,
      "opening_reference_price": 18.5,
      "source_provider": "twse_official",
      "source_role": "official_twse_par_value_change_reference_price",
      "source_family": "twse_reference_price_after_par_value_change",
      "source_event_ref": "TWSE:TWTB8U|7780|2026-01-19",
      "lineage": {
        "source_url": "https://www.twse.com.tw/rwd/en/change/TWTB8U?response=json",
        "source_family": "twse_reference_price_after_par_value_change",
        "official_fields": [
          "Resume Trading Date",
          "Security Code",
          "Closing Price on The Last Trading Day"
        ],
        "source_row_type": "reference_price"
      },
      "data_gaps": [
        "announcement_date_missing"
      ]
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "twse_only_scope",
    "no_tpex_coverage",
    "no_unified_security_lifecycle_claim"
  ],
  "warnings": [
    "not_investment_advice",
    "twse_only_scope"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "stock_split_par_value_events",
    "scope": "stock_split_par_value_events_twse_only",
    "row_count": 2
  }
}`,
  },
  "taifex-institutional-flow": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "taifex_institutional_flow",
  "request_context": {
    "scope": "taifex_futures_options_institutional_flow_only",
    "coverage_type": "bounded_verified_snapshot_set",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "product_type": null,
      "contract_code": null,
      "investor_type": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-06-05",
    "max_trade_date": "2026-06-05"
  },
  "quality": {
    "row_count": 2,
    "contract_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "taifex_official"
    ],
    "source_roles": [
      "official_taifex_institutional_daily"
    ],
    "source_families": [
      "official_taifex_derivatives_public_page"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-06-05",
      "product_type": "futures",
      "market_type": "futures",
      "product_contract": "ETF期貨",
      "expiry_month": "ALL",
      "investor_type": "外資",
      "long_open_interest": 17842.0,
      "short_open_interest": 4475.0,
      "net_open_interest": 13367.0,
      "long_volume": 8418.0,
      "short_volume": 8978.0,
      "net_volume": -560.0,
      "source_provider": "taifex_official",
      "source_role": "official_taifex_institutional_daily",
      "source_family": "official_taifex_derivatives_public_page",
      "lineage": {
        "dataset": "futures_institutional_investors_daily",
        "trade_date": "2026-06-05",
        "official_first": true,
        "aggregate_scope": "all_expiries"
      },
      "data_gaps": [
        "{'reasons': ['optional_missing_currency', 'optional_missing_market_scope', 'optional_missing_settlement_type', 'optional_missing_unit', 'upstream_expiry_month_unavailable_aggregate_scope']}"
      ]
    },
    {
      "trade_date": "2026-06-05",
      "product_type": "futures",
      "market_type": "futures",
      "product_contract": "ETF期貨",
      "expiry_month": "ALL",
      "investor_type": "投信",
      "long_open_interest": 4306.0,
      "short_open_interest": 50.0,
      "net_open_interest": 4256.0,
      "long_volume": 0.0,
      "short_volume": 0.0,
      "net_volume": 0.0,
      "source_provider": "taifex_official",
      "source_role": "official_taifex_institutional_daily",
      "source_family": "official_taifex_derivatives_public_page",
      "lineage": {
        "dataset": "futures_institutional_investors_daily",
        "trade_date": "2026-06-05",
        "official_first": true,
        "aggregate_scope": "all_expiries"
      },
      "data_gaps": [
        "{'reasons': ['optional_missing_currency', 'optional_missing_market_scope', 'optional_missing_settlement_type', 'optional_missing_unit', 'upstream_expiry_month_unavailable_aggregate_scope']}"
      ]
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "futures_options_institutional_flow_only",
    "no_settlement_price",
    "not_options_daily_price_table"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "envelope": {
    "dataset_id": "taifex_institutional_flow",
    "scope": "taifex_futures_options_institutional_flow_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "taifex_institutional_flow",
  "request_context": {
    "scope": "taifex_futures_options_institutional_flow_only",
    "coverage_type": "bounded_verified_snapshot_set",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "product_type": null,
      "contract_code": null,
      "investor_type": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-06-05",
    "max_trade_date": "2026-06-05"
  },
  "quality": {
    "row_count": 2,
    "contract_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "taifex_official"
    ],
    "source_roles": [
      "official_taifex_institutional_daily"
    ],
    "source_families": [
      "official_taifex_derivatives_public_page"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-06-05",
      "product_type": "futures",
      "market_type": "futures",
      "product_contract": "<Chinese value - see the zh page>",
      "expiry_month": "ALL",
      "investor_type": "<Chinese value - see the zh page>",
      "long_open_interest": 17842.0,
      "short_open_interest": 4475.0,
      "net_open_interest": 13367.0,
      "long_volume": 8418.0,
      "short_volume": 8978.0,
      "net_volume": -560.0,
      "source_provider": "taifex_official",
      "source_role": "official_taifex_institutional_daily",
      "source_family": "official_taifex_derivatives_public_page",
      "lineage": {
        "dataset": "futures_institutional_investors_daily",
        "trade_date": "2026-06-05",
        "official_first": true,
        "aggregate_scope": "all_expiries"
      },
      "data_gaps": [
        "{'reasons': ['optional_missing_currency', 'optional_missing_market_scope', 'optional_missing_settlement_type', 'optional_missing_unit', 'upstream_expiry_month_unavailable_aggregate_scope']}"
      ]
    },
    {
      "trade_date": "2026-06-05",
      "product_type": "futures",
      "market_type": "futures",
      "product_contract": "<Chinese value - see the zh page>",
      "expiry_month": "ALL",
      "investor_type": "<Chinese value - see the zh page>",
      "long_open_interest": 4306.0,
      "short_open_interest": 50.0,
      "net_open_interest": 4256.0,
      "long_volume": 0.0,
      "short_volume": 0.0,
      "net_volume": 0.0,
      "source_provider": "taifex_official",
      "source_role": "official_taifex_institutional_daily",
      "source_family": "official_taifex_derivatives_public_page",
      "lineage": {
        "dataset": "futures_institutional_investors_daily",
        "trade_date": "2026-06-05",
        "official_first": true,
        "aggregate_scope": "all_expiries"
      },
      "data_gaps": [
        "{'reasons': ['optional_missing_currency', 'optional_missing_market_scope', 'optional_missing_settlement_type', 'optional_missing_unit', 'upstream_expiry_month_unavailable_aggregate_scope']}"
      ]
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "futures_options_institutional_flow_only",
    "no_settlement_price",
    "not_options_daily_price_table"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "envelope": {
    "dataset_id": "taifex_institutional_flow",
    "scope": "taifex_futures_options_institutional_flow_only",
    "row_count": 2
  }
}`,
  },
  "taifex-options-settlement-price": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "taifex_options_settlement_price",
  "request_context": {
    "scope": "taifex_options_settlement_price_only",
    "coverage_type": "bounded_verified_snapshot_set",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "contract_code": null,
      "expiry_month": null,
      "call_put": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-06-04",
    "max_trade_date": "2026-06-04"
  },
  "quality": {
    "row_count": 2,
    "contract_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "taifex_official"
    ],
    "source_roles": [
      "options_daily_quote_settlement_open_interest"
    ],
    "source_families": [
      "optDataDown"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "CALL",
      "strike_price": 60.0,
      "expiry_month": "202606",
      "settlement_price": 51.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "一般"
      },
      "data_gaps": []
    },
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "CALL",
      "strike_price": 65.0,
      "expiry_month": "202606",
      "settlement_price": 46.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "一般"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "options_settlement_only",
    "single_trading_date_baseline",
    "no_futures_settlement"
  ],
  "warnings": [
    "not_investment_advice",
    "options_settlement_only"
  ],
  "envelope": {
    "dataset_id": "taifex_options_settlement_price",
    "scope": "taifex_options_settlement_price_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "taifex_options_settlement_price",
  "request_context": {
    "scope": "taifex_options_settlement_price_only",
    "coverage_type": "bounded_verified_snapshot_set",
    "filters": {
      "trade_date": null,
      "date_from": null,
      "date_to": null,
      "contract_code": null,
      "expiry_month": null,
      "call_put": null,
      "source_family": null,
      "limit": 2
    },
    "min_trade_date": "2026-06-04",
    "max_trade_date": "2026-06-04"
  },
  "quality": {
    "row_count": 2,
    "contract_count": 1,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "taifex_official"
    ],
    "source_roles": [
      "options_daily_quote_settlement_open_interest"
    ],
    "source_families": [
      "optDataDown"
    ]
  },
  "error": null,
  "data": [
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "CALL",
      "strike_price": 60.0,
      "expiry_month": "202606",
      "settlement_price": 51.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "<Chinese value - see the zh page>"
      },
      "data_gaps": []
    },
    {
      "trade_date": "2026-06-04",
      "contract_symbol": "CAO",
      "option_type": "CALL",
      "strike_price": 65.0,
      "expiry_month": "202606",
      "settlement_price": 46.0,
      "source_provider": "taifex_official",
      "source_role": "options_daily_quote_settlement_open_interest",
      "source_family": "optDataDown",
      "lineage": {
        "commodity_id": "CAO    ",
        "queryEndDate": "2026/06/04",
        "queryStartDate": "2026/06/04",
        "trading_session": "<Chinese value - see the zh page>"
      },
      "data_gaps": []
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "options_settlement_only",
    "single_trading_date_baseline",
    "no_futures_settlement"
  ],
  "warnings": [
    "not_investment_advice",
    "options_settlement_only"
  ],
  "envelope": {
    "dataset_id": "taifex_options_settlement_price",
    "scope": "taifex_options_settlement_price_only",
    "row_count": 2
  }
}`,
  },
  "tpex-daily-price": {
    rowsKey: "rows",
    envelopeKeys: ["count", "data_as_of", "dataset", "lineage", "meta", "rows", "source_role"],
    zh: `{
  "dataset": "tpex_daily_price",
  "rows": [],
  "count": 0,
  "data_as_of": "2026-07-17",
  "source_role": null,
  "lineage": null,
  "meta": {
    "last_trading_day": "2026-07-16",
    "market_status": [
      {
        "date": "2026-07-16",
        "status": "open"
      },
      {
        "date": "2026-07-17",
        "status": "unknown"
      },
      {
        "date": "2026-07-18",
        "status": "unknown"
      }
    ]
  }
}`,
  },
  "twse-daily-price": {
    rowsKey: "rows",
    envelopeKeys: ["count", "data_as_of", "dataset", "lineage", "meta", "rows", "source_role"],
    zh: `{
  "dataset": "twse_daily_price",
  "rows": [
    {
      "symbol": "2330",
      "date": "2026-07-17",
      "open": 2375.0,
      "high": 2395.0,
      "low": 2290.0,
      "close": 2290.0,
      "volume_shares": 97362670,
      "turnover_value": 229051751965,
      "trade_count": 1150086,
      "price_change": -180.0,
      "price_change_sign": "-",
      "price_method": "official",
      "price_confidence": null
    },
    {
      "symbol": "2330",
      "date": "2026-07-16",
      "open": 2430.0,
      "high": 2470.0,
      "low": 2420.0,
      "close": 2470.0,
      "volume_shares": 30538604,
      "turnover_value": 74750491934,
      "trade_count": 97957,
      "price_change": 30.0,
      "price_change_sign": "+",
      "price_method": "official",
      "price_confidence": null
    }
  ],
  "count": 2,
  "data_as_of": "2026-07-17",
  "source_role": "official_twse",
  "lineage": {
    "provider": "TWSE",
    "official_source": [
      "official_twse"
    ],
    "source_endpoints": [
      "twse_mi_index_allbut0999_json",
      "twse_official_stock_day",
      "twse_stock_day_all_openapi"
    ],
    "table": "normalized_twse_daily_prices",
    "dataset": "twse_daily_price",
    "not_investment_advice": true
  },
  "meta": {
    "last_trading_day": "2026-07-16",
    "market_status": [
      {
        "date": "2026-07-16",
        "status": "open"
      },
      {
        "date": "2026-07-17",
        "status": "unknown"
      },
      {
        "date": "2026-07-18",
        "status": "unknown"
      }
    ]
  }
}`,
  },
  "valuation-core-daily": {
    rowsKey: "data",
    envelopeKeys: ["api_version", "data", "data_as_of", "data_count", "dataset", "dataset_id", "dataset_version", "error", "known_gaps", "lineage", "quality", "release_date", "release_version", "request_context", "warnings"],
    zh: `{
  "api_version": "v2",
  "dataset": "valuation_core_daily",
  "dataset_version": "v2.0.0-preview",
  "release_version": "v2.2026-05-28.preview",
  "release_date": "2026-05-28",
  "data_as_of": "2026-05-28",
  "request_context": {
    "ticker": "1101",
    "as_of_date": "2026-05-28",
    "family": "fundamentals",
    "field_group_type": "canonical",
    "dataset_view": "valuation_core_daily_v1",
    "source_table": "valuation_core_daily",
    "scope": "valuation_core_daily_only",
    "coverage_type": "seeded_anchor_snapshot_set",
    "supported_sort_by": [
      "date"
    ],
    "supported_filter_fields": [
      "ticker",
      "date_from",
      "date_to"
    ],
    "date_range": {
      "date_from": null,
      "date_to": null
    }
  },
  "data": [
    {
      "ticker": "1101",
      "date": "2026-05-28",
      "close": 23.65,
      "shares_outstanding": null,
      "market_cap": null,
      "trailing_12m_revenue": null,
      "ps": null,
      "book_value_per_share": null,
      "pe": null,
      "pb": 0.75,
      "dividend_per_share_ttm": null,
      "dividend_yield": 3.38,
      "source_summary": {
        "pb": "valuation_data_items",
        "pe": "missing",
        "ps": "missing_direct_source",
        "close": "technical_indicators_items",
        "market_cap": "missing_direct_source",
        "dividend_yield": "valuation_data_items",
        "shares_outstanding": "missing_direct_source",
        "book_value_per_share": "missing_source_gap",
        "trailing_12m_revenue": "missing_source_gap"
      },
      "notes": "missing_dependencies=shares_outstanding,market_cap,ps,book_value_per_share,trailing_12m_revenue"
    },
    {
      "ticker": "1102",
      "date": "2026-05-28",
      "close": 32.4,
      "shares_outstanding": null,
      "market_cap": null,
      "trailing_12m_revenue": null,
      "ps": null,
      "book_value_per_share": null,
      "pe": 10.87,
      "pb": 0.65,
      "dividend_per_share_ttm": null,
      "dividend_yield": 7.1,
      "source_summary": {
        "pb": "valuation_data_items",
        "pe": "valuation_data_items",
        "ps": "missing_direct_source",
        "close": "technical_indicators_items",
        "market_cap": "missing_direct_source",
        "dividend_yield": "valuation_data_items",
        "shares_outstanding": "missing_direct_source",
        "book_value_per_share": "missing_source_gap",
        "trailing_12m_revenue": "missing_source_gap"
      },
      "notes": "missing_dependencies=shares_outstanding,market_cap,ps,book_value_per_share,trailing_12m_revenue"
    }
  ],
  "quality": {
    "freshness_state": "fresh",
    "freshness_as_of": "2026-05-28",
    "completeness_ratio": 1.0,
    "quality_status": "ready"
  },
  "lineage": {
    "source_role": "canonical",
    "selected_source": "valuation_core_daily",
    "fallback_chain": [
      "valuation_data_items",
      "financial_metrics_items",
      "ticker_metadata"
    ],
    "policy_notes": [
      "official/public-first canonical",
      "valuation_core_daily is the seeded anchor surface for valuation facts",
      "raw_payload excluded from the public read route"
    ]
  },
  "error": {
    "error_code": null,
    "error_message": null,
    "dataset": "valuation_core_daily",
    "request_id": "read-api-20260528",
    "blocking_gate": null
  },
  "dataset_id": "valuation_core_daily",
  "data_count": 2,
  "known_gaps": [
    "raw_payload_excluded",
    "not_investment_advice"
  ],
  "warnings": [
    "not_investment_advice",
    "raw_payload_excluded"
  ]
}`,
  },
  "warrants-reference": {
    rowsKey: "data",
    envelopeKeys: ["data", "data_count", "dataset_id", "envelope", "error", "known_gaps", "lineage", "not_investment_advice", "quality", "request_context", "warnings"],
    zh: `{
  "dataset_id": "warrants_reference",
  "request_context": {
    "scope": "warrants_reference_latest_snapshot_only",
    "coverage_type": "latest_snapshot_only",
    "filters": {
      "warrant_code": null,
      "market": null,
      "underlying_ticker": null,
      "issuer": null,
      "warrant_type": null,
      "source_family": null,
      "limit": 2
    }
  },
  "quality": {
    "row_count": 2,
    "warrant_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "tpex_official"
    ],
    "source_roles": [
      "official_tpex_warrant_issue"
    ],
    "source_families": [
      "tpex_warrant_issue"
    ]
  },
  "error": null,
  "data": [
    {
      "warrant_code": "700008",
      "market": "TPEx",
      "underlying_ticker": "4749",
      "issuer": null,
      "warrant_type": "認購",
      "strike_price": null,
      "exercise_ratio": null,
      "listing_date": "2025-10-01",
      "expiry_date": "2026-06-30",
      "settlement_style": null,
      "exercise_style": null,
      "source_provider": "tpex_official",
      "source_role": "official_tpex_warrant_issue",
      "source_family": "tpex_warrant_issue",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "tpex_warrant_issue"
      },
      "data_gaps": [
        "issuer_not_provided_by_source"
      ],
      "not_investment_advice": true
    },
    {
      "warrant_code": "700018",
      "market": "TPEx",
      "underlying_ticker": "3324",
      "issuer": null,
      "warrant_type": "認購",
      "strike_price": null,
      "exercise_ratio": null,
      "listing_date": "2025-10-01",
      "expiry_date": "2026-06-30",
      "settlement_style": null,
      "exercise_style": null,
      "source_provider": "tpex_official",
      "source_role": "official_tpex_warrant_issue",
      "source_family": "tpex_warrant_issue",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "tpex_warrant_issue"
      },
      "data_gaps": [
        "issuer_not_provided_by_source"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_snapshot_only",
    "reference_only_not_daily_quotes",
    "no_daily_quote_coverage"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "warrants_reference",
    "scope": "warrants_reference_latest_snapshot_only",
    "row_count": 2
  }
}`,
    en: `{
  "dataset_id": "warrants_reference",
  "request_context": {
    "scope": "warrants_reference_latest_snapshot_only",
    "coverage_type": "latest_snapshot_only",
    "filters": {
      "warrant_code": null,
      "market": null,
      "underlying_ticker": null,
      "issuer": null,
      "warrant_type": null,
      "source_family": null,
      "limit": 2
    }
  },
  "quality": {
    "row_count": 2,
    "warrant_count": 2,
    "sensitive_fields_exposed": false
  },
  "lineage": {
    "source_providers": [
      "tpex_official"
    ],
    "source_roles": [
      "official_tpex_warrant_issue"
    ],
    "source_families": [
      "tpex_warrant_issue"
    ]
  },
  "error": null,
  "data": [
    {
      "warrant_code": "700008",
      "market": "TPEx",
      "underlying_ticker": "4749",
      "issuer": null,
      "warrant_type": "<Chinese value - see the zh page>",
      "strike_price": null,
      "exercise_ratio": null,
      "listing_date": "2025-10-01",
      "expiry_date": "2026-06-30",
      "settlement_style": null,
      "exercise_style": null,
      "source_provider": "tpex_official",
      "source_role": "official_tpex_warrant_issue",
      "source_family": "tpex_warrant_issue",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "tpex_warrant_issue"
      },
      "data_gaps": [
        "issuer_not_provided_by_source"
      ],
      "not_investment_advice": true
    },
    {
      "warrant_code": "700018",
      "market": "TPEx",
      "underlying_ticker": "3324",
      "issuer": null,
      "warrant_type": "<Chinese value - see the zh page>",
      "strike_price": null,
      "exercise_ratio": null,
      "listing_date": "2025-10-01",
      "expiry_date": "2026-06-30",
      "settlement_style": null,
      "exercise_style": null,
      "source_provider": "tpex_official",
      "source_role": "official_tpex_warrant_issue",
      "source_family": "tpex_warrant_issue",
      "lineage": {
        "depth": "latest_snapshot_only",
        "source_name": "tpex_warrant_issue"
      },
      "data_gaps": [
        "issuer_not_provided_by_source"
      ],
      "not_investment_advice": true
    }
  ],
  "data_count": 2,
  "known_gaps": [
    "latest_snapshot_only",
    "reference_only_not_daily_quotes",
    "no_daily_quote_coverage"
  ],
  "warnings": [
    "not_investment_advice"
  ],
  "not_investment_advice": true,
  "envelope": {
    "dataset_id": "warrants_reference",
    "scope": "warrants_reference_latest_snapshot_only",
    "row_count": 2
  }
}`,
  },
};

export function getApiCapture(slug: string): ApiCapture | null {
  return API_CAPTURES[slug] ?? null;
}

// The captured body for a locale. /en falls back to the zh body only when that body is already
// CJK-free (no `en` variant was needed).
export function apiCaptureBody(capture: ApiCapture, locale: string): string {
  return locale === "en" ? capture.en ?? capture.zh : capture.zh;
}
