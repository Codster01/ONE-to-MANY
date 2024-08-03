import axios from "axios";

const api = axios.create({
    baseUrl: "http://localhost:3001",
});

export const getProjects = async() => {
    const response = await api.get("/project");
    return response.data;
};

export const createProject = async(project) => {
    const response = await api.post("/project", project);
    return response.data;
};

export const getTasks = async() => {
    const response = await api.get("/task");
    return response.data;
};

export const createTask = async(task) => {
    const response = await api.post("/task", task);
    return response.data;
};




