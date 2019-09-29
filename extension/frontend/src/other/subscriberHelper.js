export const subscriberTiers = {
  tier1: '1000',
  tier2: '2000',
  tier3: '3000'
};

export const getNumberOfBitesForTier = (subscriberTier) => {
  switch (subscriberTier) {
    case '1000':
      return 3;

    case '2000':
      return 4;

    case '3000':
      return 5;

    default:
      return 3;
  }
};

export const getCurrentTier = () => {
  return subscriberTiers.tier2;
};
