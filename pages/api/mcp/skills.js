export const onGet = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/sdachary/devendra/contents/skills', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'narad-mcp'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const items = await response.json();
    const skills = items
      .filter(item => item.type === 'dir')
      .map(item => ({
        name: item.name,
        description: 'See https://github.com/sdachary/devendra/tree/main/skills/' + item.name,
        path: item.path
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return Response.json({
      hub: 'devendra',
      repo: 'https://github.com/sdachary/devendra',
      totalSkills: skills.length,
      skills
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};