import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const authors = ['Buddha', 'Mark Twain', 'Marilyn Monroe', 'Albert Einstein', 'Susan B. Anthony', 'Socrates', 'Leonardo da Vinci', 'Benjamin Franklin', 'Martin Luther King, Jr.', 'Abraham Lincoln', 'Oscar Wilde', 'Kurt Vonnegut', 'Virginia Woolf', 'Winston Churchill', 'Friedrich Nietzsche', 'Marie Antoinette', 'Gandalf'];

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
};

export default function Signature() {
  const { quoteRes, authorRes } = useLoaderData();
  return (
    <main>
      <h1>Your New Email Signature</h1>

        {quoteRes.map((quote) => (
          <div style={{ fontFamily: "Papyrus", fontSize: "2em" }}>
              {quote.quote}
          </div>
        ))}

        {authorRes.map((author) => (
          <div style={{ fontFamily: "cursive", fontSize: "1.5em" }}>
              ~{author.author}
          </div>
        ))}

    </main>
  );
}