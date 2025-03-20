"use client";
import {useEffect, useState} from "react";
import axios from "axios";
import { useSWRConfig } from "swr";
import useTaskStore, {Task_forUpdate} from "@/app/store/taskStore";
import { useToastStore } from "@/app/store/useToastStore";
import {createTask, updateTask} from "@/app/services/taskService";

interface Task {
    id?: string;
    titulo: string;
    descricao: string;
    dataConclusao?: string;
    status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataConclusao, setDataConclusao] = useState("");

    const { mutate } = useSWRConfig();

    const { addToast } = useToastStore();

    // UseEffect para sincronizar o estado inicial com a tarefa (modo edição)
    useEffect(() => {
        if (task) {
            setTitulo(task.titulo || ""); // Preenche o estado com o título da tarefa
            setDescricao(task.descricao || ""); // Preenche o estado com a descrição
            setDataConclusao(
                task.dataConclusao
                    ? new Date(task.dataConclusao).toISOString().substring(0, 10) // Formato "YYYY-MM-DD"
                    : ""
            );
        } else {
            // Zerando os campos (exemplo: ao criar nova tarefa)
            setTitulo("");
            setDescricao("");
            setDataConclusao("");
        }
    }, [task, isOpen]); // Atualizar o estado local quando o "task" mudar.

    // Salvar ou criar nova tarefa
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const taskData = {
            titulo: titulo, // Pegando os dados do estado local
            descricao: descricao || null,
            status: task?.status || "PENDENTE", // Manter status ou usar "PENDENTE"
            dataConclusao: dataConclusao
                ? new Date(`${dataConclusao}T00:00:00`).toISOString() // Formata para ISO-8601 no padrão UTC
                : null,

        } as Task_forUpdate;

        console.log("Requisição enviada:", {
            endpoint: task?.id
                ? `http://localhost:8080/tarefas/${task.id}` // se for PUT
                : "http://localhost:8080/tarefas", // se for POST
            dados: taskData,
        });

        try {
            if (task?.id) {
                // Atualiza no backend
                await updateTask(task.id, taskData);

                // Atualiza no Zustand Store (estado local)
                useTaskStore.getState().updateTask(task.id, taskData);
            } else {
                // Cria no backend
                const newTask = await createTask(taskData);

                // Adiciona no Zustand Store (estado local)
                useTaskStore.getState().createTask(newTask);
            }

            addToast({
                message: 'Tarefa salva com sucesso!',
                type: 'success',
                duration: 3000
            });

            console.log("Tarefa salva com sucesso!");

            await mutate("http://localhost:8080/tarefas");
            onClose(); // Fecha o modal após salvar
        } catch (error) {
            addToast({
                message: 'Erro ao salvar a tarefa.',
                type: 'error',
                duration: 5000
            });

            console.error("Erro ao salvar a tarefa:", error);
            if (axios.isAxiosError(error)) {
                alert(
                    `Erro ao salvar: ${error.response?.status} - ${
                        error.response?.data || "Verifique o log para mais detalhes"
                    }`
                );
            } else {
                alert("Erro desconhecido ocorreu ao salvar os dados.");
            }
        }

    };

    return isOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#00000080] backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl text-gray-800 w-11/12 sm:w-96">
                <h2 className="text-xl font-bold mb-3">
                    {task ? "Editar Tarefa" : "Nova Tarefa"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="border p-2 w-full mb-2 rounded-full"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <textarea
                        className="border p-2 w-full mb-2 rounded-2xl"
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <input
                        type="date"
                        className="border p-2 w-full rounded-full"
                        value={dataConclusao}
                        onChange={(e) => setDataConclusao(e.target.value)}
                    />
                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded-full"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-full"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
}
