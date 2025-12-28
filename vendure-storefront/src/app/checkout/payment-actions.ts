'use server';

import { mutate } from '@/lib/vendure/api';
import { gql } from 'graphql-tag';

const AddPaymentToOrderMutation = gql`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        code
        state
        total
        lines {
          id
          quantity
          linePriceWithTax
        }
      }
      ... on PaymentFailedError {
        errorCode
        message
      }
      ... on PaymentDeclinedError {
        errorCode
        message
      }
      ... on OrderStateTransitionError {
        errorCode
        message
      }
      ... on IneligibleOrderError {
        errorCode
        message
      }
    }
  }
`;

const CreateStripePaymentIntentMutation = gql`
  mutation CreateStripePaymentIntent {
    createStripePaymentIntent
  }
`;

interface AddPaymentResult {
  __typename: string;
  id?: string;
  code?: string;
  state?: string;
  total?: number;
  lines?: Array<{ id: string; quantity: number; linePriceWithTax: number }>;
  message?: string;
  errorCode?: string;
}

interface ProcessStripePaymentResponse {
  success: boolean;
  error?: string;
  orderId?: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string | null;
  error?: string;
}

export async function processStripePayment(
  orderId: string,
  stripePaymentIntentId: string
): Promise<ProcessStripePaymentResponse> {
  try {
    const result = await mutate(
      AddPaymentToOrderMutation,
      {
        input: {
          method: 'stripe',
          metadata: {
            stripePaymentIntentId,
          },
        },
      },
      { useAuthToken: true }
    ) as unknown as { data: { addPaymentToOrder: AddPaymentResult } };

    const paymentResult = result.data.addPaymentToOrder;

    if (paymentResult.__typename === 'Order') {
      return {
        success: true,
        orderId: paymentResult.id,
      };
    }

    return {
      success: false,
      error: paymentResult.message || 'Falha ao processar pagamento',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      success: false,
      error: message,
    };
  }
}

export async function createStripePaymentIntent(
  orderId: string
): Promise<CreatePaymentIntentResponse> {
  try {
    const result = await mutate(
      CreateStripePaymentIntentMutation,
      {},
      { useAuthToken: true }
    ) as unknown as { data: { createStripePaymentIntent: string } };

    if (!result || !result.data || !result.data.createStripePaymentIntent) {
      console.error("Erro Vendure Stripe:", result);
      throw new Error('O Vendure não retornou um clientSecret.');
    }

    const clientSecret = result.data.createStripePaymentIntent;
    
    return { clientSecret: clientSecret };

  } catch (error) {
    console.error("Erro na createStripePaymentIntent:", error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar intenção de pagamento';
    return {
      clientSecret: null,
      error: message,
    };
  }
}
