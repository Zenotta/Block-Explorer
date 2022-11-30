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

export const SAMPLE_TX = {
    "inputs": [
        {
            "previous_out": {
                "t_hash": "000001",
                "n": 0
            },
            "script_signature": {
                "stack": [
                    {
                        "Bytes": "060000000000000030303030303100000000"
                    },
                    {
                        "Signature": [
                            70,
                            50,
                            14,
                            178,
                            177,
                            99,
                            145,
                            20,
                            152,
                            219,
                            68,
                            10,
                            24,
                            182,
                            34,
                            130,
                            139,
                            66,
                            255,
                            153,
                            114,
                            204,
                            192,
                            10,
                            253,
                            47,
                            123,
                            251,
                            12,
                            254,
                            103,
                            89,
                            240,
                            153,
                            232,
                            44,
                            209,
                            93,
                            109,
                            250,
                            223,
                            148,
                            251,
                            220,
                            206,
                            203,
                            228,
                            169,
                            16,
                            8,
                            142,
                            181,
                            84,
                            150,
                            21,
                            183,
                            150,
                            72,
                            18,
                            53,
                            153,
                            248,
                            213,
                            2
                        ]
                    },
                    {
                        "PubKey": [
                            244,
                            240,
                            193,
                            169,
                            81,
                            149,
                            158,
                            136,
                            254,
                            52,
                            61,
                            229,
                            162,
                            235,
                            231,
                            239,
                            188,
                            177,
                            84,
                            34,
                            9,
                            11,
                            53,
                            73,
                            87,
                            127,
                            66,
                            77,
                            182,
                            133,
                            28,
                            165
                        ]
                    },
                    {
                        "Op": "OP_DUP"
                    },
                    {
                        "Op": "OP_HASH256_V0"
                    },
                    {
                        "PubKeyHash": "7027eda6d9ef25d7e1c4f833475e544f"
                    },
                    {
                        "Op": "OP_EQUALVERIFY"
                    },
                    {
                        "Op": "OP_CHECKSIG"
                    }
                ]
            }
        },
        {
            "previous_out": {
                "t_hash": "000002",
                "n": 0
            },
            "script_signature": {
                "stack": [
                    {
                        "Bytes": "060000000000000030303030303200000000"
                    },
                    {
                        "Signature": [
                            232,
                            221,
                            139,
                            251,
                            117,
                            38,
                            93,
                            12,
                            77,
                            112,
                            224,
                            37,
                            52,
                            95,
                            180,
                            101,
                            164,
                            183,
                            122,
                            8,
                            195,
                            165,
                            100,
                            224,
                            130,
                            98,
                            1,
                            153,
                            9,
                            133,
                            119,
                            207,
                            243,
                            146,
                            106,
                            213,
                            191,
                            23,
                            63,
                            114,
                            23,
                            219,
                            110,
                            1,
                            165,
                            179,
                            161,
                            211,
                            236,
                            35,
                            77,
                            112,
                            116,
                            121,
                            67,
                            243,
                            228,
                            27,
                            10,
                            14,
                            211,
                            156,
                            120,
                            12
                        ]
                    },
                    {
                        "PubKey": [
                            69,
                            128,
                            84,
                            12,
                            254,
                            85,
                            105,
                            204,
                            126,
                            146,
                            98,
                            172,
                            155,
                            85,
                            88,
                            21,
                            200,
                            233,
                            85,
                            249,
                            248,
                            174,
                            101,
                            159,
                            16,
                            145,
                            230,
                            221,
                            157,
                            104,
                            115,
                            26
                        ]
                    },
                    {
                        "Op": "OP_DUP"
                    },
                    {
                        "Op": "OP_HASH256_V0"
                    },
                    {
                        "PubKeyHash": "be570a79d3066e78714600f5eb0e9b91"
                    },
                    {
                        "Op": "OP_EQUALVERIFY"
                    },
                    {
                        "Op": "OP_CHECKSIG"
                    }
                ]
            }
        }
    ],
    "outputs": [
        {
            "value": {
                "Token": 15624000000
            },
            "locktime": 0,
            "drs_block_hash": null,
            "drs_tx_hash": null,
            "script_public_key": "5c64683ffc4bd82696f60852adf49887bed5c6d1bb2501ff9970268aa7daa68b"
        },
        {
            "value": {
                "Token": 9576000000
            },
            "locktime": 0,
            "drs_block_hash": null,
            "drs_tx_hash": null,
            "script_public_key": "81b6a54444f59d12f49e666eec9cee131bf38646129ab535dba39ce138f1d39e"
        }
    ],
    "version": 1,
    "druid_info": null
}