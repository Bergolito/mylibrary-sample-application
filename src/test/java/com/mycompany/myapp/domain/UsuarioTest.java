package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.LivroTestSamples.*;
import static com.mycompany.myapp.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Usuario.class);
        Usuario usuario1 = getUsuarioSample1();
        Usuario usuario2 = new Usuario();
        assertThat(usuario1).isNotEqualTo(usuario2);

        usuario2.setId(usuario1.getId());
        assertThat(usuario1).isEqualTo(usuario2);

        usuario2 = getUsuarioSample2();
        assertThat(usuario1).isNotEqualTo(usuario2);
    }

    @Test
    void livrosTest() {
        Usuario usuario = getUsuarioRandomSampleGenerator();
        Livro livroBack = getLivroRandomSampleGenerator();

        usuario.addLivros(livroBack);
        assertThat(usuario.getLivros()).containsOnly(livroBack);
        assertThat(livroBack.getUsuarios()).containsOnly(usuario);

        usuario.removeLivros(livroBack);
        assertThat(usuario.getLivros()).doesNotContain(livroBack);
        assertThat(livroBack.getUsuarios()).doesNotContain(usuario);

        usuario.livros(new HashSet<>(Set.of(livroBack)));
        assertThat(usuario.getLivros()).containsOnly(livroBack);
        assertThat(livroBack.getUsuarios()).containsOnly(usuario);

        usuario.setLivros(new HashSet<>());
        assertThat(usuario.getLivros()).doesNotContain(livroBack);
        assertThat(livroBack.getUsuarios()).doesNotContain(usuario);
    }
}
