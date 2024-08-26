package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Idioma;
import com.mycompany.myapp.repository.IdiomaRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Idioma}.
 */
@RestController
@RequestMapping("/api/idiomas")
@Transactional
public class IdiomaResource {

    private static final Logger log = LoggerFactory.getLogger(IdiomaResource.class);

    private static final String ENTITY_NAME = "idioma";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IdiomaRepository idiomaRepository;

    public IdiomaResource(IdiomaRepository idiomaRepository) {
        this.idiomaRepository = idiomaRepository;
    }

    /**
     * {@code POST  /idiomas} : Create a new idioma.
     *
     * @param idioma the idioma to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new idioma, or with status {@code 400 (Bad Request)} if the idioma has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Idioma> createIdioma(@RequestBody Idioma idioma) throws URISyntaxException {
        log.debug("REST request to save Idioma : {}", idioma);
        if (idioma.getId() != null) {
            throw new BadRequestAlertException("A new idioma cannot already have an ID", ENTITY_NAME, "idexists");
        }
        idioma = idiomaRepository.save(idioma);
        return ResponseEntity.created(new URI("/api/idiomas/" + idioma.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, idioma.getId().toString()))
            .body(idioma);
    }

    /**
     * {@code PUT  /idiomas/:id} : Updates an existing idioma.
     *
     * @param id the id of the idioma to save.
     * @param idioma the idioma to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated idioma,
     * or with status {@code 400 (Bad Request)} if the idioma is not valid,
     * or with status {@code 500 (Internal Server Error)} if the idioma couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Idioma> updateIdioma(@PathVariable(value = "id", required = false) final Long id, @RequestBody Idioma idioma)
        throws URISyntaxException {
        log.debug("REST request to update Idioma : {}, {}", id, idioma);
        if (idioma.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, idioma.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!idiomaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        idioma = idiomaRepository.save(idioma);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, idioma.getId().toString()))
            .body(idioma);
    }

    /**
     * {@code PATCH  /idiomas/:id} : Partial updates given fields of an existing idioma, field will ignore if it is null
     *
     * @param id the id of the idioma to save.
     * @param idioma the idioma to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated idioma,
     * or with status {@code 400 (Bad Request)} if the idioma is not valid,
     * or with status {@code 404 (Not Found)} if the idioma is not found,
     * or with status {@code 500 (Internal Server Error)} if the idioma couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Idioma> partialUpdateIdioma(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Idioma idioma
    ) throws URISyntaxException {
        log.debug("REST request to partial update Idioma partially : {}, {}", id, idioma);
        if (idioma.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, idioma.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!idiomaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Idioma> result = idiomaRepository
            .findById(idioma.getId())
            .map(existingIdioma -> {
                if (idioma.getNome() != null) {
                    existingIdioma.setNome(idioma.getNome());
                }
                if (idioma.getDescricao() != null) {
                    existingIdioma.setDescricao(idioma.getDescricao());
                }

                return existingIdioma;
            })
            .map(idiomaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, idioma.getId().toString())
        );
    }

    /**
     * {@code GET  /idiomas} : get all the idiomas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of idiomas in body.
     */
    @GetMapping("")
    public List<Idioma> getAllIdiomas() {
        log.debug("REST request to get all Idiomas");
        return idiomaRepository.findAll();
    }

    /**
     * {@code GET  /idiomas/:id} : get the "id" idioma.
     *
     * @param id the id of the idioma to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the idioma, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Idioma> getIdioma(@PathVariable("id") Long id) {
        log.debug("REST request to get Idioma : {}", id);
        Optional<Idioma> idioma = idiomaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(idioma);
    }

    /**
     * {@code DELETE  /idiomas/:id} : delete the "id" idioma.
     *
     * @param id the id of the idioma to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIdioma(@PathVariable("id") Long id) {
        log.debug("REST request to delete Idioma : {}", id);
        idiomaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
