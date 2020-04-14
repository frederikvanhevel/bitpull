import { gql } from 'apollo-boost'
import client from 'graphql/apollo-client'
import { Plan } from 'typedefs/graphql'
import { changePlan, changePlanVariables } from './typedefs/changePlan'
import { getPaymentDetails } from 'queries/payment/typedefs/getPaymentDetails'
import { GET_PAYMENT_DETAILS } from 'queries/payment'

export const UPDATE_PAYMENT = gql`
    mutation updatePayment($input: TokenInput!) {
        updatePayment(input: $input)
    }
`

export const CHANGE_PLAN = gql`
    mutation changePlan($plan: Plan!) {
        changePlan(plan: $plan)
    }
`

export const changePaymentPlan = (plan: Plan) => {
    return client.mutate<changePlan, changePlanVariables>({
        mutation: CHANGE_PLAN,
        variables: {
            plan
        },
        update: (cache, { data: mutationData }) => {
            if (!mutationData) return

            try {
                const data = cache.readQuery<getPaymentDetails>({
                    query: GET_PAYMENT_DETAILS
                })

                if (!data) return

                cache.writeQuery<getPaymentDetails>({
                    query: GET_PAYMENT_DETAILS,
                    data: {
                        getPaymentDetails: {
                            ...data.getPaymentDetails,
                            plan
                        }
                    }
                })
            } catch (error) {}
        }
    })
}
