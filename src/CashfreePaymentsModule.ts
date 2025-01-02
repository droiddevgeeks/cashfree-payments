import { NativeModule, requireNativeModule } from 'expo';

declare class CashfreePaymentsModule extends NativeModule {
  doWebPayment(paymentObject: string): void;
  doUPIPayment(checkoutPayment: string): void;
  setCallback(): void;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<CashfreePaymentsModule>('CashfreePayments');
