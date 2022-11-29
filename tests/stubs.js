const GENESIS_BLOCK_RAW = {
    "block": {
        "header": {
            "version": 0,
            "bits": 0,
            "nonce": [],
            "b_num": 0,
            "seed_value": [],
            "previous_hash": null,
            "merkle_root_hash": ""
        },
        "transactions": [
            "000001",
            "000002",
            "000003",
            "000004",
            "000005",
            "000006",
            "000007",
            "000008",
            "000009"
        ]
    },
    "mining_tx_hash_and_nonces": {
        "1": [
            "g458b6a340cdb3f40f66adff12637aeb",
            [
                112,
                129,
                50,
                22,
                128,
                18,
                179,
                120,
                132,
                54,
                18,
                195,
                81,
                17,
                184,
                28
            ]
        ]
    }
};

export const GENESIS_BLOCK_WITH_TX = [
    "eefe384b4d3b90efbfea42cde0f4aaa0723048f461be1d767eb9c602b7a1aca0",
    GENESIS_BLOCK_RAW
];

export const GENESIS_BLOCK = {
    "Block": GENESIS_BLOCK_RAW
};