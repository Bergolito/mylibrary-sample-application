package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.IdiomaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IdiomaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Idioma.class);
        Idioma idioma1 = getIdiomaSample1();
        Idioma idioma2 = new Idioma();
        assertThat(idioma1).isNotEqualTo(idioma2);

        idioma2.setId(idioma1.getId());
        assertThat(idioma1).isEqualTo(idioma2);

        idioma2 = getIdiomaSample2();
        assertThat(idioma1).isNotEqualTo(idioma2);
    }
}
