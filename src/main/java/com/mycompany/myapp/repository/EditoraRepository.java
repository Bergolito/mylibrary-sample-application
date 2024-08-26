package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Editora;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Editora entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EditoraRepository extends JpaRepository<Editora, Long> {}
