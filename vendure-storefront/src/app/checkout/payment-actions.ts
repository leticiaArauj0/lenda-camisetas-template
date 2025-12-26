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

/**
 * Processa o pagamento via Stripe no servidor
 * Comunica com a API Vendure para confirmar o pagamento
 */
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

/**
 * Cria um Payment Intent no servidor (chamado antes de renderizar Stripe Elements)
 * Esta função deve ser chamada antes de exibir o formulário de pagamento
 */
export async function createStripePaymentIntent(
  orderId: string
): Promise<CreatePaymentIntentResponse> {
  try {
    // Aqui você chamaria um endpoint do seu servidor que cria um PaymentIntent
    // Por enquanto, retornamos null pois o Stripe Elements pode ser configurado sem clientSecret
    // mas em produção você deve criar um PaymentIntent no servidor
    
    // Exemplo (descomentar quando tiver endpoint):
    // const response = await fetch('/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ orderId }),
    // });
    
    // const data = await response.json();
    // if (!response.ok) {
    //   return { clientSecret: null, error: data.error };
    // }
    
    // return { clientSecret: data.clientSecret };

    return { clientSecret: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      clientSecret: null,
      error: message,
    };
  }
}
