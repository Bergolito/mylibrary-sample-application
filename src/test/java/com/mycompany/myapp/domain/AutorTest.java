package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AutorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AutorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Autor.class);
        Autor autor1 = getAutorSample1();
        Autor autor2 = new Autor();
        assertThat(autor1).isNotEqualTo(autor2);

        autor2.setId(autor1.getId());
        assertThat(autor1).isEqualTo(autor2);

        autor2 = getAutorSample2();
        assertThat(autor1).isNotEqualTo(autor2);
    }
}
