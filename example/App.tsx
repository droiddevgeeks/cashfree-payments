import { useEvent } from 'expo';
import * as CashfreePayments from 'cashfree-payments';
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function App() {
  const paymentObject = {
    theme: {
      navigationBarBackgroundColor: "#E64A19",
      navigationBarTextColor: "#FFFFFF",
    },
    session: {
      payment_session_id: "session_Welsi3_ItGa3V1pAOMTD_9rE-G1uFxMYeQuxWaHx30G6xDxG2x0WCatUU5jr3IREOZMkRT1iE5MBoIMLgkxwjHMqsGaYbWwr80SgNEgRngAQ4bbr_00dIeMpayment",
      orderID: "devstudio_919724",
      environment: "SANDBOX",
    },
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Functions">
          <Button
            title="doWebCheckoutPayment"
            onPress={() => CashfreePayments.doWebCheckoutPayment(JSON.stringify(paymentObject))}/>
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
