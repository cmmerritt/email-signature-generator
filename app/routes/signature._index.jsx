import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// import { getSignatures } from "../models/signature.server";

export const loader = async () => {
  const quoteRes = await fetch(
    `${process.env.API_NINJAS_QUOTES_BASE_PATH}/`,
    {
      headers: {
        "X-Api-Key": `${process.env.API_NINJAS_KEY}`,
      },
    }
  );
  const authorRes = await fetch(
    `${process.env.API_NINJAS_QUOTES_BASE_PATH}/`,
    {
      headers: {
        "X-Api-Key": `${process.env.API_NINJAS_KEY}`,
      },
    }
  );
  return json({
    quoteRes: await quoteRes.json(),
    authorRes: await authorRes.json()
  });
  // const signatures = await response.json();
  // console.log("signatures from loader", signatures);
  // return json({ signatures });
};

// export const loader = async () => {
//   return json({ signatures: await getSignatures() });
// };

export default function Signature() {
  const { quoteRes, authorRes } = useLoaderData();
  return (
    <main>
      <h1>Your New Email Signature</h1>
      <ul>
        {quoteRes.map((quote) => (
          <div>
              {quote.quote}
          </div>
        ))}
      </ul>
      <ul>
        {authorRes.map((author) => (
          <div>
              ~{author.author}
          </div>
        ))}
      </ul>
    </main>
  );
}