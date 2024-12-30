package expo.modules.cashfreepayments

import android.content.Context
import androidx.core.os.bundleOf
import com.cashfree.pg.api.CFPaymentGatewayService
import com.cashfree.pg.base.logger.CFLoggerService
import com.cashfree.pg.core.api.CFSession
import com.cashfree.pg.core.api.base.CFPayment
import com.cashfree.pg.core.api.callback.CFCheckoutResponseCallback
import com.cashfree.pg.core.api.utils.CFErrorResponse
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutPayment
import com.cashfree.pg.core.api.webcheckout.CFWebCheckoutTheme.CFWebCheckoutThemeBuilder
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject


private const val CF_VERIFY = "cfVerify"
private const val CF_FAILURE = "cfFailure"


class CashfreePaymentsModule : Module() {

    private val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    private val currentActivity
        get() = appContext.activityProvider?.currentActivity

    private val callback: CFCheckoutResponseCallback by lazy {
        object : CFCheckoutResponseCallback {
            override fun onPaymentVerify(orderID: String?) {
                sendEvent(CF_VERIFY, bundleOf("orderID" to orderID))
            }

            override fun onPaymentFailure(cfErrorResponse: CFErrorResponse?, orderID: String?) {
                sendEvent(
                    CF_FAILURE, bundleOf(
                        "orderID" to orderID,
                        "error" to cfErrorResponse?.toJSON().toString()
                    )
                )
            }
        }
    }


    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('CashfreePayments')` in JavaScript.
        Name("CashfreePayments")

        Events(CF_VERIFY, CF_FAILURE)

        Function("setCallback") {
            try {
                CFPaymentGatewayService.getInstance().setCheckoutCallback(callback)
            } catch (e: Exception) {
                CFLoggerService
                    .getInstance()
                    .e("CashfreePayments", "Error setting callback.::: ${e.message}")
            }
        }

        Function("doWebPayment") { paymentObject: String ->
            CFLoggerService.getInstance().d("CashfreePayments", "doWebPayment::: $paymentObject")
            try {
                val jsonObject = JSONObject(paymentObject)

                val sessionObject = jsonObject.getJSONObject("session")
                val themeObject = jsonObject.optJSONObject("theme")

                val sdkEnv: CFSession.Environment =
                    CFSession.Environment.valueOf(sessionObject.getString("environment"))
                val orderId = sessionObject.getString("orderID")
                val paymentSessionId = sessionObject.getString("payment_session_id")


                val navigationBarBackgroundColor =
                    themeObject?.optString("navigationBarBackgroundColor", "#6A3FD3")
                val navigationBarTextColor =
                    themeObject?.optString("navigationBarTextColor", "#FFFFFF")

                val cfSession = CFSession.CFSessionBuilder()
                    .setEnvironment(sdkEnv)
                    .setPaymentSessionID(paymentSessionId)
                    .setOrderId(orderId)
                    .build()

                val cfTheme = CFWebCheckoutThemeBuilder()
                    .setNavigationBarBackgroundColor(navigationBarBackgroundColor ?: "#6A3FD3")
                    .setNavigationBarTextColor(navigationBarTextColor ?: "#FFFFFF")
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
                } ?: run {
                    CFLoggerService.getInstance().e(
                        "CashfreePayments",
                        "Activity is null. Cannot proceed with the payment."
                    )
                }
            } catch (exception: Exception) {
                CFLoggerService
                    .getInstance()
                    .e("CashfreePayments", "doWebPayment::: ${exception.message}")
                exception.printStackTrace()
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
