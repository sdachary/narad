export default {
  async fetch(request, env) {
    // GET request - show status
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'mcptq',
        version: '1.0.0',
        endpoints: [
          'POST task_create',
          'POST task_get_status', 
          'POST task_update_progress',
          'POST task_complete',
          'POST task_list'
        ]
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // POST request - handle MCP tools
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const { tool, params } = await request.json();
      const TASKS = env.TASKS;

      switch (tool) {
        case 'task_create': {
          const taskId = crypto.randomUUID();
          const task = {
            id: taskId,
            name: params.name || 'Untitled Task',
            status: 'pending',
            progress: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: params.metadata || {}
          };
          await TASKS.put(`task:${taskId}`, JSON.stringify(task));
          return Response.json({ taskId, task });
        }

        case 'task_get_status': {
          const taskId = params.taskId;
          const taskData = await TASKS.get(`task:${taskId}`);
          if (!taskData) {
            return Response.json({ error: 'Task not found' }, { status: 404 });
          }
          return Response.json(JSON.parse(taskData));
        }

        case 'task_update_progress': {
          const taskId = params.taskId;
          const taskData = await TASKS.get(`task:${taskId}`);
          if (!taskData) {
            return Response.json({ error: 'Task not found' }, { status: 404 });
          }
          const task = JSON.parse(taskData);
          task.progress = params.progress;
          task.status = params.status || 'in_progress';
          task.updated_at = new Date().toISOString();
          await TASKS.put(`task:${taskId}`, JSON.stringify(task));
          return Response.json(task);
        }

        case 'task_complete': {
          const taskId = params.taskId;
          const taskData = await TASKS.get(`task:${taskId}`);
          if (!taskData) {
            return Response.json({ error: 'Task not found' }, { status: 404 });
          }
          const task = JSON.parse(taskData);
          task.status = 'completed';
          task.progress = 100;
          task.result = params.result || {};
          task.updated_at = new Date().toISOString();
          await TASKS.put(`task:${taskId}`, JSON.stringify(task));
          return Response.json(task);
        }

        case 'task_list': {
          const status = params.status;
          const list = await TASKS.list({ prefix: 'task:' });
          const tasks = [];
          for (const key of list.keys) {
            const taskData = await TASKS.get(key.name);
            const task = JSON.parse(taskData);
            if (!status || task.status === status) {
              tasks.push(task);
            }
          }
          return Response.json({ tasks });
        }

        default:
          return Response.json({ error: `Unknown tool: ${tool}` }, { status: 400 });
      }
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }
}
