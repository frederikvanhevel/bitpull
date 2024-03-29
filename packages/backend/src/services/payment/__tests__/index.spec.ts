import faker from 'faker'
import { mocked } from 'ts-jest/utils'
import PaymentModel, {
    PaymentDocument,
    MAX_REFERRED_CREDITS,
    PaymentPlan,
    REFERRED_CREDIT_AMOUNT
} from 'models/payment'
import { PaymentFactory } from 'models/payment/__mocks__/payment.mock'
import Stripe from 'components/stripe'
import MailService from 'services/mail'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { Token, Card } from 'typedefs/graphql'
import UserModel, { UserDocument } from 'models/user'
import ReferralService from 'services/referral'
import PaymentService from '../index'

jest.mock('models/payment')
const mockedPaymentModel = mocked(PaymentModel)

jest.mock('models/user')
const mockedUserModel = mocked(UserModel)

jest.mock('components/stripe')
const mockedStripe = mocked(Stripe)

jest.mock('services/referral')
const mockedReferralService = mocked(ReferralService)

jest.mock('services/mail')
const mockedMailService = mocked(MailService)

describe('Payment service', () => {
    it('should get payment details', async () => {
        const payment = PaymentFactory.getSingleRecord()
        const returnedPayment = {
            ...(payment as PaymentDocument),
            select: () => returnedPayment,
            lean: () => payment
        }
        // @ts-ignore
        mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)
        const result = await PaymentService.getDetails(returnedPayment.owner)
        expect(result).toEqual(payment)
    })

    it('should create a customer in stripe', async () => {
        const user = UserFactory.getSingleRecord()

        mockedStripe.createCustomer.mockResolvedValue('123')
        mockedStripe.createSubscription.mockResolvedValue({
            subscriptionId: '1',
            planId: '2'
        })

        await PaymentService.createCustomer(user, PaymentPlan.FREE)

        expect(mockedStripe.createCustomer).toHaveBeenCalledWith(
            user.email,
            `${user.firstName} ${user.lastName}`
        )
        expect(mockedPaymentModel).toHaveBeenCalledWith({
            customerId: '123',
            owner: user.id,
            plan: PaymentPlan.FREE,
            subscriptionId: '1',
            planId: '2'
        })
        // @ts-ignore
        expect(mockedPaymentModel.prototype.save).toHaveBeenCalled()
    })

    it('should update user info', async () => {
        const payment = PaymentFactory.getSingleRecord()
        const returnedPayment = {
            ...(payment as PaymentDocument),
            lean: () => payment
        }

        // @ts-ignore
        mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

        const data = {
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        }
        await PaymentService.updateUserInfo(payment.owner, data)

        expect(mockedStripe.updateCustomer).toHaveBeenCalledWith(
            payment.customerId,
            data
        )
    })

    describe('Usage reporting', () => {
        it('should report usage when user has no credits', async () => {
            const payment = PaymentFactory.getSingleRecord({
                plan: PaymentPlan.METERED
            })
            const stats = {
                duration: 44,
                pageCount: 30,
                pages: []
            }
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn()
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.reportUsage(payment.owner, stats)

            expect(mockedStripe.reportUsage).toHaveBeenCalledWith(
                payment.planId,
                stats.pageCount
            )
            expect(returnedPayment.save).not.toHaveBeenCalled()
        })

        it('should not report usage when user has enough credits', async () => {
            const payment = PaymentFactory.getSingleRecord({
                plan: PaymentPlan.METERED
            })
            payment.credits = 100
            const stats = {
                duration: 44,
                pageCount: 30,
                pages: []
            }
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn()
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.reportUsage(payment.owner, stats)

            expect(mockedStripe.reportUsage).not.toHaveBeenCalled()
            expect(returnedPayment.credits).toEqual(70)
            expect(returnedPayment.save).toHaveBeenCalled()
        })

        it('should report usage when user has some credits but not enough', async () => {
            const payment = PaymentFactory.getSingleRecord({
                plan: PaymentPlan.METERED
            })
            payment.credits = 15
            const stats = {
                duration: 44,
                pageCount: 30,
                pages: []
            }
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn()
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.reportUsage(payment.owner, stats)

            expect(mockedStripe.reportUsage).toHaveBeenCalledWith(
                payment.planId,
                15
            )
            expect(returnedPayment.credits).toEqual(0)
            expect(returnedPayment.save).toHaveBeenCalled()
            expect(
                mockedMailService.sendOutOfCreditsEmail
            ).toHaveBeenCalledWith(payment.owner)
        })
    })

    describe('Check payment status', () => {
        it('should return true when card is added and has credits', async () => {
            const payment = PaymentFactory.getSingleRecord({
                credits: 30
            })
            const returnedPayment = {
                ...(payment as PaymentDocument),
                lean: () => payment
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            const result = await PaymentService.hasCreditsRemaining(
                payment.owner.id
            )
            expect(result).toBeTruthy()
        })

        it('should return false when card is added but has no credits', async () => {
            const payment = PaymentFactory.getSingleRecord({
                credits: 0
            })
            const returnedPayment = {
                ...(payment as PaymentDocument),
                lean: () => payment
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            const result = await PaymentService.hasCreditsRemaining(
                payment.owner.id
            )
            expect(result).toBeFalsy()
        })

        it('should return false when user has not enough credits', async () => {
            const payment = PaymentFactory.getSingleRecord()
            payment.credits = 0
            const returnedPayment = {
                ...(payment as PaymentDocument),
                lean: () => payment
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            const result = await PaymentService.hasCreditsRemaining(
                payment.owner.id
            )
            expect(result).toBeFalsy()
        })

        it('should return true when user still has credits but no card', async () => {
            const payment = PaymentFactory.getSingleRecord()
            payment.sourceId = undefined
            payment.credits = 1000
            const returnedPayment = {
                ...(payment as PaymentDocument),
                lean: () => payment
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            const result = await PaymentService.hasCreditsRemaining(
                payment.owner.id
            )
            expect(result).toBeTruthy()
        })
    })

    describe('Update payment details', () => {
        it('should save payment details when there are none yet', async () => {
            const payment = PaymentFactory.getSingleRecord()
            payment.sourceId = undefined
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn(),
                toJSON: () => payment
            }
            const token = {
                id: faker.random.uuid(),
                card: {
                    brand: faker.random.word(),
                    last4: faker.random.alphaNumeric(4)
                } as Card
            } as Token

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.updatePayment(payment.owner, token)

            expect(mockedStripe.setCardToken).toHaveBeenCalledWith(
                payment.customerId,
                token.id
            )
            expect(mockedReferralService.award).toHaveBeenCalledWith(
                payment.owner
            )
            expect(returnedPayment.sourceId).toEqual(token.id)
            expect(returnedPayment.sourceBrand).toEqual(token.card.brand)
            expect(returnedPayment.sourceLast4).toEqual(token.card.last4)
            expect(returnedPayment.save).toHaveBeenCalled()
        })

        it('should update payment details when there are already available', async () => {
            const payment = PaymentFactory.getSingleRecord()
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn(),
                toJSON: () => payment
            }
            const token = {
                id: faker.random.uuid(),
                card: {
                    brand: faker.random.word(),
                    last4: faker.random.alphaNumeric(4)
                } as Card
            } as Token

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.updatePayment(payment.owner, token)

            expect(mockedStripe.setCardToken).toHaveBeenCalledWith(
                payment.customerId,
                token.id
            )
            expect(mockedReferralService.award).not.toHaveBeenCalled()
            expect(returnedPayment.sourceId).toEqual(token.id)
            expect(returnedPayment.sourceBrand).toEqual(token.card.brand)
            expect(returnedPayment.sourceLast4).toEqual(token.card.last4)
            expect(returnedPayment.save).toHaveBeenCalled()
        })
    })

    it('should disable account', async () => {
        const payment = PaymentFactory.getSingleRecord()
        const returnedPayment = {
            ...(payment as PaymentDocument),
            save: jest.fn()
        }
        const returnedUser = {
            ...(payment.owner as UserDocument),
            lean: () => payment.owner
        }

        // @ts-ignore
        mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

        // @ts-ignore
        mockedUserModel.findById.mockReturnValueOnce(returnedUser)

        await PaymentService.disable(payment.customerId)

        expect(returnedPayment.credits).toEqual(0)
        expect(returnedPayment.save).toHaveBeenCalled()
        expect(mockedMailService.sendPaymentFailedEmail).toHaveBeenCalledWith(
            payment.owner.email
        )
    })

    it('should get invoices', async () => {
        const payment = PaymentFactory.getSingleRecord()
        const returnedPayment = {
            ...(payment as PaymentDocument),
            lean: () => payment
        }

        // @ts-ignore
        mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

        await PaymentService.getInvoices(payment.owner)

        expect(mockedStripe.getInvoices).toHaveBeenCalledWith(
            payment.customerId
        )
    })

    it('should get usage summary', async () => {
        const payment = PaymentFactory.getSingleRecord({
            plan: PaymentPlan.METERED
        })
        const returnedPayment = {
            ...(payment as PaymentDocument),
            lean: () => payment
        }

        // @ts-ignore
        mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

        await PaymentService.getUsageSummary(payment.owner)

        expect(mockedStripe.getUsageSummary).toHaveBeenCalledWith(
            payment.planId
        )
    })

    describe.only('Referrals', () => {
        it('should add referral credits if under total referred amount', async () => {
            const payment = PaymentFactory.getSingleRecord()
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn()
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.addReferralCredits(payment.owner)

            expect(returnedPayment.earnedCredits).toEqual(
                REFERRED_CREDIT_AMOUNT
            )
            expect(returnedPayment.credits).toEqual(REFERRED_CREDIT_AMOUNT)
            expect(returnedPayment.save).toHaveBeenCalled()
        })

        it('should partially add referral credits if over total referred amount', async () => {
            const payment = PaymentFactory.getSingleRecord()
            payment.earnedCredits = MAX_REFERRED_CREDITS - 10
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn()
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.addReferralCredits(payment.owner)

            expect(returnedPayment.earnedCredits).toEqual(MAX_REFERRED_CREDITS)
            expect(returnedPayment.credits).toEqual(10)
            expect(returnedPayment.save).toHaveBeenCalled()
        })

        it('should not add referral credits if completely over total referred amount', async () => {
            const payment = PaymentFactory.getSingleRecord()
            payment.earnedCredits = MAX_REFERRED_CREDITS - 10
            const returnedPayment = {
                ...(payment as PaymentDocument),
                save: jest.fn()
            }

            // @ts-ignore
            mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

            await PaymentService.addReferralCredits(payment.owner)

            expect(returnedPayment.earnedCredits).toEqual(MAX_REFERRED_CREDITS)
            expect(returnedPayment.credits).toEqual(10)
            expect(returnedPayment.save).toHaveBeenCalled()
        })
    })

    it('should change plan', async () => {
        const payment = PaymentFactory.getSingleRecord()
        const returnedPayment = {
            ...(payment as PaymentDocument),
            save: jest.fn()
        }

        // @ts-ignore
        mockedPaymentModel.findOne.mockReturnValueOnce(returnedPayment)

        // @ts-ignore
        await PaymentService.changePlan(payment.owner, PaymentPlan.BUSINESS)

        expect(mockedStripe.changePlan).toHaveBeenCalledWith(
            returnedPayment,
            PaymentPlan.BUSINESS
        )
    })
})
