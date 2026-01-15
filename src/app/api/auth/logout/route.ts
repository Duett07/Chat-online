
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const res = await request.json();

//   if (!accessToken) {
//     return Response.json(
//       { message: "Không thể nhận được accessToken" },
//       { status: 401 }
//     );
//   }

  try {
    return Response.json(res, {
      status: 200,
      headers: {
        "Set-Cookie": `accessToken=; HttpOnly; Path=/; Max-Age=0`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json(
        { message: "Đã có lỗi xảy ra, vui lòng thử lại" },
        { status: 500 }
      );
    }
  }
}
