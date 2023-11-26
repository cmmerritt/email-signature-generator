import { Link } from "@remix-run/react";

export function headers() {
  console.log(
    "This is an example of how to set caching headers for a route, feel free to change the value of 60 seconds or remove the header"
  );
  return {
    // This is an example of how to set caching headers for a route
    // For more info on headers in Remix, see: https://remix.run/docs/en/v1/route/headers
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

export default function Index() {
  return (
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
  );
}
