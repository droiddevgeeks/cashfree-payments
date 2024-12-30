import { CFErrorResponse, CFPaymentGatewayService }  from 'cashfree-payments';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  const paymentObject = {
    theme: {
      navigationBarBackgroundColor: "#E64A19",
      navigationBarTextColor: "#FFFFFF",
    },
    session: {
      payment_session_id: "session_gmXfigYZ2ZO2J5Piecw-LsK-539KaF7JgRoMtHd6-tZ704r7wS2-mJx5-MaFYBlEszI57jrG9QMyPXnUDyafDbY7c2VnolycvGyKWJDyvKeuiF994EETOwcpayment",
      orderID: "devstudio_57275123",
      environment: "SANDBOX",
    },
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
