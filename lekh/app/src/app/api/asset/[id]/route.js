import { auth } from "@/auth";
import { getAssetPath } from "@/service/asset-path";
import { getAsset } from "@/service/get-asset";
import { readFile } from "fs/promises";

const GET = async (request, { params }) => {
const session = auth();

  if (!session) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;

  try {
    const { mime_type, extension } = await getAsset(id);
    const path = getAssetPath(id, extension);
    const image = await readFile(path);

    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": mime_type,
        "Cache-Control": "private, max-age=3600"
      }
    });
  } catch (e) {
    console.log(e);
    return new Response("Not found", { status: 404 });
  }
};

export { GET }

