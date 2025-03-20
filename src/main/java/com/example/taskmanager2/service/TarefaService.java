package com.example.taskmanager2.service;

import com.example.taskmanager2.model.Tarefa;
import com.example.taskmanager2.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository repository;

    public Page<Tarefa> listarTarefas(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Tarefa salvarTarefa(Tarefa tarefa) {
        return repository.save(tarefa);
    }

    public void deletarTarefa(UUID id) {
        repository.deleteById(id);
    }

}
