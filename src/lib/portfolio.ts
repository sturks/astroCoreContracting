import path from 'path';
import fs from 'fs/promises';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

export async function getProjects() {
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveProjects(projects: any[]) {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

export async function addProject(project: any) {
  const projects = await getProjects();
  const newProject = {
    id: Date.now().toString(),
    ...project,
    createdAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  await saveProjects(projects);
  return newProject;
}

export async function updateProject(id: string, updates: any) {
  const projects = await getProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error('Project not found');
  }
  
  projects[index] = { ...projects[index], ...updates };
  await saveProjects(projects);
  return projects[index];
}

export async function deleteProject(id: string) {
  const projects = await getProjects();
  const newProjects = projects.filter(p => p.id !== id);
  await saveProjects(newProjects);
}