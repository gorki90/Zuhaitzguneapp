const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'zuhaitzguneappFrontend08',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

