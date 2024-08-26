package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AutorTestSamples.*;
import static com.mycompany.myapp.domain.EditoraTestSamples.*;
import static com.mycompany.myapp.domain.IdiomaTestSamples.*;
import static com.mycompany.myapp.domain.LivroTestSamples.*;
import static com.mycompany.myapp.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LivroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Livro.class);
        Livro livro1 = getLivroSample1();
        Livro livro2 = new Livro();
        assertThat(livro1).isNotEqualTo(livro2);

        livro2.setId(livro1.getId());
        assertThat(livro1).isEqualTo(livro2);

        livro2 = getLivroSample2();
        assertThat(livro1).isNotEqualTo(livro2);
    }

    @Test
    void autorTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Autor autorBack = getAutorRandomSampleGenerator();

        livro.setAutor(autorBack);
        assertThat(livro.getAutor()).isEqualTo(autorBack);

        livro.autor(null);
        assertThat(livro.getAutor()).isNull();
    }

    @Test
    void editoraTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Editora editoraBack = getEditoraRandomSampleGenerator();

        livro.setEditora(editoraBack);
        assertThat(livro.getEditora()).isEqualTo(editoraBack);

        livro.editora(null);
        assertThat(livro.getEditora()).isNull();
    }

    @Test
    void idiomaTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Idioma idiomaBack = getIdiomaRandomSampleGenerator();

        livro.setIdioma(idiomaBack);
        assertThat(livro.getIdioma()).isEqualTo(idiomaBack);

        livro.idioma(null);
        assertThat(livro.getIdioma()).isNull();
    }

    @Test
    void usuariosTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        livro.addUsuarios(usuarioBack);
        assertThat(livro.getUsuarios()).containsOnly(usuarioBack);

        livro.removeUsuarios(usuarioBack);
        assertThat(livro.getUsuarios()).doesNotContain(usuarioBack);

        livro.usuarios(new HashSet<>(Set.of(usuarioBack)));
        assertThat(livro.getUsuarios()).containsOnly(usuarioBack);

        livro.setUsuarios(new HashSet<>());
        assertThat(livro.getUsuarios()).doesNotContain(usuarioBack);
    }
}
