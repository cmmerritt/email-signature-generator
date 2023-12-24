import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const authors = ['Buddha', 'Mark Twain', 'Harriet Tubman', 'Marilyn Monroe', 'Albert Einstein', 'Wayne Gretzky', 'Wayne Gretzky ~Michael Scott', 'Susan B. Anthony', 'John F. Kennedy, Jr.', 'Helen Keller', 'Shaquille O\'Neal', 'Lao Tzu', 'Socrates', 'Leonardo da Vinci', 'Benjamin Franklin', 'Pope John Paul II', 'Beyonce', 'Martin Luther King, Jr.', 'Abraham Lincoln', 'W. E. B. DuBois', 'Oscar Wilde', 'Walt Disney', 'Kurt Vonnegut', 'Confucius', 'Maya Angelou', 'William Shakespeare', 'Virginia Woolf', 'Winston Churchill', 'Ayn Rand', 'Friedrich Nietzsche', 'Marie Antoinette', 'Barack Obama', 'Gandalf', 'Snoop Dogg'];

let randomAuthor = authors[Math.floor(Math.random()*authors.length)];

export const loader = async () => {
  const quoteRes = await fetch(
    `${process.env.API_NINJAS_QUOTES_BASE_PATH}/`,
    {
      headers: {
        "X-Api-Key": `${process.env.API_NINJAS_KEY}`,
      },
    }
  );

  return json(
    {quoteRes: await quoteRes.json()},
    {"author": randomAuthor}
  );
};

export default function Signature() {
  const { quoteRes } = useLoaderData();
  return (
    <main>
      <h1>Your New Email Signature</h1>

        {quoteRes.map((quote) => (
          <>
          <div style={{ fontFamily: "Papyrus", fontSize: "2em" }}>
              {quote.quote}
          </div>
          <div style={{ fontFamily: "cursive", fontSize: "1.5em" }}>~{quote.author}</div>
          </>
          
        ))}

    </main>
  );
}