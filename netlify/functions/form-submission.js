const https = require("https");

const FORM_TO_GROUP = {
  newsletter: process.env.MAILERLITE_GROUP_ID_NEWSLETTER,
};

function httpsPost(url, payload, headers) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON payload" };
  }

  const formName = (payload.data && payload.data["form-name"]) || payload.form_name || "";
  const name = (payload.data && payload.data.name) || "";
  const email = (payload.data && payload.data.email) || "";

  if (!FORM_TO_GROUP[formName]) {
    console.log("Ignoring form submission: " + formName);
    return { statusCode: 200, body: "Ignored" };
  }

  if (!email) {
    return { statusCode: 400, body: "Missing email" };
  }

  const groupId = FORM_TO_GROUP[formName];
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey || !groupId) {
    console.error("Missing environment variables");
    return { statusCode: 500, body: "Server configuration error" };
  }

  const url = "https://connect.mailerlite.com/api/subscribers";

  const mailerPayload = {
    email: email,
    fields: { name: name || undefined },
    groups: [groupId],
    status: "active",
    resubscribe: true,
  };

  try {
    const response = await httpsPost(url, mailerPayload, {
      Authorization: "Bearer " + apiKey,
      Accept: "application/json",
    });

    if (response.status === 200 || response.status === 201) {
      console.log("Subscribed " + email + " to group " + groupId + " (form: " + formName + ")");
      return { statusCode: 200, body: "Subscribed" };
    } else {
      console.error("MailerLite error " + response.status + ": " + response.body);
      return { statusCode: 502, body: "MailerLite API error" };
    }
  } catch (err) {
    console.error("Network error calling MailerLite:", err);
    return { statusCode: 502, body: "Upstream error" };
  }
};
