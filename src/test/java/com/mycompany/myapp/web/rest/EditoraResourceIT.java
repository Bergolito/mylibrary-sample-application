package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.EditoraAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Editora;
import com.mycompany.myapp.repository.EditoraRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EditoraResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EditoraResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/editoras";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EditoraRepository editoraRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEditoraMockMvc;

    private Editora editora;

    private Editora insertedEditora;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Editora createEntity(EntityManager em) {
        Editora editora = new Editora().nome(DEFAULT_NOME);
        return editora;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Editora createUpdatedEntity(EntityManager em) {
        Editora editora = new Editora().nome(UPDATED_NOME);
        return editora;
    }

    @BeforeEach
    public void initTest() {
        editora = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedEditora != null) {
            editoraRepository.delete(insertedEditora);
            insertedEditora = null;
        }
    }

    @Test
    @Transactional
    void createEditora() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Editora
        var returnedEditora = om.readValue(
            restEditoraMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editora)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Editora.class
        );

        // Validate the Editora in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEditoraUpdatableFieldsEquals(returnedEditora, getPersistedEditora(returnedEditora));

        insertedEditora = returnedEditora;
    }

    @Test
    @Transactional
    void createEditoraWithExistingId() throws Exception {
        // Create the Editora with an existing ID
        editora.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEditoraMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editora)))
            .andExpect(status().isBadRequest());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEditoras() throws Exception {
        // Initialize the database
        insertedEditora = editoraRepository.saveAndFlush(editora);

        // Get all the editoraList
        restEditoraMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(editora.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getEditora() throws Exception {
        // Initialize the database
        insertedEditora = editoraRepository.saveAndFlush(editora);

        // Get the editora
        restEditoraMockMvc
            .perform(get(ENTITY_API_URL_ID, editora.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(editora.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingEditora() throws Exception {
        // Get the editora
        restEditoraMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEditora() throws Exception {
        // Initialize the database
        insertedEditora = editoraRepository.saveAndFlush(editora);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the editora
        Editora updatedEditora = editoraRepository.findById(editora.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEditora are not directly saved in db
        em.detach(updatedEditora);
        updatedEditora.nome(UPDATED_NOME);

        restEditoraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEditora.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEditora))
            )
            .andExpect(status().isOk());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEditoraToMatchAllProperties(updatedEditora);
    }

    @Test
    @Transactional
    void putNonExistingEditora() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editora.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEditoraMockMvc
            .perform(put(ENTITY_API_URL_ID, editora.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editora)))
            .andExpect(status().isBadRequest());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEditora() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editora.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditoraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(editora))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEditora() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editora.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditoraMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(editora)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEditoraWithPatch() throws Exception {
        // Initialize the database
        insertedEditora = editoraRepository.saveAndFlush(editora);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the editora using partial update
        Editora partialUpdatedEditora = new Editora();
        partialUpdatedEditora.setId(editora.getId());

        partialUpdatedEditora.nome(UPDATED_NOME);

        restEditoraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEditora.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEditora))
            )
            .andExpect(status().isOk());

        // Validate the Editora in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEditoraUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedEditora, editora), getPersistedEditora(editora));
    }

    @Test
    @Transactional
    void fullUpdateEditoraWithPatch() throws Exception {
        // Initialize the database
        insertedEditora = editoraRepository.saveAndFlush(editora);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the editora using partial update
        Editora partialUpdatedEditora = new Editora();
        partialUpdatedEditora.setId(editora.getId());

        partialUpdatedEditora.nome(UPDATED_NOME);

        restEditoraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEditora.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEditora))
            )
            .andExpect(status().isOk());

        // Validate the Editora in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEditoraUpdatableFieldsEquals(partialUpdatedEditora, getPersistedEditora(partialUpdatedEditora));
    }

    @Test
    @Transactional
    void patchNonExistingEditora() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editora.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEditoraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, editora.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(editora))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEditora() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editora.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditoraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(editora))
            )
            .andExpect(status().isBadRequest());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEditora() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        editora.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEditoraMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(editora)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Editora in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEditora() throws Exception {
        // Initialize the database
        insertedEditora = editoraRepository.saveAndFlush(editora);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the editora
        restEditoraMockMvc
            .perform(delete(ENTITY_API_URL_ID, editora.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return editoraRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Editora getPersistedEditora(Editora editora) {
        return editoraRepository.findById(editora.getId()).orElseThrow();
    }

    protected void assertPersistedEditoraToMatchAllProperties(Editora expectedEditora) {
        assertEditoraAllPropertiesEquals(expectedEditora, getPersistedEditora(expectedEditora));
    }

    protected void assertPersistedEditoraToMatchUpdatableProperties(Editora expectedEditora) {
        assertEditoraAllUpdatablePropertiesEquals(expectedEditora, getPersistedEditora(expectedEditora));
    }
}
