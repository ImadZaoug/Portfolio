
let skillIdCounter = 0

const generateId = () => {
  return `skill_${skillIdCounter++}`
}

const generateBranches = (parentSkill, depth, maxDepth, maxBranches) => {
  if (depth >= maxDepth) return []
  
  const numBranches = Math.floor(Math.random() * maxBranches) + 1
  const branches = []
  
  for (let i = 0; i < numBranches; i++) {
    const skill = {
      id: generateId(),
      name: `Skill ${skillIdCounter}`,
      icon: '⭐️',
      level: 0,
      maxLevel: Math.floor(Math.random() * 3) + 1,
      unlocked: depth === 0,
      parentId: parentSkill.id,
      children: []
    }
    
    skill.children = generateBranches(skill, depth + 1, maxDepth, maxBranches)
    branches.push(skill)
  }
  
  return branches
}

export const generateSkillsTree = (rootSkills, maxDepth = 3, maxBranchesPerNode = 3) => {
  const tree = []
  
  // Generate first level from root skills
  const rootLevel = rootSkills.map(rootSkill => ({
    id: generateId(),
    ...rootSkill,
    level: 0,
    maxLevel: 3,
    unlocked: true,
    parentId: null,
    children: []
  }))
  
  // Generate branches for each root skill
  rootLevel.forEach(rootSkill => {
    rootSkill.children = generateBranches(rootSkill, 0, maxDepth, maxBranchesPerNode)
  })
  
  // Organize skills by levels
  const levels = [rootLevel]
  let currentLevel = rootLevel
  
  while (currentLevel.length > 0) {
    const nextLevel = currentLevel.reduce((acc, skill) => {
      return [...acc, ...skill.children]
    }, [])
    
    if (nextLevel.length > 0) {
      levels.push(nextLevel)
    }
    currentLevel = nextLevel
  }
  
  return levels
}