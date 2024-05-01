import { json } from "@remix-run/node";
import { useNavigation, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Select, FormControl, InputLabel, MenuItem, Button, Container, Box, Typography } from "@mui/material";
import { getSignatures } from "../models/signature.server";
import { getMaxOffset, getGiphy } from "../models/giphy.server";
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

  const API_GIPHY_KEY = process.env.API_GIPHY_KEY;
  const API_GIPHY_BASE_PATH = process.env.API_GIPHY_BASE_PATH;

  return json({
    quoteRes: quoteRes,
    maxOffset: maxOffset,
    gifUrl: gifRes,
    randomAuthor: randomAuthor,
    API_GIPHY_KEY: API_GIPHY_KEY,
    API_GIPHY_BASE_PATH: API_GIPHY_BASE_PATH,
  });
};

export default function Signature() {
  let { quoteRes, gifUrl, maxOffset, randomAuthor, API_GIPHY_KEY, API_GIPHY_BASE_PATH } = useLoaderData();
  const [userFont, setUserFont] = useState("Times New Roman");
  const [userColor, setUserColor] = useState("Black");
  const [myGifUrl, setMyGifUrl] = useState(gifUrl);
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
  };

  const handleUserColorChange = (e) => {
    setUserColor(e.target.value);
    window.localStorage.setItem("userColor", e.target.value);
  };

  const getNewMaxOffset = async (category) => {
    const response = await fetch(
      `${API_GIPHY_BASE_PATH}?q=${category}&api_key=${API_GIPHY_KEY}&limit=1&offset=0&rating=pg-13`
    );
    const offset = await response.json();
    const offsetRes = { offset };
    let maxOffset = offsetRes.offset.pagination.total_count - 1;
    if(maxOffset > 4999) {
      maxOffset = 4999;
    } else if(maxOffset < 1) {
      maxOffset = 1;
    }
    return maxOffset;
  };

  const getNewGiphy = async (category, offset) => {
    let gifRes = {};
    let randomOffset = 0;
    if(offset == 1) {
      randomOffset = Math.random() < 0.5 ? 0 : 1;
    } else {
      randomOffset = Math.floor(Math.random() * offset);
    }
    //console.log(randomOffset, 'randomOffset');
    const response = await fetch(
      `${API_GIPHY_BASE_PATH}?q=${category}&api_key=${API_GIPHY_KEY}&limit=1&offset=${randomOffset}&rating=pg-13`
    );
    const gif = await response.json();
    gifRes = { gif };
    //console.log('gifRes of category', gifRes);
    //console.log(gifRes.gif.data.length == 0);
    if(gifRes.gif.data.length == 0) {
      return getNewGiphy('fun', 4999);
    }
    return gifRes.gif.data[0].images.original.url;
  };

  const handleNewCategoryChoice = async (e) => {
    //console.log('test', e.target.value);
    let cat = e.target.getAttribute("value");
    let catNoPunct = cat.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const offset = await getNewMaxOffset(catNoPunct);
    const url = await getNewGiphy(catNoPunct, offset);
    setMyGifUrl(url);
  }

  const refreshPage = () => { 
    window.location.reload(); 
  };

  //return tokens
  const quote = quoteRes.signatures[0].quote;
  const quoteNoPunct = quote.replace(/[.,\/#!$%\^?&\*;:{}=\-_`~()]/g,"");
  const quoteForToken = quoteNoPunct.replace(/\s{2,}/g," ");
  const tokens = quoteForToken.split(" ").filter((token) => {
    token = token.toLowerCase();
    return !stopwords.includes(token);
  });

  const quoteWords = quote.split(" ");
  let renderedQuote = [];
  for(let i = 0; i < quoteWords.length; i++) {
    const wordNoPunct = quoteWords[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    if(tokens.includes(wordNoPunct)) {
      renderedQuote.push(<span key={i} value={quoteWords[i]} onClick={handleNewCategoryChoice}>{quoteWords[i]} </span>);
    } else {
      renderedQuote.push(<span key={i}>{quoteWords[i]} </span>);
    }
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
   
      <Typography component={'span'} fontFamily={userFont} color={userColor} m={1}>
        <div>{renderedQuote}</div>
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
        <img src={myGifUrl}></img>
      </div>

      <Button variant="outlined" onClick={() => setShowAuthor(true)}>Click to reveal the real author</Button> {showAuthor && <Box>{quoteRes.signatures[0].author}</Box>}

      <br />

      <Button variant="outlined" onClick={ refreshPage }>Click to get a new quote</Button>

    </main>
    </Container>
  );
}