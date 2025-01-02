import  CashfreePayments  from './CashfreePaymentsModule';
import { EventSubscription } from 'expo-modules-core';
import { CheckoutPayment  } from 'cashfree-pg-api-contract';

export class CFErrorResponse {
    private status: string = 'FAILED';
    private message: string = 'payment has failed';
    private code: string = 'payment_failed';
    private type: string = 'request_failed';
  
    constructor(errorString?: string) {
        if (errorString) {
            this.fromJSONInternal(errorString);
          }
    }
    private fromJSONInternal(errorString: string) {
      const object = JSON.parse(errorString);
      this.status = object.status;
      this.message = object.message;
      this.code = object.code;
      this.type = object.type;
    }
  
    getStatus(): string {
      return this.status;
    }
  
    getMessage(): string {
      return this.message;
    }
  
    getCode(): string {
      return this.code;
    }
  
    getType(): string {
      return this.type;
    }
}

// Internal helper to create CFErrorResponse
function createCFErrorResponse(errorString: string): CFErrorResponse {
    const errorResponse = new CFErrorResponse();
    errorResponse['fromJSONInternal'](errorString);
    return errorResponse;
}

export interface CFCallback {
    onVerify(orderID: string): void;
    onError(error: CFErrorResponse, orderID: string): void;
}
  

class CFPaymentGateway {

    setCallback(cfCallback: CFCallback): EventSubscription[] {
        const subscriptions: EventSubscription[] = [];
        let verifyFunction = (paymentResponse : any) => {
            console.log('VerifyFunction Log : ' + JSON.stringify(paymentResponse));
            const { orderID } = paymentResponse;
            cfCallback.onVerify(orderID);
        };
        let failureFunction = (failureReason: any) => {
            console.log('FailureFunction Log ' + JSON.stringify(failureReason));
            try {
                const { orderID, error } = failureReason;
                const failureResponse = createCFErrorResponse(error);
                cfCallback.onError(failureResponse, orderID);
            }catch(e) {
                console.log('Error parsing while Payment Failure::==> '+ e);
            }
        };
    
        // @ts-ignore
        subscriptions.push(CashfreePayments.addListener("cfVerify", verifyFunction));
        // @ts-ignore;
        subscriptions.push(CashfreePayments.addListener('cfFailure', failureFunction));

        CashfreePayments.setCallback();
        return subscriptions;
    }

    doWebPayment(paymentObject: any): void {
        CashfreePayments.doWebPayment(JSON.stringify(paymentObject));
    }

    doUPIPayment(checkoutPayment: CheckoutPayment){
        CashfreePayments.doUPIPayment(JSON.stringify(checkoutPayment));
    }
}

export const CFPaymentGatewayService = new CFPaymentGateway();