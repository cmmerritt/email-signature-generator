import { json } from "@remix-run/node";
import { useNavigation, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Select, FormControl, InputLabel, MenuItem, Button, Container, Box, Typography } from "@mui/material";
import { getSignatures } from "../models/signature.server.js";
import { getMaxOffset, getGiphy } from "../models/giphy.server.js";
import authors from "../shared/authors.jsx";
import stopwords from "../shared/stopwords.jsx";

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
    randomAuthor: randomAuthor,
  });
};

export default function Signature() {
  let { quoteRes, gifUrl, maxOffset, randomAuthor } = useLoaderData();
  const [userFont, setUserFont] = useState("Times New Roman");
  const [userColor, setUserColor] = useState("Black");
  const [showAuthor, setShowAuthor] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if(window.localStorage.getItem("userFont")) {
      setUserFont(window.localStorage.getItem("userFont"));
    }
    if(window.localStorage.getItem("userColor")) {
      setUserColor(window.localStorage.getItem("userColor"));
    }
  }, [])

  let authorMatch = false;
  if (quoteRes.signatures[0].author == randomAuthor) {
    authorMatch = true;
  };

  const handleUserFontChange = (e) => {
    setUserFont(e.target.value);
    window.localStorage.setItem("userFont", e.target.value);
    console.log(localStorage.userFont);
  };

  const handleUserColorChange = (e) => {
    setUserColor(e.target.value);
    window.localStorage.setItem("userColor", e.target.value);
    console.log(localStorage.userColor);
  };

  // const handleNewCategoryChoice = async (e) => {
  //   const newCategory = e.target.value;
  //   let newMaxOffset = await getMaxOffset(newCategory);
  //   let json = json({
  //     newMaxOffset: newMaxOffset,
  //   });
  //   console.log(newMaxOffset); 
  //   return newMaxOffset;
  // }

  const handleNewCategoryChoice = (e) => {
    console.log('test', e.target.value);
  }

  const refreshPage = () => { 
    window.location.reload(); 
  }

  //return tokens
  const quote = quoteRes.signatures[0].quote;
  const quoteNoPunct = quote.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  const quoteForToken = quoteNoPunct.replace(/\s{2,}/g," ");
  const tokens = quoteForToken.split(" ").filter((token) => {
    token = token.toLowerCase();
    return !stopwords.includes(token);
  });
  console.log("tokens", tokens);

  // const quoteWords = quote.split(" ");
  // let renderedQuote = [];
  // for(let i = 0; i < quoteWords.length; i++) {
  //   if(tokens.includes(quoteWords[i])) {
  //     renderedQuote.push(<Button key={i} value={quoteWords[i]} onClick={handleNewCategoryChoice}>{quoteWords[i] }</Button>);
  //   } else {
  //     renderedQuote.push(<span key={i}>{quoteWords[i]} </span>);
  //   }
  // };
  // console.log(renderedQuote);

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
            {quote} 
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

      <Button variant="outlined" onClick={() => setShowAuthor(true)}>Click to reveal the real author</Button> {showAuthor && <Box>{quoteRes.signatures[0].author}</Box>}

      <br />

      <Button variant="outlined" onClick={ refreshPage }>Click to get a new quote</Button>

    </main>
    </Container>
  );
}