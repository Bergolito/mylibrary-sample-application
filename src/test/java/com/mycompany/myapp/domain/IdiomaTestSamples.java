package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class IdiomaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Idioma getIdiomaSample1() {
        return new Idioma().id(1L).nome("nome1").descricao("descricao1");
    }

    public static Idioma getIdiomaSample2() {
        return new Idioma().id(2L).nome("nome2").descricao("descricao2");
    }

    public static Idioma getIdiomaRandomSampleGenerator() {
        return new Idioma().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString()).descricao(UUID.randomUUID().toString());
    }
}
