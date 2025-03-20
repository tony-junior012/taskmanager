"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import useTaskStore, { Task } from "@/app/store/taskStore";
import { useToastStore } from "@/app/store/useToastStore";
import TaskModal from "@/app/components/TaskModal";
import {deleteTask, getTasks} from "@/app/services/taskService";

export default function TaskList() {
    const { tasks, setTasks } = useTaskStore();
    const { data, error } = useSWR("tasks", getTasks);
    const [modalOpen, setModalDetails] = useState<{ open: boolean; task: Task | null }>({
        open: false,
        task: null,
    });
    const [detailModal, setDetailModal] = useState<{ open: boolean; task: Task | null }>({
        open: false,
        task: null,
    });
    const [filter, setFilter] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentDropdown, setCurrentDropdown] = useState<string | null>(null);

    const { addToast } = useToastStore();

    useEffect(() => {
        if (data) setTasks(data);
    }, [data]);

    if (error) return <div className="text-red-500">Erro ao carregar tarefas</div>;
    if (!data) return <div className="text-gray-500">Carregando...</div>;

    const filteredTasks = tasks
        .filter((task) => filter === "ALL" || task.status === filter)
        .sort((a, b) => {
            if (sortOrder === "asc") {
                return a.titulo.localeCompare(b.titulo);
            } else if (sortOrder === "desc") {
                return b.titulo.localeCompare(a.titulo);
            } else if (sortOrder === "status-pendentes-primeiro") {
                // Ordenação: Pendentes > Em andamento > Concluídas
                const order = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"];
                return order.indexOf(a.status) - order.indexOf(b.status);
            } else if (sortOrder === "status-em-andamento-primeiro") {
                // Ordenação: Em andamento > Pendentes > Concluídas
                const order = ["EM_ANDAMENTO", "PENDENTE", "CONCLUIDO"];
                return order.indexOf(a.status) - order.indexOf(b.status);
            }
            return 0; // Retorno padrão zero se nenhuma condição for atendida
        });

    const handleStatusChange = async (taskId: string, novoStatus: string) => {
        try {
            const task = {
                status: novoStatus,
            };

            console.log("Enviando para o backend:", task);

            await axios.put(`http://localhost:8080/tarefas/${taskId}`, task);

            setTasks((prevTasks: Task[]) =>
                prevTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, status: novoStatus as "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" }
                        : task
                )
            );

            addToast({
                message: 'Status da tarefa atualizado com sucesso!',
                type: 'success',
                duration: 3000
            });

        } catch (error) {
            addToast({
                message: 'Erro ao atualizar status da tarefa.',
                type: 'error',
                duration: 5000
            });

            console.error("Erro ao atualizar status da tarefa:", error);
            alert("Não foi possível atualizar o status. Tente novamente.");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        console.log("Excluir tarefa com ID:", taskId);
        try {
            // Exclusão no backend
            await deleteTask(taskId);

            // Exclusão no estado local (Zustand)
            useTaskStore.getState().deleteTask(taskId);

            addToast({
                message: 'Tarefa excluída com sucesso!',
                type: 'success',
                duration: 3000
            });

            console.log("Tarefa excluída com sucesso!");
        } catch (error) {
            addToast({
                message: 'Erro ao excluir a tarefa.',
                type: 'error',
                duration: 5000
            });
            console.error("Erro ao excluir a tarefa:", error);
            alert("Não foi possível excluir a tarefa. Tente novamente.");
        }
    };

    const handleEditTask = (task: Task) => {
        if (task) {
            setModalDetails({open: true, task: task});
        } else {
            console.warn("task_item não está definido");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-6">
                {/* Cabeçalho */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    {/* Logo e Título */}
                    <div className="flex items-center gap-4">
                        <Image
                            src="/favicon.svg"
                            alt="Ícone da aplicação"
                            width={40}
                            height={40}
                        />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Gerenciador de Tarefas
                        </h1>
                    </div>

                    {/* Botão de Nova Tarefa */}
                    <button
                        onClick={() => {
                            setModalDetails({ open: true, task: null });
                        }}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-sky-700 transition-all text-white px-4 py-2 rounded-full"
                    >
                        + Nova Tarefa
                    </button>
                </div>

                <TaskModal isOpen={modalOpen.open} task={modalOpen.task} onClose={() => setModalDetails({ open: false, task: null })} />

                {/* Filtros */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 w-full box-border overflow-auto">
                    <div className="flex items-center gap-4">
                        {/* Filtro de Status */}
                        <div className="relative w-fit">
                            <select
                                className="border rounded-xl px-3 py-2 pr-10 text-gray-800 appearance-none"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="ALL">Todos</option>
                                <option value="PENDENTE">Pendente</option>
                                <option value="EM_ANDAMENTO">Em andamento</option>
                                <option value="CONCLUIDO">Concluído</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center text-gray-800 pointer-events-none">
                                ▼
                            </div>
                        </div>

                        {/* Filtro de Ordenação */}
                        <div className="relative w-fit">
                            <select
                                className="border rounded-xl px-3 py-2 pr-8 text-gray-800 appearance-none"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="asc">Ordem A-Z</option>
                                <option value="desc">Ordem Z-A</option>
                                <option value="status-pendentes-primeiro">Pendentes primeiro</option>
                                <option value="status-em-andamento-primeiro">Em Andamento Primeiro </option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center text-gray-800 pointer-events-none">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Tarefas */}
                <ul className="space-y-4">
                    {filteredTasks.map((task_item) => (
                        <li
                            key={task_item.id}
                            className={`p-4 border rounded-3xl hover:shadow-lg shadow-sm transition-all flex flex-wrap items-center justify-between content-center flex-row cursor-pointer ${
                                task_item.status === "PENDENTE"
                                    ? "bg-red-100"
                                    : task_item.status === "EM_ANDAMENTO"
                                        ? "bg-yellow-100"
                                        : "bg-green-100"
                            }`}
                            onClick={() => setDetailModal({ open: true, task: task_item })}
                        >
                            <div className="relative flex items-center justify-between content-center box-border overflow-hidden w-full">
                                {/* Conteúdo Principal */}
                                <div className="sm:w-auto w-full flex-1">
                                    <label
                                        className="flex items-center gap-2 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden peer"
                                            checked={task_item.status === "CONCLUIDO"}
                                            onChange={() =>
                                                handleStatusChange(
                                                    task_item.id,
                                                    task_item.status === "CONCLUIDO" ? "PENDENTE" : "CONCLUIDO"
                                                )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="w-6 h-6 scale-90 inline-block rounded-full border-2 border-gray-400 peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:shadow-lg flex items-center justify-center transition-all duration-300 transform peer-checked:scale-100">
                                      {task_item.status === "CONCLUIDO" && (
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 w-5 text-white"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                          >
                                              <path
                                                  fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                                  clipRule="evenodd"
                                              />
                                          </svg>
                                      )}
                                    </span>
                                        <h3 className="font-bold text-lg w-[80%] text-gray-800 leading-[2] truncate">
                                            {task_item.titulo}
                                        </h3>
                                    </label>
                                    {/* Chips */}
                                    <div className="gap-2 mt-2 flex flex-nowrap items-center justify-start box-border overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 w-[80%]">
                                        <div className="relative w-auto flex-shrink-0">
                                            <select
                                                value={task_item.status}
                                                onChange={(e) => handleStatusChange(task_item.id, e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className={`border rounded-full px-3 py-2 pr-10 text-base appearance-none ${
                                                    task_item.status === "PENDENTE"
                                                        ? "bg-red-500 text-white"
                                                        : task_item.status === "EM_ANDAMENTO"
                                                            ? "bg-yellow-500 text-white"
                                                            : "bg-green-500 text-white"
                                                }`}
                                            >
                                                <option value="PENDENTE">Pendente</option>
                                                <option value="EM_ANDAMENTO">Em andamento</option>
                                                <option value="CONCLUIDO">Concluído</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-3 flex items-center text-white pointer-events-none">
                                                ▼
                                            </div>
                                        </div>

                                        <div className="flex items-center h-10 gap-2"> {/* Altura definida no pai */}
                                            {task_item.descricao && (
                                                <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-800 flex-shrink-0 items-center justify-center content-center h-full">
                                                   <Image
                                                       src={'/description.svg'}
                                                       alt={'Descrição da tarefa'}
                                                       width={24}
                                                       height={24}
                                                   />
                                               </span>
                                            )}

                                            {task_item.dataConclusao && (
                                                <span className="px-3 py-1 text-base rounded-full bg-gray-200 text-gray-800 flex-shrink-0 flex items-center justify-center content-center h-full">
                                            <Image src={'/event.svg'} alt={'Data de conclusão'} width={24} height={24} />
                                            <div className="ml-2 flex align-center justify-center content-center text-center">
                                                {new Date(task_item.dataConclusao).toLocaleDateString("pt-BR")}
                                            </div>
                                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="absolute right-0 sm:mt-0 sm:w-auto flex-shrink-0">
                                    <button
                                        className="bg-transparent hover:bg-gray-200 transition-all p-2 rounded-full focus:outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentDropdown(
                                                currentDropdown === task_item.id ? null : task_item.id
                                            );
                                        }}
                                    >
                                        <Image
                                            src="/more.svg"
                                            alt="Abrir mais opções"
                                            width={24}
                                            height={24}
                                        />
                                    </button>
                                </div>
                            </div>

                            {currentDropdown === task_item.id && (
                                <div className="absolute right-18 sm:right-22 md:right-24 lg:right-38 mt-6 sm:mt-12 md:mt-20 lg:mt-32 w-40 bg-white border rounded-2xl shadow-lg z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditTask(task_item);
                                        }}
                                        className="block w-full text-left px-4 py-2 rounded-t-2xl text-gray-700 hover:bg-gray-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteTask(task_item.id);
                                        }}
                                        className="block w-full text-left px-4 py-2 rounded-b-2xl text-red-500 hover:bg-red-100"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Modal de Detalhes */}
                {detailModal.open && detailModal.task && (
                    <div className="fixed inset-0 bg-[#00000080] backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96 text-gray-700">
                            <h3 className="text-xl font-bold mb-4">
                                {detailModal.task.titulo}
                            </h3>
                            <p className="mb-2">
                                <strong>Status:</strong> {detailModal.task.status === 'EM_ANDAMENTO' ? 'Em andamento' : detailModal.task.status === 'CONCLUIDO' ? 'Concluído' : 'Pendente'}
                            </p>
                            <p className="mb-2">
                                <strong>Data de Conclusão:</strong>{" "}
                                {detailModal.task.dataConclusao}
                            </p>
                            {detailModal.task.descricao && (
                                <p className="mb-4">
                                    <strong>Descrição:</strong> {detailModal.task.descricao}
                                </p>
                            )}
                            <button
                                onClick={() => setDetailModal({ open: false, task: null })}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}