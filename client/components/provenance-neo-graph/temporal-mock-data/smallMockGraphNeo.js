/* eslint-disable camelcase */
export const neoJson = {
    results: [
        {
            columns: [
                'Activity',
                'Reference',
                'Agent'
            ],
            data: [
                {
                    graph: {
                        nodes: [
                            {
                                id: '160',
                                labels: [
                                    'Activity'
                                ],
                                properties: {
                                    name: 'Activity_16',
                                    created_at: '2019-07-10T23:41:18Z',
                                    id: 'e37a5c1a-a3a6-11e9-ad73-4c32759a3015',
                                    class: 'Starred'
                                }
                            },
                            {
                                id: '161',
                                labels: [
                                    'Reference'
                                ],
                                properties: {
                                    target_version_id: '1.0',
                                    subclass: 'State',
                                    name: 'Reference_29',
                                    created_at: '2019-07-10T23:41:20Z',
                                    target_id: 'TargetID_29',
                                    id: 'e481788c-a3a6-11e9-ad73-4c32759a3015',
                                    class: 'Resource'
                                }
                            },
                            {
                                id: '162',
                                labels: [
                                    'Reference'
                                ],
                                properties: {
                                    target_version_id: '1.0',
                                    subclass: 'Message',
                                    name: 'Reference_30',
                                    created_at: '2019-07-10T23:41:20Z',
                                    target_id: 'TargetID_30',
                                    id: 'e4818296-a3a6-11e9-ad73-4c32759a3015',
                                    class: 'Message'
                                }
                            },
                            {
                                id: '163',
                                labels: [
                                    'Agent'
                                ],
                                properties: {
                                    name: 'User_8',
                                    created_at: '2019-07-10T23:41:20Z',
                                    id: 'e4818d90-a3a6-11e9-ad73-4c32759a3015',
                                    user_id: 'UserID_8'
                                }
                            },
                            {
                                id: '164',
                                labels: [
                                    'Reference'
                                ],
                                properties: {
                                    target_version_id: '1.0',
                                    subclass: 'Star',
                                    name: 'Reference_31',
                                    created_at: '2019-07-10T23:41:20Z',
                                    target_id: 'TargetID_31',
                                    id: 'e4819574-a3a6-11e9-ad73-4c32759a3015',
                                    class: 'Insight'
                                }
                            },
                            {
                                id: '165',
                                labels: [
                                    'Reference'
                                ],
                                properties: {
                                    target_version_id: '1.0',
                                    subclass: 'State',
                                    name: 'Reference_42',
                                    created_at: '2019-07-10T23:41:20Z',
                                    target_id: 'TargetID_42',
                                    id: 'e4bc204a-a3a6-11e9-ad73-4c32759a3015',
                                    class: 'Resource'
                                }
                            },
                            {
                                id: '166',
                                labels: [
                                    'Activity'
                                ],
                                properties: {
                                    name: 'Activity_22',
                                    created_at: '2019-07-10T23:41:18Z',
                                    id: 'e37a6a3e-a3a6-11e9-ad73-4c32759a3015',
                                    class: 'Tool session'
                                }
                            },
                            {
                                id: '167',
                                labels: [
                                    'Agent'
                                ],
                                properties: {
                                    name: 'User_4',
                                    created_at: '2019-07-10T23:41:19Z',
                                    id: 'e404e222-a3a6-11e9-ad73-4c32759a3015',
                                    user_id: 'UserID_4'
                                }
                            }
                        ],
                        relationships: [
                            {
                                id: '160',
                                type: [
                                    'USED'
                                ],
                                startNode: '160',
                                endNode: '167',
                                properties: {
                                    start_node_role: 'None',
                                    id: 'e48188d6-a3a6-11e9-ad73-4c32759a3015',
                                    end_node_role: 'entityToStar'
                                },
                                source: '160',
                                target: '167',
                                linknum: 1
                            },
                            {
                                id: '161',
                                type: [
                                    'USED'
                                ],
                                startNode: '167',
                                endNode: '161',
                                properties: {
                                    start_node_role: 'None',
                                    id: 'e4818afc-a3a6-11e9-ad73-4c32759a3015',
                                    end_node_role: 'entityToStar'
                                },
                                source: '167',
                                target: '161',
                                linknum: 1
                            },
                            {
                                id: '162',
                                type: [
                                    'WASATTRIBUTEDTO'
                                ],
                                startNode: '162',
                                endNode: '166',
                                properties: {
                                    start_node_role: 'star',
                                    id: 'e4819d3a-a3a6-11e9-ad73-4c32759a3015',
                                    end_node_role: 'creator'
                                },
                                source: '162',
                                target: '166',
                                linknum: 1
                            },
                            {
                                id: '163',
                                type: [
                                    'WASGENERATEDBY'
                                ],
                                startNode: '166',
                                endNode: '163',
                                properties: {
                                    start_node_role: 'star',
                                    id: 'e4819b28-a3a6-11e9-ad73-4c32759a3015',
                                    end_node_role: 'None'
                                },
                                source: '166',
                                target: '163',
                                linknum: 1
                            },
                            {
                                id: '164',
                                type: [
                                    'WASATTRIBUTEDTO'
                                ],
                                startNode: '164',
                                endNode: '165',
                                properties: {
                                    start_node_role: 'state',
                                    id: 'e4bc2a4a-a3a6-11e9-ad73-4c32759a3015',
                                    end_node_role: 'analyst'
                                },
                                source: '164',
                                target: '165',
                                linknum: 1
                            },
                            {
                                id: '165',
                                type: [
                                    'WASASSOCIATEDWITH'
                                ],
                                startNode: '165',
                                endNode: '160',
                                properties: {
                                    start_node_role: 'None',
                                    id: 'e4bc1d70-a3a6-11e9-ad73-4c32759a3015',
                                    end_node_role: 'analyst'
                                },
                                source: '165',
                                target: '160',
                                linknum: 1
                            }
                        ]
                    }
                }
            ]
        }
    ]
};
