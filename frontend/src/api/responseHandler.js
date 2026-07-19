export const normalizeResponse = (response) => {
  switch (response.code) {
    case 1:
      return response.data;

    case 3:
      return null;

    case 2:
      throw new Error(response.message);

    case 0:
      throw new Error(response.message);

    case -1:
      throw new Error("Unauthorized");

    default:
      throw new Error("Unexpected Server Response");
  }
};