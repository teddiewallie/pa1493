import { auth } from "@/auth";
import { getAssetPath } from "@/service/asset-path";
import { readFile } from "fs/promises";

const GET = async (request, { params }) => {
const session = auth();

  if (!session) {
    return new Response("Forbidden", { status: 403 });
  }

  const { asset } = await params;

  if (asset.length != 2)
  {
    return new Response("Not Found", { status: 404 });
  }

  const id = asset[1];
  const path = getAssetPath(id, "jpg")

  try {
    const image = await readFile(path);

    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=3600"
      }
    });
  } catch (e) {
    return new Response(e.message, { status: 404 });
  }
};

export { GET }

