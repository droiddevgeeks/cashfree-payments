package expo.modules.cashfreepayments

import android.content.Context
import android.util.Log
import com.cashfree.pg.api.CFPaymentGatewayService
import com.cashfree.pg.base.logger.CFLoggerService
import com.cashfree.pg.core.api.CFSession
import com.cashfree.pg.core.api.base.CFPayment
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutPayment
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutTheme.CFWebCheckoutThemeBuilder
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject

class CashfreePaymentsModule : Module() {

    val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    private val currentActivity
        get() = appContext.activityProvider?.currentActivity


    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('CashfreePayments')` in JavaScript.
        Name("CashfreePayments")


        // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
        Constants(
            "PI" to Math.PI
        )

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("hello") {
            "Hello world Kishan! 👋"
        }

        Function("doWebCheckoutPayment") { paymentObject: String ->
            Log.d("CashfreePayments", paymentObject)
            try {
                val jsonObject = JSONObject(paymentObject)

                val sessionObject = jsonObject.getJSONObject("session")
                val sdkEnv: CFSession.Environment =
                    CFSession.Environment.valueOf(sessionObject.getString("environment"))
                val orderId = sessionObject.getString("orderID")
                val paymentSessionId = sessionObject.getString("payment_session_id")

                val cfSession = CFSession.CFSessionBuilder()
                    .setEnvironment(sdkEnv)
                    .setPaymentSessionID(paymentSessionId)
                    .setOrderId(orderId)
                    .build()

                val themeObject = jsonObject.optJSONObject("theme")
                val navigationBarBackgroundColor =
                    themeObject?.optString("navigationBarBackgroundColor", "#6A3FD3") ?: "#6A3FD3"
                val navigationBarTextColor =
                    themeObject?.optString("navigationBarTextColor", "#FFFFFF") ?: "#FFFFFF"

                val cfTheme = CFWebCheckoutThemeBuilder()
                    .setNavigationBarBackgroundColor(navigationBarBackgroundColor)
                    .setNavigationBarTextColor(navigationBarTextColor)
                    .build()

                val cfWebCheckoutPayment = CFWebCheckoutPayment.CFWebCheckoutPaymentBuilder()
                    .setSession(cfSession)
                    .setCFWebCheckoutUITheme(cfTheme)
                    .build()
                cfWebCheckoutPayment.setCfsdkFramework(CFPayment.CFSDKFramework.REACT_NATIVE)
                cfWebCheckoutPayment.setCfSDKFlavour(CFPayment.CFSDKFlavour.WEB_CHECKOUT)

                currentActivity?.let {
                    CFPaymentGatewayService.getInstance()
                        .doPayment(currentActivity!!, cfWebCheckoutPayment)
                }

            } catch (exception: Exception) {
                CFLoggerService.getInstance()
                    .e("CashfreePayments", "doWebPayment::: ${exception.message}")
            }
        }

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("setValueAsync") { value: String ->
            // Send an event to JavaScript.
            sendEvent(
                "onChange", mapOf(
                    "value" to value
                )
            )
        }
    }
}
