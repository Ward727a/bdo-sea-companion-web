
// This is the language dictionary type. It is used to define the structure of the language files.
// The language file are located in the assets/xml/lang folder.
type langDict = {
    pageTitle: [
        {
            [key:string]:  [
                string
            ];
        }
    ]
    navigation: [
        {
            barter: [
                string
            ];
            carrack:  [
                string
            ];
        }
    ]
    items: [
        {
            [key:string]:  [
                {
                    name: [
                        string
                    ]
                    description: [
                        string
                    ]
                }
            ]

        }
    ]
    language: [
        {
            selectLanguage: [
                string
            ]
        }
    ]
    barter: [
        {
            left:[
                {
                    storageTitle: [
                        string
                    ],
                    lastSpecialBarterAt: [
                        string
                    ],
                    estimatedNext: [
                        string
                    ],
                    searchPlaceholder: [
                        string
                    ],
                    searchAdvice: [
                        string
                    ],
                    specialBarterAdvice: [
                        string
                    ]
                }
            ]
            table:[
                {
                    name: [
                        string
                    ]
                    tier: [
                        string
                    ]
                    qty: [
                        string
                    ],
                    tableAdvice: [
                        string
                    ]
                }
            ],
            bottom:[
                {
                    left: [
                        {
                            title: [
                                string
                            ],
                            tresholdAdvice: [
                                string
                            ]
                        }
                    ]
                    right: [
                        {
                            totalStoragesValue: [
                                string
                            ]
                        }
                    ]
                }
            ],
            filters:[
                {
                    ignoreAncado: [
                        string
                    ],
                    ignoreIliya: [
                        string
                    ],
                    ignoreEpheria: [
                        string
                    ]
                }
            ]
        }
    ]
    carrack:[
        {
            selectScreen: [
                {
                    title: [
                        string
                    ]
                }
            ],
            menu: [
                {
                    inventory: [
                        string
                    ],
                    tracker: [
                        string
                    ],
                    carrackAdvice: [
                        string
                    ]
                }
            ]
            totalNeeded:[
                {
                    title: [
                        string
                    ],
                    daily: [
                        string
                    ],
                    coin: [
                        string
                    ],
                    barter: [
                        string
                    ],
                    totalNeededAdviceContent: [
                        string
                    ],
                    totalNeededAdviceTitle: [
                        string
                    ]
                }
            ]
            type: [
                {
                    advance: [
                        string
                    ],
                    balance: [
                        string
                    ],
                    volante: [
                        string
                    ],
                    valor: [
                        string
                    ]
                }
            ]
            items: [
                {
                    [key:string]:  [
                        {
                            name: [
                                string
                            ]
                            description: [
                                string
                            ]
                        }
                    ]
                }
            ],
            tracker: [
                {
                    trackerAdvice: [
                        string
                    ]
                }
            ]
        }
    ]
    reset: [
        {
            title: [
                string
            ]
            content: [
                {
                    first: [
                        string
                    ]
                    second: [
                        string
                    ]
                    third: [
                        string
                    ]
                }
            ]
            confirmation: [
                {
                    first: [
                        string
                    ]
                    second: [
                        string
                    ]
                    third: [
                        string
                    ]
                }
            ]
            cancel: [
                {
                    first: [
                        string
                    ]
                    second: [
                        string
                    ]
                    third: [
                        string
                    ]
                }
            ]
        }
    ]
}

export default langDict;