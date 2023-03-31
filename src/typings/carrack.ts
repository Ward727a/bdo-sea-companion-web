

type carrackDict = {
    boat: [
        {
            [key: string]: [
                {
                    image: [
                        string
                    ],
                    need: [
                        {
                            [key: string]: [
                                {
                                    need: [
                                        {
                                            [key: string]: [
                                                string
                                            ]
                                        }
                                    ]
                                    quantity: [
                                        string
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            balance: [
                {
                    image: [
                        string
                    ],
                    need: [
                        {
                            [key: string]: [
                                {
                                    need: [
                                        {
                                            [key: string]: [
                                                string
                                            ]
                                        }
                                    ]
                                    quantity: [
                                        string
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            volante: [
                {
                    image: [
                        string
                    ],
                    need: [
                        {
                            [key: string]: [
                                {
                                    need: [
                                        {
                                            [key: string]: [
                                                string
                                            ]
                                        }
                                    ]
                                    quantity: [
                                        string
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            valor: [
                {
                    image: [
                        string
                    ],
                    need: [
                        {
                            [key: string]: [
                                {
                                    need: [
                                        {
                                            [key: string]: [
                                                string
                                            ]
                                        }
                                    ]
                                    quantity: [
                                        string
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    items: [
        {
            [key: string]: [
                {
                    image: [
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
                    trackable?:[
                        string
                    ]
                }
            ]
        }
    ]
}

export default carrackDict;