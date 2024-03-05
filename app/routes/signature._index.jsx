import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Select, FormControl, InputLabel, MenuItem, Container, Box } from "@mui/material";
import { getSignatures } from "../models/signature.server.js";
import { getMaxOffset, getGiphy } from "../models/giphy.server.js";
import authors from "../shared/authors.jsx";

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
          value="Times New Roman"
          label="Choose a font"
          onChange={handleChange}
          sx={{
            width: 200,
            height: 50,
          }}
        >
          <MenuItem value="Papyrus">Papyrus</MenuItem>
          <MenuItem value="Cursive">Cursive</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
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

      <button onClick={() => setShowAuthor(true)}>Click to reveal the real author</button> {showAuthor && <Box>{quoteRes.signatures[0].author}</Box>}

    </main>
    </Container>
  );
}