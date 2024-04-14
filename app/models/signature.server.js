export async function getMaxOffset(quoteCategory) {
  const response = await fetch(
    `${process.env.API_GIPHY_BASE_PATH}?q=${quoteCategory}&api_key=${process.env.API_GIPHY_KEY}&limit=1&offset=0`
  );
  const offset = await response.json();
  const offsetRes = { offset };
  let maxOffset = offsetRes.offset.pagination.total_count - 1;
  if(maxOffset > 4999) {
    maxOffset = 4999;
  }
  console.log('getMaxOffset function', quoteCategory);
  return maxOffset;
};

export async function getSignatures() {
  const response = await fetch(
    `${process.env.API_NINJAS_QUOTES_BASE_PATH}/`,
    {
      headers: {
        "X-Api-Key": `${process.env.API_NINJAS_KEY}`,
      },
    }
  );
  const signatures = await response.json();
  return { signatures };
};