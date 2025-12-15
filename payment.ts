import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import queueService from './queue'
import { generateRandomId } from './utils'

const prisma = new PrismaClient()

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Payment Configuration
const config = {
  currency: 'usd',
  plans: {
    basic: {
      id: 'basic_plan',
      name: 'Basic Plan',
      price: 999, // $9.99
      features: [
        'Up to 50 pages per book',
        'PDF & EPUB export',
        'Basic templates',
        'Standard generation speed',
      ],
      pageLimit: 50,
      exportLimit: 2, // exports per month
    },
    professional: {
      id: 'professional_plan',
      name: 'Professional Plan',
      price: 2999, // $29.99
      features: [
        'Up to 150 pages per book',
        'All export formats',
        'Advanced templates',
        'Priority generation',
        'Coloring book generation',
      ],
      pageLimit: 150,
      exportLimit: 10, // exports per month
    },
    enterprise: {
      id: 'enterprise_plan',
      name: 'Enterprise Plan',
      price: 9999, // $99.99
      features: [
        'Unlimited pages',
        'Unlimited exports',
        'All premium features',
        'Dedicated support',
        'API access',
      ],
      pageLimit: 0, // unlimited
      exportLimit: 0, // unlimited
    },
  },
  payPerExport: {
    pdf: 199, // $1.99
    epub: 199, // $1.99
    docx: 199, // $1.99
    audiobook: 499, // $4.99
    coloringBook: 299, // $2.99
    fullPackage: 799, // $7.99
  },
  creditPacks: {
    small: {
      id: 'credit_small',
      name: 'Small Credit Pack',
      price: 999, // $9.99
      credits: 10,
      bonus: 0,
    },
    medium: {
      id: 'credit_medium',
      name: 'Medium Credit Pack',
      price: 2499, // $24.99
      credits: 30,
      bonus: 5,
    },
    large: {
      id: 'credit_large',
      name: 'Large Credit Pack',
      price: 4999, // $49.99
      credits: 75,
      bonus: 25,
    },
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}

// Database Models
interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

interface UserCreditBalance {
  id: string
  userId: string
  balance: number
  lastUpdated: Date
}

interface PaymentTransaction {
  id: string
  userId: string
  amount: number
  currency: string
  type: 'subscription' | 'credit_pack' | 'one_time_export'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  stripePaymentId: string
  metadata: any
  createdAt: Date
  updatedAt: Date
}

class PaymentService {
  constructor() {
    // Initialize Stripe webhook if in production
    if (process.env.NODE_ENV === 'production' && config.webhookSecret) {
      this.setupWebhooks()
    }
  }

  private async setupWebhooks() {
    // This would be set up in your API routes
    console.log('[PAYMENT] Webhook setup would be configured in API routes')
  }

  // Create a customer in Stripe
  async createCustomer(
    userId: string,
    email: string,
    name?: string,
    metadata?: any
  ): Promise<{ success: boolean, customerId?: string, error?: string }> {
    try {
      const customer = await stripe.customers.create({
        email,
        name: name || 'Unknown',
        metadata: {
          userId,
          platform: 'magnum-opus',
          ...metadata,
        },
      })

      // Update user in database with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      })

      return { success: true, customerId: customer.id }
    } catch (error) {
      console.error('[PAYMENT] Failed to create customer:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Create a subscription
  async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean, subscriptionId?: string, clientSecret?: string, error?: string }> {
    try {
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Check if user already has an active subscription
      if (user.subscription && user.subscription.status === 'active') {
        throw new Error('User already has an active subscription')
      }

      // Get Stripe customer ID or create new customer
      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customerResult = await this.createCustomer(userId, user.email, user.name)
        if (!customerResult.success || !customerResult.customerId) {
          throw new Error(customerResult.error || 'Failed to create customer')
        }
        customerId = customerResult.customerId
      }

      // Get the plan configuration
      const plan = config.plans[planId as keyof typeof config.plans]
      if (!plan) {
        throw new Error('Invalid plan ID')
      }

      // Create subscription in Stripe
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: config.currency,
            product_data: {
              name: plan.name,
              metadata: {
                planId,
                userId,
              },
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      })

      // Get the payment intent for client-side confirmation
      const paymentIntent = (subscription.latest_invoice as any).payment_intent

      // Save subscription to database
      await prisma.userSubscription.upsert({
        where: { userId },
        create: {
          id: generateRandomId('sub'),
          userId,
          planId,
          status: 'active',
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: subscription.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          planId,
          status: 'active',
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: subscription.id,
          updatedAt: new Date(),
        },
      })

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      }
    } catch (error) {
      console.error('[PAYMENT] Failed to create subscription:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update subscription payment method
  async updatePaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean, error?: string }> {
    try {
      // Get user subscription
      const subscription = await prisma.userSubscription.findUnique({
        where: { userId },
      })

      if (!subscription || !subscription.stripeSubscriptionId) {
        throw new Error('No active subscription found')
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: (await prisma.user.findUnique({ where: { id: userId } }))?.stripeCustomerId,
      })

      // Update default payment method
      await stripe.customers.update(
        (await prisma.user.findUnique({ where: { id: userId } }))?.stripeCustomerId!,
        {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        }
      )

      return { success: true }
    } catch (error) {
      console.error('[PAYMENT] Failed to update payment method:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Cancel subscription
  async cancelSubscription(
    userId: string,
    cancelImmediately: boolean = false
  ): Promise<{ success: boolean, error?: string }> {
    try {
      // Get user subscription
      const subscription = await prisma.userSubscription.findUnique({
        where: { userId },
      })

      if (!subscription || !subscription.stripeSubscriptionId) {
        throw new Error('No active subscription found')
      }

      // Cancel in Stripe
      const canceledSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: !cancelImmediately,
          ...(cancelImmediately && { status: 'canceled' }),
        }
      )

      // Update in database
      await prisma.userSubscription.update({
        where: { userId },
        data: {
          status: cancelImmediately ? 'canceled' : 'active',
          cancelAtPeriodEnd: !cancelImmediately,
          updatedAt: new Date(),
        },
      })

      return { success: true }
    } catch (error) {
      console.error('[PAYMENT] Failed to cancel subscription:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Purchase credit pack
  async purchaseCreditPack(
    userId: string,
    packId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean, clientSecret?: string, error?: string }> {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Get credit pack configuration
      const pack = config.creditPacks[packId as keyof typeof config.creditPacks]
      if (!pack) {
        throw new Error('Invalid credit pack ID')
      }

      // Get or create Stripe customer
      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customerResult = await this.createCustomer(userId, user.email, user.name)
        if (!customerResult.success || !customerResult.customerId) {
          throw new Error(customerResult.error || 'Failed to create customer')
        }
        customerId = customerResult.customerId
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: pack.price,
        currency: config.currency,
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          userId,
          packId,
          type: 'credit_pack',
        },
      })

      // Record transaction
      await prisma.paymentTransaction.create({
        data: {
          id: generateRandomId('txn'),
          userId,
          amount: pack.price,
          currency: config.currency,
          type: 'credit_pack',
          status: 'completed',
          stripePaymentId: paymentIntent.id,
          metadata: {
            packId,
            creditsPurchased: pack.credits + pack.bonus,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      // Update user credits
      await this.addCredits(userId, pack.credits + pack.bonus, 'credit_pack_purchase')

      return { success: true, clientSecret: paymentIntent.client_secret }
    } catch (error) {
      console.error('[PAYMENT] Failed to purchase credit pack:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Pay for one-time export
  async payForExport(
    userId: string,
    exportType: string,
    paymentMethodId: string
  ): Promise<{ success: boolean, clientSecret?: string, error?: string }> {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Get export price
      const price = config.payPerExport[exportType as keyof typeof config.payPerExport]
      if (!price) {
        throw new Error('Invalid export type')
      }

      // Get or create Stripe customer
      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customerResult = await this.createCustomer(userId, user.email, user.name)
        if (!customerResult.success || !customerResult.customerId) {
          throw new Error(customerResult.error || 'Failed to create customer')
        }
        customerId = customerResult.customerId
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: config.currency,
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          userId,
          exportType,
          type: 'one_time_export',
        },
      })

      // Record transaction
      await prisma.paymentTransaction.create({
        data: {
          id: generateRandomId('txn'),
          userId,
          amount: price,
          currency: config.currency,
          type: 'one_time_export',
          status: 'completed',
          stripePaymentId: paymentIntent.id,
          metadata: {
            exportType,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      return { success: true, clientSecret: paymentIntent.client_secret }
    } catch (error) {
      console.error('[PAYMENT] Failed to process export payment:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Add credits to user account
  async addCredits(