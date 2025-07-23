import { cookies } from "next/headers";

export const POST = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('__Secure-next-auth.session-token');
    return new Response(null, { status: 200 });
}