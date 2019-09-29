export const getArrayOfMpaaRatings = rating => {
  switch (rating) {
    case "UR":
      return ["G", "PG", "PG13", "R", "UR"];
      break;
    case "R":
      return ["G", "PG", "PG13", "R", "UR"]; // NOTE: maybe oneday remove UR
      break;
    case "PG13":
      return ["G", "PG", "PG13"];
      break;
    case "PG":
      return ["G", "PG"];
      break;
    case "G":
    default:
      return ["G"];
      break;
  }
};
