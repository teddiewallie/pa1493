import { auth } from "@/auth";
import { getAssetPath } from "@/service/asset-path";
import { getAsset } from "@/service/get-asset";
import { readFile } from "fs/promises";

const GET = async (request, { params }) => {
const session = await auth();

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
    const path = getAssetPath("0", "jpg");
    const image = await readFile(path);

    return new Response(image, {
      status: 404,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=3600"
      }
    });
  }
};

export { GET }

