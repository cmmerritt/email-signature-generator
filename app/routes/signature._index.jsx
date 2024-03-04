import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Select, FormControl, InputLabel, MenuItem, Container, Box } from "@mui/material";
import { getSignatures } from "../models/signature.server.js";
import { getMaxOffset, getGiphy } from "../models/giphy.server.js";

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
'Richard Milhous Nixon',
'Robin Williams',
'Ruth Bader Ginsburg',
'Saint Augustine',
'Serena Williams',
"Shaquille O\'Neal",
'Simone de Beauvoir',
'Snoop Dogg',
'Socrates',
'Stephen King',
'Steve Jobs',
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
'William Shakespeare',
'Winston Churchill'
];

export const loader = async () => {

  const quoteRes = await getSignatures();
  let quoteCategory = quoteRes.signatures[0].category;
  if(quoteCategory == undefined) {
    quoteCategory = "fun";
  }

  let maxOffset = await getMaxOffset(quoteCategory);

  const gifRes = await getGiphy(quoteCategory, maxOffset);

  const randomAuthor = authors[Math.floor(Math.random()*authors.length)];

  return json({
    quoteRes: quoteRes,
    maxOffset: maxOffset,
    gifUrl: gifRes,
    randomAuthor: randomAuthor
  });
};

export default function Signature() {
  const { quoteRes, gifUrl, maxOffset, randomAuthor } = useLoaderData();
  const [userFont, setUserFont] = useState("Times New Roman");
  const [showAuthor, setShowAuthor] = useState(false);

  const navigation = useNavigation();

  let authorMatch = false;
  if (quoteRes.signatures[0].author == randomAuthor) {
    authorMatch = true;
  };

  const handleChange = (e) => {
    setUserFont(e.target.value);
  };

  console.log("quoteRes", quoteRes);
  console.log("gifUrl", gifUrl);
  console.log("maxOffset", maxOffset);

  return (
    <Container>
    <main>
      <h1>Your New Email Signature</h1>
      {navigation.state !== "idle" ? <div>Loading...</div> : null}

      <br />

    <FormControl fullWidth>
      <InputLabel id="font-dropdown-label">Choose a font</InputLabel>
      <Select
        labelId="font-dropdown-label"
        id="font-dropdown"
        value={userFont}
        label="Choose a font"
        onChange={handleChange}
        sx={{
          width: 200,
          height: 50,
        }}
      >
        <MenuItem value="Papyrus">Papyrus</MenuItem>
        <MenuItem value="Cursive">Cursive</MenuItem>
      </Select>
    </FormControl>

      <br />

      <div style={{ fontFamily: `${userFont}`, fontSize: "2em" }}>
            {quoteRes.signatures[0].quote} 
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

      <div>
        <img src={gifUrl}></img>
      </div>

      <button onClick={() => setShowAuthor(prev => !prev)}>Click to reveal/hide the real author</button> {showAuthor && <Box>{quoteRes.signatures[0].author}</Box>}

    </main>
    </Container>
  );
}