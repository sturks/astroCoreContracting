import type { APIRoute } from 'astro';
import { deleteProject, updateProject } from '../../../lib/portfolio';
import { isAuthenticated } from '../../../lib/auth';

export const del: APIRoute = async ({ params, request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(null, { status: 401 });
  }

  try {
    await deleteProject(params.id!);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const put: APIRoute = async ({ params, request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(null, { status: 401 });
  }

  try {
    const updates = await request.json();
    const updated = await updateProject(params.id!, updates);
    
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};