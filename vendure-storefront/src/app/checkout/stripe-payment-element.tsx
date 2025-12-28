'use client';

import { useState, useTransition } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { processStripePayment } from './payment-actions';

interface StripePaymentElementProps {
  orderId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function StripePaymentElement({
  orderId,
  onSuccess,
  onError,
}: StripePaymentElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
        });

        if (error) {
          setErrorMessage(error.message || 'Erro ao processar pagamento');
          onError(error.message || 'Erro ao processar pagamento');
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
          const result = await processStripePayment(
            orderId,
            paymentIntent.id
          );

          if (result.success) {
            onSuccess();
          } else {
            setErrorMessage(result.error || 'Erro ao confirmar pagamento');
            onError(result.error || 'Erro ao confirmar pagamento');
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setErrorMessage(message);
        onError(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isPending}
        className="w-full"
      >
        {isPending ? 'Processando pagamento...' : 'Confirmar Pagamento'}
      </Button>
    </form>
  );
}
