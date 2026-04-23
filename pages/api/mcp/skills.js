export const onGet = async () => {
  const skills = [
    'advanced-evaluation', 'algorithmic-art', 'bdi-mental-states', 'brainstorming',
    'brand-guidelines', 'canvas-design', 'claude-api', 'composition-patterns',
    'context-compression', 'context-degradation', 'context-fundamentals', 'context-optimization',
    'defuddle', 'dispatching-parallel-agents', 'doc-coauthoring', 'docx',
    'evaluation', 'executing-plans', 'filesystem-context', 'finishing-a-development-branch',
    'frontend-design', 'hosted-agents', 'internal-comms', 'json-canvas',
    'mcp-builder', 'memory-systems', 'minimalist-skill', 'multi-agent-patterns',
    'notebooklm', 'obsidian-bases', 'obsidian-cli', 'obsidian-markdown',
    'output-skill', 'pdf', 'planning-with-files', 'pptx',
    'project-development', 'react-best-practices', 'react-native-skills', 'receiving-code-review',
    'remotion', 'requesting-code-review', 'skill-creator', 'slack-gif-creator',
    'soft-skill', 'subagent-driven-development', 'supabase-postgres-best-practices', 'systematic-debugging',
    'taste-skill', 'test-driven-development', 'theme-factory', 'tool-design',
    'ui-ux-pro-max', 'using-git-worktrees', 'using-superpowers', 'verification-before-completion',
    'web-artifacts-builder', 'web-design-guidelines', 'webapp-testing', 'writing-plans',
    'writing-skills', 'xlsx'
  ].sort();

  return Response.json({
    hub: 'devendra',
    repo: 'https://github.com/sdachary/devendra',
    totalSkills: skills.length,
    skills: skills.map(name => ({
      name,
      description: 'See devendra/skills/' + name,
      path: 'skills/' + name
    }))
  });
};