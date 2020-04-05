import { useMutation } from '@apollo/react-hooks'
import { ENCRYPT } from 'mutations/utility'

type Props = {
    loading: boolean
    encrypt: (text: string) => Promise<string>
}

const useEncryption = (): Props => {
    const [encryptMutation, { loading }] = useMutation(ENCRYPT)

    const encrypt = async (text: string): Promise<string> => {
        const result = await encryptMutation({
            variables: {
                text
            }
        })

        return result.data.encrypt
    }

    return { loading, encrypt }
}

export default useEncryption
