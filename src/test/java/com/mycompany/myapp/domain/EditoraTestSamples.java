package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EditoraTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Editora getEditoraSample1() {
        return new Editora().id(1L).nome("nome1");
    }

    public static Editora getEditoraSample2() {
        return new Editora().id(2L).nome("nome2");
    }

    public static Editora getEditoraRandomSampleGenerator() {
        return new Editora().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
