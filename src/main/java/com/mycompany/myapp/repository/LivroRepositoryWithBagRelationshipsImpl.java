package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Livro;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class LivroRepositoryWithBagRelationshipsImpl implements LivroRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String LIVROS_PARAMETER = "livros";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Livro> fetchBagRelationships(Optional<Livro> livro) {
        return livro.map(this::fetchUsuarios);
    }

    @Override
    public Page<Livro> fetchBagRelationships(Page<Livro> livros) {
        return new PageImpl<>(fetchBagRelationships(livros.getContent()), livros.getPageable(), livros.getTotalElements());
    }

    @Override
    public List<Livro> fetchBagRelationships(List<Livro> livros) {
        return Optional.of(livros).map(this::fetchUsuarios).orElse(Collections.emptyList());
    }

    Livro fetchUsuarios(Livro result) {
        return entityManager
            .createQuery("select livro from Livro livro left join fetch livro.usuarios where livro.id = :id", Livro.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Livro> fetchUsuarios(List<Livro> livros) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, livros.size()).forEach(index -> order.put(livros.get(index).getId(), index));
        List<Livro> result = entityManager
            .createQuery("select livro from Livro livro left join fetch livro.usuarios where livro in :livros", Livro.class)
            .setParameter(LIVROS_PARAMETER, livros)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
