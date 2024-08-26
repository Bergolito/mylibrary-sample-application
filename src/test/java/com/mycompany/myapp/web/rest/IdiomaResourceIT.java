package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.IdiomaAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Idioma;
import com.mycompany.myapp.repository.IdiomaRepository;
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
 * Integration tests for the {@link IdiomaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IdiomaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/idiomas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private IdiomaRepository idiomaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIdiomaMockMvc;

    private Idioma idioma;

    private Idioma insertedIdioma;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Idioma createEntity(EntityManager em) {
        Idioma idioma = new Idioma().nome(DEFAULT_NOME).descricao(DEFAULT_DESCRICAO);
        return idioma;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Idioma createUpdatedEntity(EntityManager em) {
        Idioma idioma = new Idioma().nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO);
        return idioma;
    }

    @BeforeEach
    public void initTest() {
        idioma = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedIdioma != null) {
            idiomaRepository.delete(insertedIdioma);
            insertedIdioma = null;
        }
    }

    @Test
    @Transactional
    void createIdioma() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Idioma
        var returnedIdioma = om.readValue(
            restIdiomaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(idioma)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Idioma.class
        );

        // Validate the Idioma in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertIdiomaUpdatableFieldsEquals(returnedIdioma, getPersistedIdioma(returnedIdioma));

        insertedIdioma = returnedIdioma;
    }

    @Test
    @Transactional
    void createIdiomaWithExistingId() throws Exception {
        // Create the Idioma with an existing ID
        idioma.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIdiomaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(idioma)))
            .andExpect(status().isBadRequest());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIdiomas() throws Exception {
        // Initialize the database
        insertedIdioma = idiomaRepository.saveAndFlush(idioma);

        // Get all the idiomaList
        restIdiomaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(idioma.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @Test
    @Transactional
    void getIdioma() throws Exception {
        // Initialize the database
        insertedIdioma = idiomaRepository.saveAndFlush(idioma);

        // Get the idioma
        restIdiomaMockMvc
            .perform(get(ENTITY_API_URL_ID, idioma.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(idioma.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingIdioma() throws Exception {
        // Get the idioma
        restIdiomaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingIdioma() throws Exception {
        // Initialize the database
        insertedIdioma = idiomaRepository.saveAndFlush(idioma);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the idioma
        Idioma updatedIdioma = idiomaRepository.findById(idioma.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedIdioma are not directly saved in db
        em.detach(updatedIdioma);
        updatedIdioma.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO);

        restIdiomaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIdioma.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedIdioma))
            )
            .andExpect(status().isOk());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedIdiomaToMatchAllProperties(updatedIdioma);
    }

    @Test
    @Transactional
    void putNonExistingIdioma() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        idioma.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdiomaMockMvc
            .perform(put(ENTITY_API_URL_ID, idioma.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(idioma)))
            .andExpect(status().isBadRequest());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIdioma() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        idioma.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdiomaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(idioma))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIdioma() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        idioma.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdiomaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(idioma)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIdiomaWithPatch() throws Exception {
        // Initialize the database
        insertedIdioma = idiomaRepository.saveAndFlush(idioma);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the idioma using partial update
        Idioma partialUpdatedIdioma = new Idioma();
        partialUpdatedIdioma.setId(idioma.getId());

        partialUpdatedIdioma.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO);

        restIdiomaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdioma.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIdioma))
            )
            .andExpect(status().isOk());

        // Validate the Idioma in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIdiomaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedIdioma, idioma), getPersistedIdioma(idioma));
    }

    @Test
    @Transactional
    void fullUpdateIdiomaWithPatch() throws Exception {
        // Initialize the database
        insertedIdioma = idiomaRepository.saveAndFlush(idioma);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the idioma using partial update
        Idioma partialUpdatedIdioma = new Idioma();
        partialUpdatedIdioma.setId(idioma.getId());

        partialUpdatedIdioma.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO);

        restIdiomaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIdioma.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIdioma))
            )
            .andExpect(status().isOk());

        // Validate the Idioma in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIdiomaUpdatableFieldsEquals(partialUpdatedIdioma, getPersistedIdioma(partialUpdatedIdioma));
    }

    @Test
    @Transactional
    void patchNonExistingIdioma() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        idioma.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIdiomaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, idioma.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(idioma))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIdioma() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        idioma.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdiomaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(idioma))
            )
            .andExpect(status().isBadRequest());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIdioma() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        idioma.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIdiomaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(idioma)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Idioma in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIdioma() throws Exception {
        // Initialize the database
        insertedIdioma = idiomaRepository.saveAndFlush(idioma);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the idioma
        restIdiomaMockMvc
            .perform(delete(ENTITY_API_URL_ID, idioma.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return idiomaRepository.count();
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

    protected Idioma getPersistedIdioma(Idioma idioma) {
        return idiomaRepository.findById(idioma.getId()).orElseThrow();
    }

    protected void assertPersistedIdiomaToMatchAllProperties(Idioma expectedIdioma) {
        assertIdiomaAllPropertiesEquals(expectedIdioma, getPersistedIdioma(expectedIdioma));
    }

    protected void assertPersistedIdiomaToMatchUpdatableProperties(Idioma expectedIdioma) {
        assertIdiomaAllUpdatablePropertiesEquals(expectedIdioma, getPersistedIdioma(expectedIdioma));
    }
}
