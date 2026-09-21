import { auth } from "@/auth";
import { getAssetPath } from "@/service/asset-path";
import { readFile } from "fs/promises";

const GET = async (request, { params }) => {
const session = auth();

  if (!session) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
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

