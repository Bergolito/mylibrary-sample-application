package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.FormatoLivro;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Livro.
 */
@Entity
@Table(name = "livro")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Livro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "subtitulo")
    private String subtitulo;

    @Column(name = "ano")
    private Integer ano;

    @Column(name = "num_pags")
    private Integer numPags;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "sinopse")
    private String sinopse;

    @Enumerated(EnumType.STRING)
    @Column(name = "formato")
    private FormatoLivro formato;

    @Lob
    @Column(name = "capa")
    private byte[] capa;

    @Column(name = "capa_content_type")
    private String capaContentType;

    @ManyToOne(fetch = FetchType.EAGER)
    private Autor autor;

    @ManyToOne(fetch = FetchType.EAGER)
    private Editora editora;

    @ManyToOne(fetch = FetchType.EAGER)
    private Idioma idioma;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "rel_livro__usuarios",
        joinColumns = @JoinColumn(name = "livro_id"),
        inverseJoinColumns = @JoinColumn(name = "usuarios_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "livros" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Livro id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Livro titulo(String titulo) {
        this.setTitulo(titulo);
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getSubtitulo() {
        return this.subtitulo;
    }

    public Livro subtitulo(String subtitulo) {
        this.setSubtitulo(subtitulo);
        return this;
    }

    public void setSubtitulo(String subtitulo) {
        this.subtitulo = subtitulo;
    }

    public Integer getAno() {
        return this.ano;
    }

    public Livro ano(Integer ano) {
        this.setAno(ano);
        return this;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Integer getNumPags() {
        return this.numPags;
    }

    public Livro numPags(Integer numPags) {
        this.setNumPags(numPags);
        return this;
    }

    public void setNumPags(Integer numPags) {
        this.numPags = numPags;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public Livro isbn(String isbn) {
        this.setIsbn(isbn);
        return this;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getSinopse() {
        return this.sinopse;
    }

    public Livro sinopse(String sinopse) {
        this.setSinopse(sinopse);
        return this;
    }

    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }

    public FormatoLivro getFormato() {
        return this.formato;
    }

    public Livro formato(FormatoLivro formato) {
        this.setFormato(formato);
        return this;
    }

    public void setFormato(FormatoLivro formato) {
        this.formato = formato;
    }

    public byte[] getCapa() {
        return this.capa;
    }

    public Livro capa(byte[] capa) {
        this.setCapa(capa);
        return this;
    }

    public void setCapa(byte[] capa) {
        this.capa = capa;
    }

    public String getCapaContentType() {
        return this.capaContentType;
    }

    public Livro capaContentType(String capaContentType) {
        this.capaContentType = capaContentType;
        return this;
    }

    public void setCapaContentType(String capaContentType) {
        this.capaContentType = capaContentType;
    }

    public Autor getAutor() {
        return this.autor;
    }

    public void setAutor(Autor autor) {
        this.autor = autor;
    }

    public Livro autor(Autor autor) {
        this.setAutor(autor);
        return this;
    }

    public Editora getEditora() {
        return this.editora;
    }

    public void setEditora(Editora editora) {
        this.editora = editora;
    }

    public Livro editora(Editora editora) {
        this.setEditora(editora);
        return this;
    }

    public Idioma getIdioma() {
        return this.idioma;
    }

    public void setIdioma(Idioma idioma) {
        this.idioma = idioma;
    }

    public Livro idioma(Idioma idioma) {
        this.setIdioma(idioma);
        return this;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }

    public Livro usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Livro addUsuarios(Usuario usuario) {
        this.usuarios.add(usuario);
        return this;
    }

    public Livro removeUsuarios(Usuario usuario) {
        this.usuarios.remove(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Livro)) {
            return false;
        }
        return getId() != null && getId().equals(((Livro) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Livro{" +
            "id=" + getId() +
            ", titulo='" + getTitulo() + "'" +
            ", subtitulo='" + getSubtitulo() + "'" +
            ", ano=" + getAno() +
            ", numPags=" + getNumPags() +
            ", isbn='" + getIsbn() + "'" +
            ", sinopse='" + getSinopse() + "'" +
            ", formato='" + getFormato() + "'" +
            ", capa='" + getCapa() + "'" +
            ", capaContentType='" + getCapaContentType() + "'" +
            "}\n";
    }
}
