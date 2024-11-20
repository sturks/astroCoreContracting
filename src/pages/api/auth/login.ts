import type { APIRoute } from 'astro';
import { authenticate } from '../../../lib/auth';

export const post: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();
    const token = await authenticate(password);
    
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict`
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};