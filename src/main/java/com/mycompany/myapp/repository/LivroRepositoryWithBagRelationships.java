package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Livro;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface LivroRepositoryWithBagRelationships {
    Optional<Livro> fetchBagRelationships(Optional<Livro> livro);

    List<Livro> fetchBagRelationships(List<Livro> livros);

    Page<Livro> fetchBagRelationships(Page<Livro> livros);
}
