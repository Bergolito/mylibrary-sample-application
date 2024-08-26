package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EditoraTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EditoraTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Editora.class);
        Editora editora1 = getEditoraSample1();
        Editora editora2 = new Editora();
        assertThat(editora1).isNotEqualTo(editora2);

        editora2.setId(editora1.getId());
        assertThat(editora1).isEqualTo(editora2);

        editora2 = getEditoraSample2();
        assertThat(editora1).isNotEqualTo(editora2);
    }
}
