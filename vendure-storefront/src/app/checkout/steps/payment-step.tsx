'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Loader2 } from 'lucide-react';
import { useCheckout } from '../checkout-provider';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { StripePaymentElement } from '../stripe-payment-element';
import { createStripePaymentIntent } from '../payment-actions'; 

interface PaymentStepProps {
  onComplete: () => void;
}

export default function PaymentStep({ onComplete }: PaymentStepProps) {
  const { paymentMethods, selectedPaymentMethodCode, setSelectedPaymentMethodCode, order } = useCheckout();
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedPaymentMethodCode) return;

    if (selectedPaymentMethodCode === 'stripe') {
      setIsLoadingSecret(true);
      setPaymentError(null);

      try {
        const response = await createStripePaymentIntent(order.id);

        console.log("RESPOSTA DO SERVIDOR:", JSON.stringify(response, null, 2));
        if (!response || !response.clientSecret) {
          throw new Error('Não foi possível obter a chave de pagamento.');
        }

        setClientSecret(response.clientSecret);
        setShowStripeForm(true);

      } catch (err) {
        console.error("Erro no Stripe:", err);
        setPaymentError('Erro ao conectar com o servidor de pagamento.');
      } finally {
        setIsLoadingSecret(false);
      }
      return;
    }

    onComplete();
  };

  const handleStripeSuccess = () => {
    setShowStripeForm(false);
    onComplete();
  };

  const handleStripeError = (error: string) => {
    setPaymentError(error);
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum método de pagamento disponível.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showStripeForm && (
        <>
          <h3 className="font-semibold">Selecione o método de pagamento</h3>

          <RadioGroup value={selectedPaymentMethodCode || ''} onValueChange={setSelectedPaymentMethodCode}>
            {paymentMethods.map((method) => (
              <Label key={method.code} htmlFor={method.code} className="cursor-pointer">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={method.code} id={method.code} />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      {method.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Label>
            ))}
          </RadioGroup>

          {paymentError && (
             <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
               {paymentError}
             </div>
          )}

          <Button
            onClick={handleContinue}
            disabled={!selectedPaymentMethodCode || isLoadingSecret}
            className="w-full"
          >
            {isLoadingSecret ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando Pagamento...
              </>
            ) : (
              'Continuar para Pagamento'
            )}
          </Button>
        </>
      )}

      {showStripeForm && selectedPaymentMethodCode === 'stripe' && clientSecret && (
        <StripeProvider clientSecret={clientSecret}>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowStripeForm(false);
                setPaymentError(null);
                setClientSecret(null);
              }}
              className="w-full"
            >
              ← Voltar
            </Button>
            
            <StripePaymentElement
              orderId={order.id}
              onSuccess={handleStripeSuccess}
              onError={handleStripeError}
            />
            
            {paymentError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {paymentError}
              </div>
            )}
          </div>
        </StripeProvider>
      )}
    </div>
  );
}