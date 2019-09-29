import { asyncRequest } from "../networking";

import projectConfig from "../env";

let twitch = window.Twitch.ext;

twitch.bits && twitch.bits.setUseLoopback(projectConfig.DEVELOPMENT);

twitch.onContext(context => {
  twitch.rig.log(context);
});

let token, userId;

twitch.onAuthorized(auth => {
  token = auth.token;
  userId = auth.userId;
});

export const BitPriceOptions = [
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "15", value: 15 },
  { text: "20", value: 20 },
  { text: "25", value: 25 },
  { text: "50", value: 50 },
  { text: "75", value: 75 },
  { text: "100", value: 100 },
  { text: "150", value: 150 },
  { text: "200", value: 200 },
  { text: "250", value: 250 },
  { text: "500", value: 500 },
  { text: "750", value: 750 },
  { text: "1000", value: 1000 },
  { text: "2000", value: 2000 },
  { text: "2500", value: 2500 },
  { text: "5000", value: 5000 },
  { text: "7500", value: 7500 },
  { text: "10000", value: 10000 }
];

export const producSkus = {
  "10000": "10000BitSKU",
  "1000": "1000BitSKU",
  "100": "100BitSKU",
  "10": "10BitSKU",
  "150": "150BitSKU",
  "15": "15BitSKU",
  "1": "1BitSKU",
  "0": "0BitSKU",
  "2000": "2000BitSKU",
  "200": "200BitSKU",
  "20": "20BitSKU",
  "2500": "2500BitSKU",
  "250": "250BitSKU",
  "25": "25BitSKU",
  "5000": "5000BitSKU",
  "500": "500BitSKU",
  "50": "50BitSKU",
  "5": "5BitSKU",
  "7500": "7500BitSKU",
  "750": "750BitSKU",
  "75": "75BitSKU"
};

export const convertBitNumberToSKU = bitCount => {
  const bitNumber = parseFloat(bitCount, 10);
  if (bitNumber <= 0) {
    return producSkus["0"];
  } else if (bitNumber <= 4) {
    return producSkus["1"];
  } else if (bitNumber >= 5 && bitNumber < 10) {
    return producSkus["5"];
  } else if (bitNumber >= 10 && bitNumber < 15) {
    return producSkus["10"];
  } else if (bitNumber >= 15 && bitNumber < 20) {
    return producSkus["15"];
  } else if (bitNumber >= 20 && bitNumber < 25) {
    return producSkus["20"];
  } else if (bitNumber >= 25 && bitNumber < 50) {
    return producSkus["25"];
  } else if (bitNumber >= 50 && bitNumber < 75) {
    return producSkus["50"];
  } else if (bitNumber >= 75 && bitNumber < 100) {
    return producSkus["75"];
  } else if (bitNumber >= 100 && bitNumber < 150) {
    return producSkus["100"];
  } else if (bitNumber >= 150 && bitNumber < 200) {
    return producSkus["150"];
  } else if (bitNumber >= 200 && bitNumber < 250) {
    return producSkus["200"];
  } else if (bitNumber >= 250 && bitNumber < 500) {
    return producSkus["250"];
  } else if (bitNumber >= 500 && bitNumber < 750) {
    return producSkus["500"];
  } else if (bitNumber >= 750 && bitNumber < 1000) {
    return producSkus["750"];
  } else if (bitNumber >= 1000 && bitNumber < 2000) {
    return producSkus["1000"];
  } else if (bitNumber >= 2000 && bitNumber < 2500) {
    return producSkus["2000"];
  } else if (bitNumber >= 2500 && bitNumber < 5000) {
    return producSkus["2500"];
  } else if (bitNumber >= 5000 && bitNumber < 7500) {
    return producSkus["5000"];
  } else if (bitNumber >= 7500 && bitNumber < 10000) {
    return producSkus["7500"];
  } else if (bitNumber >= 10000) {
    return producSkus["10000"];
  } else {
    return producSkus["1"];
  }
};

export const BlastPriceOptions = [
  { text: "0", value: 0 },
  { text: "1", value: 1 },
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "15", value: 15 },
  { text: "20", value: 20 },
  { text: "25", value: 25 },
  { text: "50", value: 50 },
  { text: "75", value: 75 },
  { text: "100", value: 100 },
  { text: "150", value: 150 },
  { text: "200", value: 200 },
  { text: "250", value: 250 },
  { text: "500", value: 500 },
  { text: "750", value: 750 },
  { text: "1000", value: 1000 },
  { text: "2000", value: 2000 },
  { text: "2500", value: 2500 },
  { text: "5000", value: 5000 },
  { text: "7500", value: 7500 },
  { text: "10000", value: 10000 }
];

export const blastProductSkus = {
  "10000": "blast10000BitSKU",
  "1000": "blast1000BitSKU",
  "100": "blast100BitSKU",
  "10": "blast10BitSKU",
  "150": "blast150BitSKU",
  "15": "blast15BitSKU",
  "1": "blast1BitSKU",
  "0": "blast0BitSKU",
  "2000": "blast2000BitSKU",
  "200": "blast200BitSKU",
  "20": "blast20BitSKU",
  "2500": "blast2500BitSKU",
  "250": "blast250BitSKU",
  "25": "blast25BitSKU",
  "5000": "blast5000BitSKU",
  "500": "blast500BitSKU",
  "50": "blast50BitSKU",
  "5": "blast5BitSKU",
  "7500": "blast7500BitSKU",
  "750": "blast750BitSKU",
  "75": "blast75BitSKU"
};

export const convertBlastBitNumberToSKU = bitCount => {
  const bitNumber = parseFloat(bitCount, 10);
  if (bitNumber <= 0) {
    return blastProductSkus["0"];
  } else if (bitNumber <= 4) {
    return blastProductSkus["1"];
  } else if (bitNumber >= 5 && bitNumber < 10) {
    return blastProductSkus["5"];
  } else if (bitNumber >= 10 && bitNumber < 15) {
    return blastProductSkus["10"];
  } else if (bitNumber >= 15 && bitNumber < 20) {
    return blastProductSkus["15"];
  } else if (bitNumber >= 20 && bitNumber < 25) {
    return blastProductSkus["20"];
  } else if (bitNumber >= 25 && bitNumber < 50) {
    return blastProductSkus["25"];
  } else if (bitNumber >= 50 && bitNumber < 75) {
    return blastProductSkus["50"];
  } else if (bitNumber >= 75 && bitNumber < 100) {
    return blastProductSkus["75"];
  } else if (bitNumber >= 100 && bitNumber < 150) {
    return blastProductSkus["100"];
  } else if (bitNumber >= 150 && bitNumber < 200) {
    return blastProductSkus["150"];
  } else if (bitNumber >= 200 && bitNumber < 250) {
    return blastProductSkus["200"];
  } else if (bitNumber >= 250 && bitNumber < 500) {
    return blastProductSkus["250"];
  } else if (bitNumber >= 500 && bitNumber < 750) {
    return blastProductSkus["500"];
  } else if (bitNumber >= 750 && bitNumber < 1000) {
    return blastProductSkus["750"];
  } else if (bitNumber >= 1000 && bitNumber < 2000) {
    return blastProductSkus["1000"];
  } else if (bitNumber >= 2000 && bitNumber < 2500) {
    return blastProductSkus["2000"];
  } else if (bitNumber >= 2500 && bitNumber < 5000) {
    return blastProductSkus["2500"];
  } else if (bitNumber >= 5000 && bitNumber < 7500) {
    return blastProductSkus["5000"];
  } else if (bitNumber >= 7500 && bitNumber < 10000) {
    return blastProductSkus["7500"];
  } else if (bitNumber >= 10000) {
    return blastProductSkus["10000"];
  } else {
    return blastProductSkus["1"];
  }
};

export const getTwitchCurrentBitProducts = async () => {
  // If twitch bits not supported
  if (!twitch.bits) {
    return;
  }
  const currentProducts = await twitch.bits.getProducts();
  return currentProducts;
};

export function logToTwitchRig(logText) {
  twitch.rig.log(logText);
}

/**
  * Call this function when the viewer hovers over a product in your extension UI,
  * to cause the Twitch UI to display a dialog showing the viewer’s Bits balance.
  * The dialog displays for 1.5 seconds, unless your extension calls showBitsBalance again,
  * in which case the 1.5-second timer resets.
  */
export const getTwitchCurrentBitBalance = async () => {
  // If twitch bits not supported
  if (!twitch.bits) {
    return { message: "Not Implemented" };
  }
  twitch.bits.showBitsBalance();
};

export const attemptBuyProduct = async productSKU => {
  // If twitch bits not supported
  if (!twitch.bits) {
    return { message: "Not Implemented" };
  }
  const bought = twitch.bits.useBits(productSKU);
  return bought;
};

// https://dev.twitch.tv/docs/extensions/reference/#twitch-actions
export const currentToken = token;
export const currentUserId = userId;
export const BitCount = 1000;

export const grabUserContext = () => {
  let timeOut;
  return new Promise(function(resolve, reject) {
    twitch.onContext(context => {
      clearTimeout(timeOut);
      twitch.rig.log(context);
      resolve(context);
    });

    twitch.onError(err => {
      reject(err);
    });

    // If user does not login within 60 seconds reject call
    timeOut = setTimeout(() => {
      reject();
    }, 60000);
  });
};
