import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-tokken'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-tokken'];
  }
};

export default setAuthToken;
