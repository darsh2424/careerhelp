export const normalizeResponse = (response) => {
  switch (response.code) {
    case 1:
      return response;

    case 2:
      throw response;

    case 3:
      return null;

    case 4:
      throw response;
    
    case 5:
      throw response;

    case 0:
      throw response;

    case -1:
      throw { message: "Unauthorized" };

    default:
      throw { message: "Unexpected Server Response" };
  }
};