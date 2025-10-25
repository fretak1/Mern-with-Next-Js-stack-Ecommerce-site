"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutSuspense from "./checkoutSkeleton";

const options = {
  clientId:
    "AQeDxhDvGVBZIQQAlyMQ7GH28eltxnpZzMr74bdDUhZAb0flwDoD3rXB5w4WGvrIuOEJMthz4XzzyFfG",
};

function CheckoutPage() {
  return (
    <PayPalScriptProvider options={options}>
      <CheckoutSuspense />
    </PayPalScriptProvider>
  );
}

export default CheckoutPage;
