export const onGet = async () => {
  const DEVENDRAPATH = '/home/deepak/Work/devendra';
  
  const skills = [];
  const skillsPath = `${DEVENDRAPATH}/skills`;
  
  try {
    const fs = await import('fs');
    const entries = fs.readdirSync(skillsPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = `${skillsPath}/${entry.name}/SKILL.md`;
        let description = '';
        
        if (fs.existsSync(skillPath)) {
          const content = fs.readFileSync(skillPath, 'utf-8');
          const match = content.match(/description:\s*["']([^"']+)["']/);
          if (match) description = match[1];
        }
        
        skills.push({
          name: entry.name,
          description: description || 'No description',
          path: `/devendra/skills/${entry.name}`
        });
      }
    }
  } catch (e) {
    return Response.json({ error: 'Failed to load skills', details: e.message }, { status: 500 });
  }
  
  return Response.json({
    hub: 'devendra',
    repo: 'https://github.com/sdachary/devendra',
    totalSkills: skills.length,
    skills: skills.sort((a, b) => a.name.localeCompare(b.name))
  });
};