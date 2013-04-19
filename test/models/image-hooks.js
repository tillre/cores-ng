module.exports = function(comodl) {

  function handlePayload(payload, callback) {
    console.log("handlePayload handlePayload handlePayload");
  }

  return {
    create: handlePayload,
    save: handlePayload
  };
};