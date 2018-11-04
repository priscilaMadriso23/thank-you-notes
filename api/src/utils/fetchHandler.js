const fetch = require('node-fetch');
const _ = require('lodash');

const config = require('../config/config.json');

// Set up the header for every call to the API
const getFetchOptions = (method = 'GET', props) => {
  const { headers, body } = props;
  const customHeaders = {
    'Content-Type': 'application/json',
  };
  _.merge(customHeaders, headers);
  const options = {
    method,
    headers: customHeaders,
  };
  options.body = JSON.stringify(body);
  return options;
};

const handleResponse = (loadingObject, res) => {
  if (res.ok) {
    return res.json();
  }
  throw new Error(res.statusText);
};

const triggerEvent = (event, data) => {
  if (event) event(data);
};

const addToLoadingQueue = (props) => {
  const { onLoading } = props;
  triggerEvent(onLoading);
};

const handleStopTransaction = (props, data) => {
  const { onSuccess } = props;
  triggerEvent(onSuccess, data);
  return data;
};

const handleErrorTransaction = (props, error) => {
  const { onFailure } = props;
  triggerEvent(onFailure, error);
  return error;
};

const createDynamicURL = (base, url, params = {}) => {
  const durl = new URL(url, base);
  _.map(_.keys(params), key => durl.searchParams.append(key, params[key]));
  return durl;
};

/**
 * Creates a fetch call from a given url and endpoint
 * Example:
 * call({
 *    endpoint: LOANS, (required)
 *    url: 'any url', (required)
 *    method: 'ANY' (optional) [default=GET]
 *    body: {object} (optional) [default=POST]
 *    headers: {custom headers} (optional) [default='Content-Type=application/json']
 *    params: {set of query params} (optional)
 *  })
 * Additionally you can listen to cycle events:
 * onLoading: Fired when the request starts.
 * onSuccess: Fired when the request was successful.
 * onFailure: Fired when the request fails.
 * @param {Object} props all properties accepted by node-fetch library
 */
exports.call = ({ ...props }) => {
  const apiUrl = config[props.endpoint].url;
  let method = props.method ? props.method : 'POST';
  if (!props.body) {
    method = props.method ? props.method : 'GET';
  }
  const options = getFetchOptions(method, props);
  addToLoadingQueue(options);
  const url = createDynamicURL(apiUrl, props.url, props.params);
  // console.log('--request-->', url.toString(), JSON.stringify(options));
  /* global fetch */
  return fetch(url, options)
    .then(response => handleResponse(props, response))
    .then(response => handleStopTransaction(props, response))
    .catch(error => handleErrorTransaction(props, error));
};
