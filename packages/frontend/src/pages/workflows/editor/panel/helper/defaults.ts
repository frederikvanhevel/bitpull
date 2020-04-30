import { NodeType, CollectField } from "@bitpull/worker/lib/typedefs";
import { uuid } from "uuidv4";
import { Attributes } from "../modules/common/Selector";

export const getNewCollectField = (): CollectField => ({
    id: uuid(),
    label: '',
    selector: {
        value: '',
        attribute: Attributes.TEXT
    }
})

export const getDefaultProps = (type: NodeType) => {
    switch (type) {
        case NodeType.HTML:
            return { link: '' }
            case NodeType.HTML_LINKED:
                return { linkedField: '' }
                case NodeType.HTML_MULTIPLE:
                return { links: [] }
                case NodeType.COLLECT:
                    return { fields: [getNewCollectField()] }
    }

}