const moment = require('moment');
const Order = require('../models/Order');
const config = require('../config');


exports.createPaymentUrl = async (req, res, next) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    let tmnCode = config.vnpTmnCode;
    let secretKey = config.vnpHashsecret;
    let vnpUrl = config.vnpUrl;
    let returnUrl = config.vnpReturnUrl;
    let orderId = req.body.order;

    const order = await Order.findById(orderId)

    let amount = order.totalPrice;
    
    let locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({vnpUrl});
}

exports.vnpayReturn = async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];
  let orderId = vnp_Params['vnp_TxnRef'];
  let code = vnp_Params['vnp_ResponseCode']

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];


  vnp_Params = sortObject(vnp_Params);

  console.log(vnp_Params);
   
  let secretKey = config.vnpHashsecret;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

  if(secureHash === signed){
      if(code === '00') {
          let order = await Order.findById(orderId);
          order.paymentDate = Date.now();
          // TODO: Them payment status vao
          // order.paymentStatus = xxx
          await order.save();

          res.redirect(`${process.env.CLIENT_ROOT}/checkout/success`)
      }
      else {
          res.redirect(`${process.env.CLIENT_ROOT}`)
      }
  } else{
      res.send({status: 'success', code: '97'})
  }
}
