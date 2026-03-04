var cors = require("cors");
var express = require("express");
var axios = require("axios");

//################################################ Common Methods ################################################

const baseURL = "https://www.nseindia.com/";
const app = express();
const MAX_RETRY_COUNT = 3;
const port = process.env.PORT || 6123;
const getOptionsWithUserAgent = () => {
  //const userAgent = new UserAgent();
  return {
    headers: {
      Accept: "*/*",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.6261.89 Mobile/15E148 Safari/604.1", //userAgent.toString(),
      Connection: "keep-alive",
    },
    timeout: 6000,
  };
};
var userValaAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.6261.89 Mobile/15E148 Safari/604.1";
var baseHeaders = {
    'Authority': 'www.nseindia.com',
    'Referer': 'https://www.nseindia.com/',
    'Accept': '*/*',
    'Origin': baseURL,
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Ch-Ua': '" Not A;Brand";v="99", "Chromium";v="109", "Google Chrome";v="109"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
}
const getCookiesWithRetry = async () => {
  const options = getOptionsWithUserAgent();
  try {
    //const response = await axios.get(baseURL, options);
    //console.log(response);
    //const cookie = response.headers["set-cookie"];
    const response = await axios.get(baseURL, { headers: {...baseHeaders,'User-Agent': userValaAgent} });
    const cookie = response.headers["set-cookie"];
    //console.log(cookie);
    return cookie;
  } catch (error) {
    console.error("Error fetching cookies:");
    throw new Error("Failed to fetch cookies");
  }
};

const whitelist = ["/"]; //['http://localhost:5173,*/*']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      //callback(new Error('Not allowed by CORS'))
      callback(null, true);
    }
  },
};

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//################################################ common functions ################################################
const CommonCallMethod = async (cookie, endUrl, retryCount = 0) => {
  const options = getOptionsWithUserAgent();
  try {
    const url = baseURL + endUrl;
    const response = await axios.get(url, {
      ...options,
      headers: { ...options.headers, Cookie: cookie },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching marketStatus. Retry count: ${retryCount}`,
      error
    );
    if (retryCount < MAX_RETRY_COUNT) {
      return CommonCallMethod(cookie, endUrl, retryCount + 1);
    } else {
      throw new Error("Failed to fetch marketStatus after multiple retries");
    }
  }
};

const get_symbol_data = async (cookie, identifier, retryCount = 0) => {
    const options = getOptionsWithUserAgent();
    try {
      const url =
        baseURL + "/api/quote-equity?symbol=" + encodeURIComponent(identifier);
      const response = await axios.get(url, {
        ...options,
        headers: { ...options.headers, Cookie: cookie },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching equity. Retry count: ${retryCount}`, error);
      if (retryCount < MAX_RETRY_COUNT) {
        return get_symbol_data(cookie, identifier, retryCount + 1);
      } else {
        throw new Error("Failed to fetch equity after multiple retries");
      }
    }
  };


  // not use
  const getMarketAnalysisData = async (cookie, identifier, retryCount = 0) => {
    const options = getOptionsWithUserAgent();
    try {
      const url =
        baseURL +
        "/api/live-analysis-variations?index=" +
        encodeURIComponent(identifier);
      const response = await axios.get(url, {
        ...options,
        headers: { ...options.headers, Cookie: cookie },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching getMarketAnalysisData. Retry count: ${retryCount}`,
        error
      );
      if (retryCount < MAX_RETRY_COUNT) {
        return getMarketAnalysisData(cookie, identifier, retryCount + 1);
      } else {
        throw new Error(
          "Failed to fetch getMarketAnalysisData after multiple retries"
        );
      }
    }
  };
  const getmarketStatus_Test = async (cookie, retryCount = 0) => {
    const options = getOptionsWithUserAgent();
    try {
      const url = baseURL + "/api/marketStatus";
      const response = await axios.get(url, {
        ...options,
        headers: { ...options.headers, Cookie: cookie },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching marketStatus. Retry count: ${retryCount}`,
        error
      );
      if (retryCount < MAX_RETRY_COUNT) {
        return getmarketStatus_Test(cookie, retryCount + 1);
      } else {
        throw new Error("Failed to fetch marketStatus after multiple retries");
      }
    }
  };
//################################################ Start API ################################################
// npm run start
// For Test API
app.get("/", function (req, res) {
  res.send("Hello World! " + Date());
});
//######################################################################################

//http://localhost:6123/api/equity/?identifier=infy

app.get("/api/equity/", cors(corsOptions), async (req, res) => {
  const { identifier } = req.query;

  if (!identifier) {
    res
      .status(400)
      .json({ error: "Invalid request. No identifier was given." });
    return;
  }

  try {
    const cookie = await getCookiesWithRetry();
    const data = await get_symbol_data(cookie, identifier.toUpperCase());
    res.json(data).status(200).end();
  } catch (error) {
    console.error("Proxy request error: here", error);
    res.status(500).json({ error: "Proxy request failed." });
  }
});

//######################################################################################

//http://localhost:6123/api/marketStatus
app.get("/api/marketStatus/", cors(corsOptions), async (req, res) => {
  try {
    const cookie = await getCookiesWithRetry();
    const data = await getmarketStatus_Test(cookie);
    res.json(data).status(200).end();
  } catch (error) {
    console.error("Proxy request error: here", error);
    res.status(500).json({ error: "Proxy request failed." });
  }
});

//######################################################################################
// npm run start <-- for run sathi
//http://localhost:6123/api/marketAnalysis/?identifier=gainers
app.get("/api/marketAnalysis/", cors(corsOptions), async (req, res) => {
    const { identifier } = req.query;
    if (!identifier) {
      res
        .status(400)
        .json({ error: "Invalid request. No identifier was given." });
      return;
    }
  
    try {
      const cookie = await getCookiesWithRetry();
      const urll =  "/api/live-analysis-variations?index=" + encodeURIComponent(identifier.toLowerCase());
      const data = await CommonCallMethod(cookie, urll);
      //const data = await getMarketAnalysisData(cookie, identifier.toLowerCase());
      res.json(data).status(200).end();
    } catch (error) {
      console.error("Proxy request error: here", error);
      res.status(500).json({ error: "Proxy request failed." });
    }
  });
//######################################################################################
//http://localhost:6123/api/holidays?type=trading
app.get("/api/holidays", async (req, res) => {
    try {
      const cookie = await getCookiesWithRetry();
      const { type } = req.query;
      if (type === "clearing") {
        const urll = "/api/holiday-master?type=clearing";
        const data = await CommonCallMethod(cookie, urll);
        res.json(data).status(200).end();
      } else {
        const urll = "/api/holiday-master?type=trading";
        const data = await CommonCallMethod(cookie, urll);
        res.json(data).status(200).end();
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });
//######################################################################################
 ///http://localhost:6123/api/top-corp-info?symbol=TATATECH
 app.get('/api/top-corp-info', async (req, res) => {
    try {
        const cookie = await getCookiesWithRetry();
    const { symbol } = req.query
    const urll = "/api/top-corp-info?symbol="+symbol+"&market=equities";
    const data = await CommonCallMethod(cookie, urll);
    res.json(data).status(200).end();
    //res.json(await nseIndia.getDataByEndpoint(urll)).status(200).end();      
    } catch (error) {
        res.status(400).json(error)
    }
})
//######################################################################################
//http://localhost:6123/api/52weekhighstock
app.get("/api/52weekhighstock", async (req, res) => {
    try {
      const cookie = await getCookiesWithRetry();
      //const { symbol } = req.query
      const urll = "/api/live-analysis-data-52weekhighstock";
      const data = await CommonCallMethod(cookie, urll);
      res.json(data).status(200).end();
    } catch (error) {
      res.status(400).json(error);
    }
  });
  //######################################################################################
//http://localhost:6123/api/common?type=/api/live-analysis-data-52weekhighstock
//http://localhost:6123/api/common?type=/api/quote-equity?symbol=ABINFRA
//http://localhost:6123/api/common?type=/api/marketStatus
app.get("/api/common", async (req, res) => {
    try {
      const cookie = await getCookiesWithRetry();
      const { type } = req.query;
      const urll = type;
      const data = await CommonCallMethod(cookie, urll);
      res.json(data).status(200).end();
    } catch (error) {
      res.status(400).json(error);
    }
  });
  //######################################################################################



//################################################ end API ################################################



app.listen(port, () => {
  console.log("Server running on port... " + port);
});
