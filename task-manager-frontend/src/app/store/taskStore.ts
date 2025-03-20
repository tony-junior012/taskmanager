/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from "zustand";

// Definindo o tipo da tarefa
export interface Task {
    id: string; // UUID no backend é string no frontend
    titulo: string;
    descricao: string;
    status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
    dataCriacao: string; // Instant vira string ISO no JSON
    dataConclusao?: string; // Pode ser nulo
}

export interface Task_forUpdate {
    id: string; // UUID no backend é string no frontend
    titulo: string;
    descricao: string;
    status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
    dataConclusao?: string; // Pode ser nulo
}

// Definindo o tipo do store
interface TaskStore {
    tasks: Task[];
    setTasks: (tasks: (prevTasks: Task[]) => {
        id: string;
        titulo: string;
        descricao: string;
        status: string;
        dataCriacao: string;
        dataConclusao?: string
    }[]) => void;
    toggleTaskStatus: (id: string) => void; // Função para alternar o status
}

interface TaskState {
    tasks: Task[];
    setTasks: (updater: Task[] | ((prevTasks: Task[]) => Task[])) => void;
    updateStatus: (id: string, status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO") => void;
    updateTask: (id: string, updatedTask: Task_forUpdate) => void;
    createTask: (newTask: Task) => void;
    deleteTask: (id: string) => void;
}


// Criando o store com Zustand
export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    setTasks: (updater) =>
        set((state) => ({
            tasks: typeof updater === "function" ? updater(state.tasks) : updater,
        })),

    // Atualiza apenas o status de uma tarefa
    updateStatus: (id, status) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, status } : task
            ),
        })),

    // Atualiza toda a tarefa pelo ID
    updateTask: (id: string, updatedTask: Task_forUpdate) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updatedTask } : task
            ),
        })),

    // Cria uma nova tarefa no estado
    createTask: (newTask: Task) =>
        set((state) => ({
            tasks: [...state.tasks, newTask],
        })),

    // Remove uma tarefa pelo ID
    deleteTask: (id: string) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),

}));


export default useTaskStore;