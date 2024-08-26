package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Idioma;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Idioma entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IdiomaRepository extends JpaRepository<Idioma, Long> {}
