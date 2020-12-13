const fetch = require("node-fetch");
const api_url = "https://covid-19india-api.herokuapp.com/headlines";

fetch(api_url)
  .then((res) => res.json())
  .then((json) => console.log(json));
