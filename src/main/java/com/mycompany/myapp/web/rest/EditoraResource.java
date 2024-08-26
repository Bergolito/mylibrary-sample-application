package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Editora;
import com.mycompany.myapp.repository.EditoraRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Editora}.
 */
@RestController
@RequestMapping("/api/editoras")
@Transactional
public class EditoraResource {

    private static final Logger log = LoggerFactory.getLogger(EditoraResource.class);

    private static final String ENTITY_NAME = "editora";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EditoraRepository editoraRepository;

    public EditoraResource(EditoraRepository editoraRepository) {
        this.editoraRepository = editoraRepository;
    }

    /**
     * {@code POST  /editoras} : Create a new editora.
     *
     * @param editora the editora to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new editora, or with status {@code 400 (Bad Request)} if the editora has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Editora> createEditora(@RequestBody Editora editora) throws URISyntaxException {
        log.debug("REST request to save Editora : {}", editora);
        if (editora.getId() != null) {
            throw new BadRequestAlertException("A new editora cannot already have an ID", ENTITY_NAME, "idexists");
        }
        editora = editoraRepository.save(editora);
        return ResponseEntity.created(new URI("/api/editoras/" + editora.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, editora.getId().toString()))
            .body(editora);
    }

    /**
     * {@code PUT  /editoras/:id} : Updates an existing editora.
     *
     * @param id the id of the editora to save.
     * @param editora the editora to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated editora,
     * or with status {@code 400 (Bad Request)} if the editora is not valid,
     * or with status {@code 500 (Internal Server Error)} if the editora couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Editora> updateEditora(@PathVariable(value = "id", required = false) final Long id, @RequestBody Editora editora)
        throws URISyntaxException {
        log.debug("REST request to update Editora : {}, {}", id, editora);
        if (editora.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, editora.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!editoraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        editora = editoraRepository.save(editora);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, editora.getId().toString()))
            .body(editora);
    }

    /**
     * {@code PATCH  /editoras/:id} : Partial updates given fields of an existing editora, field will ignore if it is null
     *
     * @param id the id of the editora to save.
     * @param editora the editora to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated editora,
     * or with status {@code 400 (Bad Request)} if the editora is not valid,
     * or with status {@code 404 (Not Found)} if the editora is not found,
     * or with status {@code 500 (Internal Server Error)} if the editora couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Editora> partialUpdateEditora(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Editora editora
    ) throws URISyntaxException {
        log.debug("REST request to partial update Editora partially : {}, {}", id, editora);
        if (editora.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, editora.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!editoraRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Editora> result = editoraRepository
            .findById(editora.getId())
            .map(existingEditora -> {
                if (editora.getNome() != null) {
                    existingEditora.setNome(editora.getNome());
                }

                return existingEditora;
            })
            .map(editoraRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, editora.getId().toString())
        );
    }

    /**
     * {@code GET  /editoras} : get all the editoras.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of editoras in body.
     */
    @GetMapping("")
    public List<Editora> getAllEditoras() {
        log.debug("REST request to get all Editoras");
        return editoraRepository.findAll();
    }

    /**
     * {@code GET  /editoras/:id} : get the "id" editora.
     *
     * @param id the id of the editora to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the editora, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Editora> getEditora(@PathVariable("id") Long id) {
        log.debug("REST request to get Editora : {}", id);
        Optional<Editora> editora = editoraRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(editora);
    }

    /**
     * {@code DELETE  /editoras/:id} : delete the "id" editora.
     *
     * @param id the id of the editora to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEditora(@PathVariable("id") Long id) {
        log.debug("REST request to delete Editora : {}", id);
        editoraRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
