import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Select, FormControl, InputLabel, MenuItem, Container, Box, Typography } from "@mui/material";
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
  const [userColor, setUserColor] = useState("Black");
  const [showAuthor, setShowAuthor] = useState(false);
  const navigation = useNavigation();

  let authorMatch = false;
  if (quoteRes.signatures[0].author == randomAuthor) {
    authorMatch = true;
  };

  const handleUserFontChange = (e) => {
    setUserFont(e.target.value);
  };

  const handleUserColorChange = (e) => {
    setUserColor(e.target.value);
  };

  return (
    <Container>
    <main>
      <h1>Your New Email Signature</h1>
      {navigation.state !== "idle" ? <div>Loading...</div> : null}

      <br />

      <FormControl>
        <InputLabel id="font-dropdown-label">Choose a font</InputLabel>
        <Select
          labelId="font-dropdown-label"
          id="font-dropdown"
          value={userFont}
          label="Choose a font"
          onChange={handleUserFontChange}
          sx={{
            width: 200,
            height: 50,
          }}
        >
          <MenuItem value={"Papyrus"} sx={{ fontFamily: "Papyrus" }}>Papyrus</MenuItem>
          <MenuItem value={"Cursive"} sx={{ fontFamily: "Cursive" }}>Cursive</MenuItem>
          <MenuItem value={"Times New Roman"} sx={{ fontFamily: "Times New Roman" }}>Times New Roman</MenuItem>
        </Select>
      </FormControl> 

      <FormControl>
        <InputLabel id="color-dropdown-label">Choose a color</InputLabel>
        <Select
          labelId="color-dropdown-label"
          id="color-dropdown"
          value={userColor}
          label="Choose a color"
          onChange={handleUserColorChange}
          sx={{
            width: 200,
            height: 50,
          }}
        >
          <MenuItem value={"Black"} sx={{ color: "Black" }}>Black</MenuItem>
          <MenuItem value={"Blue"} sx={{ color: "Blue" }}>Blue</MenuItem>
          <MenuItem value={"Purple"} sx={{ color: "Purple" }}>Purple</MenuItem>
          <MenuItem value={"Orange"} sx={{ color: "Orange" }}>Orange</MenuItem>
          <MenuItem value={"Pink"} sx={{ color: "Pink" }}>Pink</MenuItem>
          <MenuItem value={"Red"} sx={{ color: "Red" }}>Red</MenuItem>
        </Select>
      </FormControl> 

      <br />
   
      <Typography component={'span'} fontFamily={userFont} color={userColor}>
        <div>
            {quoteRes.signatures[0].quote} 
        </div>
        <div>
            ~{randomAuthor}
        </div>
      </Typography>

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