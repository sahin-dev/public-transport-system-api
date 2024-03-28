const randomstring = require('randomstring');

const getTicketUID = ()=>{
    let uid= "";
    uid+=randomstring.generate({length:1,charset:'alphabetic',capitalization:'uppercase'});
    uid+=randomstring.generate({length:3,charset:'numeric'});
    return uid;
}

module.exports = getTicketUID;