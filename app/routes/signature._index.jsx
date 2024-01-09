import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";

const authors = [
'Abraham Lincoln',
'Albert Einstein',
'Alexander the Great',
'Alexandria Ocasio-Cortez',
'Alice Walker',
'Aristotle',
'Ayn Rand',
'Barack Obama',
'Benjamin Franklin',
'Beyoncé',
'Bob Dylan',
'Bruce Lee',
'Bruce Springsteen',
'Buddha',
'Charles Darwin',
'Charles Dickens',
'Cleopatra',
'Confucius',
'Dolly Parton',
'Dr. Phil',
'Dwayne "The Rock" Johnson',
'Eleanor Roosevelt',
'Emily Dickinson',
'Eminem',
'Friedrich Nietzsche',
'Gandalf',
'George Eliot',
'George Washington',
'Harriet Tubman',
'Helen Keller',
'Hillary Clinton',
'Homer',
'Homer Simpson',
'Jack Kerouac',
'Jane Austen',
'Jay-Z',
'Jean-Paul Sartre',
'Joan Rivers',
'John F. Kennedy, Jr.',
'John Lennon',
'Julius Caesar',
'Kesha',
'Kurt Vonnegut',
'Lao Tzu',
'Leonardo da Vinci',
'Lucius Annaeus Seneca',
'Madonna',
'Mahatma Gandhi',
'Margaret Atwood',
'Marie Antoinette',
'Marilyn Monroe',
'Mark Twain',
'Martin Luther King, Jr.',
'Maya Angelou',
'Michelangelo',
'Mother Teresa',
'Muhammad Ali',
'Oprah Winfrey',
'Oscar Wilde',
'Pope John Paul II',
'Queen Elizabeth II',
'Ralph Waldo Emerson',
'Robin Williams',
'Ruth Bader Ginsburg',
'Saint Augustine',
'Serena Williams',
"Shaquille O\'Neal",
'Snoop Dogg',
'Socrates',
'Stephen King',
'Sylvia Plath',
'Taylor Swift',
'The Dalai Lama',
'Thomas Aquinas',
'Thomas Jefferson',
'Toni Morrison',
'Virgil',
'Virginia Woolf',
'Voltaire',
'W. E. B. DuBois',
'Walt Disney',
'Walt Whitman',
'Wayne Gretzky',
'Wayne Gretzky ~Michael Scott',
'William Shakespeare',
'Winston Churchill'
];

export const loader = async () => {
  const quoteRes = await fetch(
    `${process.env.API_NINJAS_QUOTES_BASE_PATH}/`,
    {
      headers: {
        "X-Api-Key": `${process.env.API_NINJAS_KEY}`,
      },
    }
  );

  const randomAuthor = authors[Math.floor(Math.random()*authors.length)];

  return json({
    quoteRes: await quoteRes.json(),
    randomAuthor: randomAuthor
  });
};

export default function Signature() {
  const { quoteRes, randomAuthor } = useLoaderData();
  const [userFont, setUserFont] = useState("Times New Roman");

  let authorMatch = false;
  if (quoteRes[0].author == randomAuthor) {
    authorMatch = true;
  };

  const handleChange = (e) => {
    setUserFont(e.target.value);
  };

  return (
    <main>
      <h1>Your New Email Signature</h1>

        {/* <div style={{ fontFamily: "Papyrus", fontSize: "2em" }}>
              {quoteRes[0].quote} 
          </div>

        <div style={{ fontFamily: "cursive", fontSize: "1.5em" }}>
              ~{randomAuthor}
          </div> */}

        <div style={{ fontFamily: `${userFont}`, fontSize: "2em" }}>
              {quoteRes[0].quote} 
        </div>

        <div style={{ fontFamily: "cursive", fontSize: "1.5em" }}>
              ~{randomAuthor}
        </div>

        { authorMatch && 
          <div>
            Whoa! This is the real author! (Allegedly.)
          </div>
        }

      <br />

      <Form method="post" className="font-form">
        Choose your font!
        <br />
        <select name="font-dropdown" id="font-dropdown" onChange={handleChange}>
          <option value="choose">---Choose font---</option>
          <option value="Papyrus">Papyrus</option>
          <option value="Cursive">Cursive</option>
        </select>
      </Form>

    </main>
  );
}