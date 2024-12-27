// Reexport the native module. On web, it will be resolved to CashfreePaymentsModule.web.ts
// and on native platforms to CashfreePaymentsModule.ts
import  CashfreePayments  from './CashfreePaymentsModule';

export function hello(): void {
    CashfreePayments.hello();
}

export function doWebCheckoutPayment(paymentObject: string): void {
    CashfreePayments.doWebCheckoutPayment(paymentObject);
}