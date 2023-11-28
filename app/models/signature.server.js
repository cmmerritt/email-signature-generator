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
  console.log("signatures from loader", signatures);
  return { signatures };
}