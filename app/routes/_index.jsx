import { Link } from "@remix-run/react";
import { Container } from "@mui/material";

export function headers() {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

export default function Index() {
  return (
    <Container>
      <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="mx-auto mt-16 max-w-7xl text-center">
        <Link
          to="/signature"
          className="text-xl text-blue-600 underline"
        >
          Generate a Signature!
        </Link>
      </div>
      </main>
    </Container>
  );
}
