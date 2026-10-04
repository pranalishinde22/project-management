import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const { user, loading: authLoading } =
    useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] =
  useState(false);
const [error, setError] = useState("");

  // Convert backend project to frontend format
  const formatProject = (project) => ({
    id: project._id,
    name: project.name,
    color: project.color,
  });

  // Convert backend task to frontend format
  const formatTask = (task) => ({
    id: task._id,
    projectId: task.project,
    title: task.title,
    status: task.status,
    priority: task.priority,
    due: task.due,
    assignee: task.assignee,
  });

  // Load projects and tasks from MongoDB
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const projectData =
        await api.get("/projects");

      const formattedProjects =
        projectData.map(formatProject);

      setProjects(formattedProjects);

      // Load tasks for every project
      const taskResponses =
        await Promise.all(
          formattedProjects.map((project) =>
            api.get(
              `/tasks/project/${project.id}`
            )
          )
        );

      const allTasks =
        taskResponses.flat();

      setTasks(
        allTasks.map(formatTask)
      );
    } catch (error) {
      console.error(
        "Failed to load project data:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data whenever authentication changes
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setProjects([]);
      setTasks([]);
      setLoading(false);
      return;
    }

    loadData();
  }, [user, authLoading]);

  // =========================
  // PROJECTS
  // =========================

  const addProject = async (
  name,
  color = "bg-slate-500"
) => {
  try {
    setActionLoading(true);
    setError("");

    const project =
      await api.post("/projects", {
        name,
        color,
      });

    const formattedProject =
      formatProject(project);

    setProjects((current) => [
      formattedProject,
      ...current,
    ]);

    return formattedProject;
  } catch (error) {
    console.error(
      "Failed to create project:",
      error
    );

    setError(error.message);
    throw error;
  } finally {
    setActionLoading(false);
  }
};

  const updateProject = async (
  projectId,
  name
) => {
  try {
    setActionLoading(true);
    setError("");

    const project =
      await api.put(
        `/projects/${projectId}`,
        {
          name,
        }
      );

    const formattedProject =
      formatProject(project);

    setProjects((current) =>
      current.map((item) =>
        item.id === projectId
          ? formattedProject
          : item
      )
    );

    return formattedProject;
  } catch (error) {
    console.error(
      "Failed to update project:",
      error
    );

    setError(error.message);
    throw error;
  } finally {
    setActionLoading(false);
  }
};

  const deleteProject = async (
  projectId
) => {
  try {
    setActionLoading(true);
    setError("");

    await api.delete(
      `/projects/${projectId}`
    );

    setProjects((current) =>
      current.filter(
        (project) =>
          project.id !== projectId
      )
    );

    setTasks((current) =>
      current.filter(
        (task) =>
          task.projectId !== projectId
      )
    );
  } catch (error) {
    console.error(
      "Failed to delete project:",
      error
    );

    setError(error.message);
    throw error;
  } finally {
    setActionLoading(false);
  }
};

  // =========================
  // TASKS
  // =========================

  const addTask = async (taskData) => {
  try {
    setActionLoading(true);
    setError("");

    const task =
      await api.post("/tasks", {
        title: taskData.title,
        projectId:
          taskData.projectId,
        status:
          taskData.status || "todo",
        priority:
          taskData.priority || "medium",
        due: taskData.due || "",
        assignee:
          taskData.assignee || "NA",
      });

    const formattedTask =
      formatTask(task);

    setTasks((current) => [
      formattedTask,
      ...current,
    ]);

    return formattedTask;
  } catch (error) {
    console.error(
      "Failed to create task:",
      error
    );

    setError(error.message);
    throw error;
  } finally {
    setActionLoading(false);
  }
};

  const updateTask = async (
  taskId,
  taskData
) => {
  try {
    setActionLoading(true);
    setError("");

    const task =
      await api.put(
        `/tasks/${taskId}`,
        {
          title: taskData.title,
          status: taskData.status,
          priority: taskData.priority,
          due: taskData.due,
          assignee: taskData.assignee,
        }
      );

    const formattedTask =
      formatTask(task);

    setTasks((current) =>
      current.map((item) =>
        item.id === taskId
          ? formattedTask
          : item
      )
    );

    return formattedTask;
  } catch (error) {
    console.error(
      "Failed to update task:",
      error
    );

    setError(error.message);
    throw error;
  } finally {
    setActionLoading(false);
  }
};

  const deleteTask = async (
  taskId
) => {
  try {
    setActionLoading(true);
    setError("");

    await api.delete(
      `/tasks/${taskId}`
    );

    setTasks((current) =>
      current.filter(
        (task) =>
          task.id !== taskId
      )
    );
  } catch (error) {
    console.error(
      "Failed to delete task:",
      error
    );

    setError(error.message);
    throw error;
  } finally {
    setActionLoading(false);
  }
};

const moveTask = async (
  taskId,
  status
) => {
  try {
    const task = tasks.find(
      (item) =>
        item.id === taskId
    );

    if (!task) {
      return;
    }

    await updateTask(taskId, {
      title: task.title,
      status,
      priority: task.priority,
      due: task.due,
      assignee: task.assignee,
    });
  } catch (error) {
    console.error(
      "Failed to move task:",
      error
    );

    throw error;
  }
};

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        loading,
        error,

        addProject,
        updateProject,
        deleteProject,

        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}