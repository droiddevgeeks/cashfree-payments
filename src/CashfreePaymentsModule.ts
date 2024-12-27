import { NativeModule, requireNativeModule } from 'expo';

declare class CashfreePaymentsModule extends NativeModule {
  PI: number;
  hello(): string;
  doWebCheckoutPayment(paymentObject: string): void;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<CashfreePaymentsModule>('CashfreePayments');
