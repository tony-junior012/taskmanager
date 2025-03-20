package com.example.taskmanager2.controller;

import com.example.taskmanager2.model.Tarefa;
import com.example.taskmanager2.repository.TarefaRepository;
import com.example.taskmanager2.service.TarefaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.config.Task;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/tarefas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Permite requisições do frontend
public class TarefaController {

    private final TarefaService service;
    private final TarefaRepository tarefaRepository;

    @GetMapping
    public Page<Tarefa> listarTarefas(Pageable pageable) {
        return service.listarTarefas(pageable);
    }

    @PostMapping
    public Tarefa criarTarefa(@RequestBody Tarefa tarefa) {
        return service.salvarTarefa(tarefa);
    }

    @DeleteMapping("/{id}")
    public void deletarTarefa(@PathVariable UUID id) {
        service.deletarTarefa(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarTarefa(
            @PathVariable UUID id,
            @RequestBody Tarefa updatedTask
    ) {
        try {
            // Busca a tarefa existente no banco de dados
            Tarefa existingTask = tarefaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

            // Atualiza apenas os campos enviados; mantém valores se forem nulos
            if (updatedTask.getTitulo() != null) {
                existingTask.setTitulo(updatedTask.getTitulo());
            }
            if (updatedTask.getDescricao() != null) {
                existingTask.setDescricao(updatedTask.getDescricao());
            }
            if (updatedTask.getStatus() != null) {
                existingTask.setStatus(updatedTask.getStatus());
            }
            if (updatedTask.getDataConclusao() != null) {
                existingTask.setDataConclusao(updatedTask.getDataConclusao());
            }

            // Salva a tarefa atualizada
            Tarefa savedTask = tarefaRepository.save(existingTask);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            e.printStackTrace(); // Log detalhado para debugging
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }


}