class Planner {
  plan(request, userContext) {
    const tasks = [];

    // Analyze request type
    if (request.type === 'resume_analysis' || request.type === 'comprehensive_analysis') {
      tasks.push(
        { id: 1, type: 'parse_resume', priority: 1, dependsOn: [] },
        { id: 2, type: 'extract_skills', priority: 2, dependsOn: [1] },
        { id: 3, type: 'ats_analysis', priority: 3, dependsOn: [2] },
        { id: 4, type: 'skill_gap', priority: 4, dependsOn: [2] },
        { id: 5, type: 'placement_score', priority: 5, dependsOn: [3, 4] }
      );
    }

    return this.sortByPriority(tasks);
  }

  sortByPriority(tasks) {
    return tasks.sort((a, b) => a.priority - b.priority);
  }

  validatePlan(plan) {
    // Check for circular dependencies
    const visited = new Set();
    
    const hasCircularDependency = (taskId, path = []) => {
      if (path.includes(taskId)) return true;
      if (visited.has(taskId)) return false;
      
      visited.add(taskId);
      
      const task = plan.find(t => t.id === taskId);
      if (!task) return false;
      
      for (const depId of task.dependsOn) {
        if (hasCircularDependency(depId, [...path, taskId])) {
          return true;
        }
      }
      
      return false;
    };

    for (const task of plan) {
      visited.clear();
      if (hasCircularDependency(task.id)) {
        throw new Error('Circular dependency detected in plan');
      }
    }

    return true;
  }
}

module.exports = Planner;
