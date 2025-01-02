import { CFErrorResponse, CFPaymentGatewayService }  from 'cashfree-payments';
import {
  CFEnvironment,
  CFSession,
  CFThemeBuilder,
  CFUPIIntentCheckoutPayment,
  CFUPIPayment,
} from 'cashfree-pg-api-contract';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  const paymentObject = {
    theme: {
      navigationBarBackgroundColor: "#E64A19",
      navigationBarTextColor: "#FFFFFF",
    },
    session: {
      payment_session_id: "session_qDm4PWjNn1SIxMlqKtIUhGUNVKvTO5b6VZiN91RcGiRJA6-ThliBEmrjetSgrt9NWIoh71_p_JQpQZH6RjGKh949SD64Fon9NMt2jxzVRb02MzxpaeN_Wdcpayment",
      orderID: "devstudio_82680344",
      environment: "SANDBOX",
    },
  }

  async function _startUPICheckout() {
    try {
      const session =  new CFSession('session_qDm4PWjNn1SIxMlqKtIUhGUNVKvTO5b6VZiN91RcGiRJA6-ThliBEmrjetSgrt9NWIoh71_p_JQpQZH6RjGKh949SD64Fon9NMt2jxzVRb02MzxpaeN_Wdcpayment', 'devstudio_82680344', CFEnvironment.SANDBOX);
      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#E64A19')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();
      const upiPayment = new CFUPIIntentCheckoutPayment(session, theme);
      console.log(JSON.stringify(upiPayment));
      CFPaymentGatewayService.doUPIPayment(upiPayment);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    const cfCallback = CFPaymentGatewayService.setCallback({
      onVerify: (orderID: string) => {
        console.log('Payment Verify Order:', orderID);
      },
      onError: (error: CFErrorResponse, orderID: string) => {
        console.log('Payment Failed:', error.getMessage(), 'for Order:', orderID);
      },
    });

    return () => {
      cfCallback.forEach((subscription) => subscription.remove());
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Functions">
          <Button
            title="Web Checkout Payment"
            onPress={() => CFPaymentGatewayService.doWebPayment(paymentObject)}/>
            
            <Button
            title="UPI Intent Checkout Payment"
            onPress={() => _startUPICheckout()}/>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
