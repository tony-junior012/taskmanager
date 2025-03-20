import axios from 'axios';
import { Task, Task_forUpdate } from '@/app/store/taskStore';

// URL base para a API
const API_URL = "http://localhost:8080/tarefas";

// Função para buscar a lista de tarefas
export const getTasks = async (): Promise<Task[]> => {
    const response = await axios.get(API_URL);
    return response.data.content; // Supondo que as tarefas estão no campo "content"
};

// Função para criar uma nova tarefa
export const createTask = async (taskData: Task_forUpdate) => {
    const response = await axios.post(API_URL, taskData);
    return response.data; // Retorna o objeto da nova tarefa criada
};

// Função para atualizar uma tarefa existente
export const updateTask = async (id: string, taskData: Task_forUpdate) => {
    const response = await axios.put(`${API_URL}/${id}`, taskData);
    return response.data; // Retorna a tarefa atualizada
};

// Função para deletar uma tarefa
export const deleteTask = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.status; // Retorna o status da operação (200 = sucesso)
};