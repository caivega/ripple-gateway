var db = require('../../config/initializers/sequelize');
var Sequelize = require("sequelize");

var RippleAddress = db.define('ripple_address', {
  id: { 
		type: Sequelize.INTEGER, 
		primaryKey: true,
		autoIncrement: true,
	},
  user_id: { type: Sequelize.INTEGER, notNull: true },
  managed: { type: Sequelize.BOOLEAN, notNull: true, default: false },
  address: { type: Sequelize.STRING, notNull: true },
  secret: { type: Sequelize.STRING },
  tag: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  previous_transaction_hash: { type: Sequelize.STRING }
}, {
  classMethods: {
    getHot: function(fn){
      RippleAddress.find({ where: { type: 'hot' }}).complete(fn);
    },
    getCold: function(fn){
      RippleAddress.find({ where: { type: 'cold' }}).complete(fn);
    },
    createHot: function(adminId, hotWallet, fn) {
      RippleAddress.create({
        managed: true,
        user_id: adminId,
        type: 'hot',
        address: hotWallet.address,
        secret: hotWallet.secret
      }).complete(fn)
    },
    createCold: function(fn) {
      RippleAddress.create({
        managed: true,
        user_id: admin.id,
        type: 'cold',
        address: hotWallet.address,
        secret: hotWallet.secret
      }).complete(fn)
    },
    setHot: function(adminId, hotWallet, fn) {
      var Klass = this;
      RippleAddress.getHot(function(err, address){
        if (address) {
          address.destroy().success(function(){
            Klass.createHot(adminId, hotWallet, fn);
          });
        } else {  
          Klass.createHot(adminId, hotWallet, fn);
        }
      });
    },
    setCold: function(adminId, coldWallet, fn) {
      var Klass = this;
      RippleAddress.getCold(function(err, address){
        if (address) {
          address.destroy().success(function(){
            Klass.createCold(adminId, hotWallet, fn);
          });
       } else {  
          Klass.createCold(adminId, hotWallet, fn);
        }
      });
    },
    createHosted: function(user, fn){
      RippleAddress.find({ where: { type: 'hot' }}).complete(function(err, address) {
        if (address) {
          var hotWallet = address; 
          RippleAddress.create({
            type: 'hosted',
            managed: true,
            user_id: user.id,
            tag: user.id,
            address: hotWallet.address
          }).complete(function(err, address){
            fn(err, address);
          });
        } else { fn(err, null) }
      });
    }
  }
});

module.exports = RippleAddress;
