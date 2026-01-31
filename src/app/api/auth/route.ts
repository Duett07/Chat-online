export async function POST(request: Request) {
  const res = await request.json();
  const accessToken = res.accessToken;
  const expiresAt = res.expiresAt;

  if (!accessToken) {
    return Response.json(
      { message: "Không thể nhận được accessToken" },
      { status: 400 }
    );
  }

  const expiresAtDate = new Date(expiresAt).toUTCString();

  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `accessToken=${accessToken}; Expires=${expiresAtDate}; HttpOnly; Path=/; SameSite=Lax; Secure`,
    },
  });
}
