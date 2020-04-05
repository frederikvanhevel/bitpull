import nock from 'nock'

import xmlNodeMock from '../__mocks__/xml.mock'
import parseXmlNode from '../'

const xml = `
    <?xml version="1.0"?>
    <ikot>
       <rooms>
          <room>
             <id>44816</id>
             <street>Spanjaardstraat</street>
          </room>
          <room>
             <id>44813</id>
             <street>Lange Winkelstraat</street>
          </room>
       </rooms>
       <next>https://ikot.be/xml/2</next>
    </ikot>
`

describe('Xml node', () => {
    test('should parse a url node and get the xml', async () => {
        nock('https://brik.mykot.be').get('/rooms.xml').reply(200, xml)

        const expected = {
            ikot: {
                next: 'https://ikot.be/xml/2',
                rooms: {
                    room: [
                        { id: '44816', street: 'Spanjaardstraat' },
                        { id: '44813', street: 'Lange Winkelstraat' }
                    ]
                }
            }
        }

        const result = await parseXmlNode(
            { node: xmlNodeMock },
            { integrations: [], settings: {} },
            // @ts-ignore
            {}
        )

        expect(result.parentResult).toEqual(expected)
    })
})
