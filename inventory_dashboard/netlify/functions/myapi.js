
const fetch = require("node-fetch"); 

exports.handler = async function (event, context) {
  try {

    const backendUrl = `https://backend-8wge.onrender.com${event.path.replace("/.netlify/functions/APP", "")}${event.rawQuery ? `?${event.rawQuery}` : ""}`;

    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
        ...event.headers,
      },
      body: event.httpMethod !== "GET" && event.body ? event.body : undefined,
    });

    const data = await response.text(); 

    return {
      statusCode: response.status,
      body: data,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy error", details: error.message }),
    };
  }
};
