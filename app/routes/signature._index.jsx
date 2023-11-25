import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getSignatures } from "../models/signature.server";

export const loader = async () => {
  return json({ signatures: await getSignatures() });
};

export default function Signature() {
  const { signatures } = useLoaderData();
  return (
    <main>
      <h1>Signature</h1>
      <ul>
        {signatures.map((signature) => (
          <li key={signature.slug}>
            <Link
              to={signature.slug}
              className="text-blue-600 underline"
            >
              {signature.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}