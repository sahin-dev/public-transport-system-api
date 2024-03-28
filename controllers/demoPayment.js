// const sslCom = require('ssl-commerz-node')
// require('dotenv').config()

// const payment = new sslCom.PaymentSession(true,process.env.STORE_ID,process.env.STORE_PASS)

// const paymentInit = async(req,res)=>{
//     const {
//         cartItems,
//         totalAmount,
//         deliveryMethod,
//         numItem,
//         customerInfo,
//         shippingInfo,
//       } = req.body;
    
//       const transactionId = "ref12345667";
//       // let paymentDone = false;
    
//       if (
//         !(cartItems.length >= 0) ||
//         !(totalAmount > 0) ||
//         !(deliveryMethod.length > 0) ||
//         !(numItem > 0) ||
//         !customerInfo ||
//         !shippingInfo
//       ) {
//         return res.json({ message: "All filled must be required" });
//       } else {
//         try {
//           // Set the urls
//           payment.setUrls({
//             // success: "yoursite.com/success", // If payment Succeed
//             success: `http://localhost:3000/api/payment/success?transactionId=${transactionId}`, // If payment Succeed
//             fail: `http://localhost:3000/api/payment/fail`, // If payment failed
//             cancel: `http://localhost:3000/payment/cancel`, // If user cancel payment
//             ipn: `http://localhost:3000/api/payment/ipn`, // SSLCommerz will send http post request in this link
//           });
//           // Set order details
//           payment.setOrderInfo({
//             total_amount: totalAmount, // Number field
//             currency: "BDT", // Must be three character string
//             tran_id: transactionId, // Unique Transaction id
//             emi_option: 0, // 1 or 0
//             multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
//             allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
//             emi_max_inst_option: 3, // Max instalment Option
//             emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
//           });
    
//           // Set customer info
//           const { cusName, cusEmail, cusAdd1, cusAdd2, cusCity, cusState, cusPostcode, cusCountry, cusPhone, cusFax } = customerInfo;
//           payment.setCusInfo({
//             name: cusName,
//             email: cusEmail,
//             add1: cusAdd1,
//             add2: cusAdd2,
//             city: cusCity,
//             state: cusState,
//             postcode: cusPostcode,
//             country: cusCountry,
//             phone: cusPhone,
//             fax: cusFax,
//           });
    
//           // Set shipping info
//           const { name, shippingAdd1, shippingAdd2, shippingCity, shippingState, shippingPostcode, shippingCountry } = shippingInfo;
//           payment.setShippingInfo({
//             method: "NO", //Shipping method of the order. Example: YES or NO or Courier
//             num_item: numItem,
//             ship_name: name,
//             add1: shippingAdd1,
//             add2: shippingAdd2,
//             city: shippingCity,
//             state: shippingState,
//             postcode:shippingPostcode,
//             country: shippingCountry,
//           });
    
//           // Set Product Profile
//           payment.setProductInfo({
//             product_name: cartItems.map(i => i.productName).join(', '),
//             product_category: "Medical",
//             product_profile: "general",
//           });
    
//           // Initiate Payment and Get session key
          
//           payment.paymentInit().then(async (response) => {
//             console.log(response);
//             res.send(response["GatewayPageURL"]);
//             // paymentDone = response["status"] === "SUCCESS";
    
//           });
//         } catch (err) {
//           return res.status(400).json({ err });
//         }
//       }
// }

// const paymentSuccess =(req,res)=>{
//     res.json({msg:'Payment Success',id:req.query['transactionId']})
    
// }


// const paymentFail =(req,res)=>{
//     res.json({msg:'Payment Fail'})
// }


// const paymentCancel =(req,res)=>{
//     res.json({msg:'Payment Cancel'})
// }

// module.exports = {paymentInit, paymentSuccess, paymentFail, paymentCancel}