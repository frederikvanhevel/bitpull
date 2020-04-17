import Traverser from './traverse'
import { FlowNode, NodeType } from './typedefs/node'
import { IntegrationType } from './typedefs/common'

const salt = '623801b13c6b84f39a0a2d1f8400843b7b2b54b8b24ac7ca26dec5b11d74431d'

const start = async () => {
    const traverser = new Traverser({
        onLog: (node: FlowNode, message: string) =>
            console.log(node.type, '-', message),
        settings: {
            encryption: {
                version: 'v1',
                key: 'undefinedsecret'
            }
            // debug: true
        },
        integrations: [
            {
                type: IntegrationType.GOOGLE_DRIVE,
                active: true,
                settings: {
                    access_token:
                        'ya29.a0Adw1xeVsDhYQ7cxzkLMIQWYtj11SUX5_iJwHQyVInUOgD4qBpWL11Hejna8KZVjw7FufcfbYbECjNRZ8ahiczwAp-QMzAg8_9WB2sn85KfolCNYRUYku3cywPwGAj_ZxwkoOChjtl2vuUe1X-g8VkOtigXVdclDePBs'
                }
            },
            {
                type: IntegrationType.GITHUB,
                active: true,
                settings: {
                    access_token: 'e66c7aa84331bde17f95584857240f7003094c82'
                }
            }
        ]
    })

    // const node = {
    //     id: '0',
    //     type: NodeType.HTML,
    //     link: 'https://brik.mykot.be/rooms',
    //     children: [
    //         {
    //             id: '1',
    //             type: NodeType.PAGINATION,
    //             pagination: {
    //                 nextLink: {
    //                     selector: '.pager__item--next a',
    //                     attribute: 'href'
    //                 }
    //             },
    //             goToPerPage: '2',
    //             gotoOnEnd: '3',
    //             children: [
    //                 {
    //                     id: '2',
    //                     type: NodeType.COLLECT,
    //                     fields: [
    //                         {
    //                             label: 'url',
    //                             selector: '.field-name-field-photo a',
    //                             attribute: 'href'
    //                         },
    //                         {
    //                             label: 'price',
    //                             selector: '.field__price'
    //                         }
    //                     ],
    //                     children: [
    //                         {
    //                             id: '4',
    //                             type: NodeType.HTML,
    //                             linkedField: 'url',
    //                             children: [
    //                                 {
    //                                     id: '5',
    //                                     type: NodeType.COLLECT,
    //                                     append: true,
    //                                     fields: [
    //                                         {
    //                                             label: 'type',
    //                                             selector:
    //                                                 '.container .field--name-field-room-type .field__item'
    //                                         },
    //                                         {
    //                                             label: 'surface',
    //                                             selector:
    //                                                 '.container .field--name-field-surface-area'
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }

    // const node = {
    //     id: '90b86d98-6bf8-4d8a-97b9-0d7baf0b1b8b',
    //     type: 'HTML',
    //     link:
    //         'https://www.google.com/search?ei=TuJoXsvyOsaW8gL035H4DQ&q=puppies&oq=puppies&gs_l=psy-ab.3..0i67j0l9.4263824.4264812..4264949...0.4..0.204.747.5j1j1......0....1..gws-wiz.......0i71j0i273j0i10.KtliezPHYE4&ved=0ahUKEwjL0cW5vpLoAhVGi1wKHfRvBN8Q4dUDCAs&uact=5',
    //     parseJavascript: true,
    //     children: [
    //         {
    //             id: '1367970f-afe9-45d3-a652-7cfea8bb99b8',
    //             type: 'PAGINATION',
    //             pagination: {
    //                 nextLink: {
    //                     attribute: 'href',
    //                     value: '#pnnext'
    //                 }
    //             },
    //             goToPerPage: 'a9db7ce5-4ff7-4850-9a54-6aeb6c43f86a',
    //             children: [
    //                 {
    //                     id: 'a9db7ce5-4ff7-4850-9a54-6aeb6c43f86a',
    //                     type: 'COLLECT',
    //                     fields: [
    //                         {
    //                             id: '6ed15349-1671-4020-a3ad-1aa838282b25',
    //                             label: 'title',
    //                             selector: {
    //                                 value: '.DKV0Md',
    //                                 attribute: 'text'
    //                             }
    //                         },
    //                         {
    //                             id: 'be3b7c8f-2a01-4b36-b6e4-07ab8f696074',
    //                             label: 'description',
    //                             selector: {
    //                                 value: '.st',
    //                                 attribute: 'text'
    //                             }
    //                         },
    //                         {
    //                             id: 'be63abba-b78f-4f0e-aaa0-3ded5af4df26',
    //                             label: 'link',
    //                             selector: {
    //                                 value: '.DKV0Md',
    //                                 attribute: 'href'
    //                             }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     id: '8c2e16ce-beac-450f-b4f7-0a8608d7b079',
    //                     type: 'EXCEL',
    //                     children: [
    //                         {
    //                             id: 'bf8a094c-543e-49b7-b5e8-5afcc31b880e',
    //                             type: 'GOOGLE_DRIVE'
    //                         }
    //                     ]
    //                 }
    //             ],
    //             gotoOnEnd: '8c2e16ce-beac-450f-b4f7-0a8608d7b079',
    //             linkLimit: 1
    //         }
    //     ]
    // }

    // const node = {
    //     id: '3a208d25-e429-46c3-b228-18a27ff04a9e',
    //     type: 'HTML',
    //     link: 'https://www.nytimes.com/',
    //     parseJavascript: true,
    //     children: [
    //         {
    //             id: '183675a1-a29e-478a-afaa-2cfadbbab278',
    //             type: 'COLLECT',
    //             fields: [
    //                 {
    //                     id: 'b0971d9b-ceda-406f-8cc0-087146e83acc',
    //                     label: 'headline',
    //                     selector: {
    //                         value: '.balancedHeadline',
    //                         attribute: 'text'
    //                     }
    //                 }
    //             ],
    //             children: [
    //                 {
    //                     id: '0d653518-f677-4ed7-a327-96789d775b9d',
    //                     type: 'JSON',
    //                     children: [
    //                         {
    //                             id: 'b16777f8-e26e-4676-94c2-7f3d6518b15f',
    //                             type: 'GITHUB',
    //                             repo: 'frederikvanhevel/test-data',
    //                             children: [
    //                                 {
    //                                     id:
    //                                         '35fa648d-ce0f-49ca-88d3-81e6ce7261e0',
    //                                     type: 'EMAIL'
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }

    // @ts-ignore
    const node = {
        id: '17ced605-55a0-4abe-9d9a-12771c70bc7f',
        type: 'HTML',
        link:
            'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggI46AdIM1gEaDuIAQGYAQm4AQfIAQzYAQHoAQH4AQuIAgGoAgO4AsqinvMFwAIB&sid=d796c97a4629035a48bf44282c4d1c91&sb=1&src=searchresults&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.en-gb.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaDuIAQGYAQm4AQfIAQzYAQHoAQH4AQuIAgGoAgO4AsqinvMFwAIB%3Bsid%3Dd796c97a4629035a48bf44282c4d1c91%3Btmpl%3Dsearchresults%3Bclass_interval%3D1%3Bdest_id%3D-553173%3Bdest_type%3Dcity%3Bdtdisc%3D0%3Bfrom_sf%3D1%3Bgroup_adults%3D2%3Bgroup_children%3D0%3Binac%3D0%3Bindex_postcard%3D0%3Blabel_click%3Dundef%3Bno_rooms%3D1%3Boffset%3D0%3Bpostcard%3D0%3Braw_dest_type%3Dcity%3Broom1%3DA%252CA%3Bsb_price_type%3Dtotal%3Bshw_aparth%3D1%3Bslp_r_match%3D0%3Bsrc%3Dindex%3Bsrc_elem%3Dsb%3Bsrpvid%3Db8d65c68f3a00103%3Bss%3DPrague%3Bss_all%3D0%3Bssb%3Dempty%3Bsshis%3D0%3Bssne%3DPrague%3Bssne_untouched%3DPrague%3Btop_ufis%3D1%26%3B&ss=new+york&is_ski_area=0&ssne=Prague&ssne_untouched=Prague&city=-553173&checkin_year=&checkin_month=&checkout_year=&checkout_month=&group_adults=2&group_children=0&no_rooms=1&from_sf=1',
        parseJavascript: true,
        children: [
            {
                id: 'b91976d9-1b5c-4f29-90f6-445ec01227f7',
                type: 'COLLECT',
                limit: 1,
                fields: [
                    {
                        id: '17e8dc38-c8eb-47ab-8ab0-705021cd2b0c',
                        label: 'hotel',
                        selector: {
                            value: '.sr-hotel__name',
                            attribute: 'text'
                        }
                    },
                    {
                        id: '0f9ec05a-096c-4823-a916-d85d9f54de41',
                        label: 'link',
                        selector: {
                            value: '.sr-hotel__name',
                            attribute: 'href'
                        }
                    }
                ],
                children: [
                    {
                        id: 'a201e1a9-3912-420f-b862-09c24fcf7776',
                        type: 'HTML',
                        linkedField: 'link'
                    }
                ]
            }
        ]
    }

    // console.log(JSON.stringify(node))

    // @ts-ignore
    // const result = await traverser.run(node)

    const result = await traverser.parseNode({ node })

    console.log(result.flat(Infinity)[0].parentResult)

    // const result = await traverser.parseNode({ node })

    // console.log(result)

    await traverser.cleanup()
}

start()
