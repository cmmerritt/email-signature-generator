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
  return maxOffset;
}

export async function getGiphy(quoteCategory, maxOffset) {
  const randomOffset = Math.floor(Math.random() * maxOffset);
  const response = await fetch(
    `${process.env.API_GIPHY_BASE_PATH}?q=${quoteCategory}&api_key=${process.env.API_GIPHY_KEY}&limit=1&offset=${randomOffset}`
  );
  const gif = await response.json();
  const gifRes = { gif };
  return gifRes.gif.data[0].images.original.url;
}