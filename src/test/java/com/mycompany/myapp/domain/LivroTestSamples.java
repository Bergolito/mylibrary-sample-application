package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LivroTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Livro getLivroSample1() {
        return new Livro().id(1L).titulo("titulo1").subtitulo("subtitulo1").ano(1).numPags(1).isbn("isbn1").sinopse("sinopse1");
    }

    public static Livro getLivroSample2() {
        return new Livro().id(2L).titulo("titulo2").subtitulo("subtitulo2").ano(2).numPags(2).isbn("isbn2").sinopse("sinopse2");
    }

    public static Livro getLivroRandomSampleGenerator() {
        return new Livro()
            .id(longCount.incrementAndGet())
            .titulo(UUID.randomUUID().toString())
            .subtitulo(UUID.randomUUID().toString())
            .ano(intCount.incrementAndGet())
            .numPags(intCount.incrementAndGet())
            .isbn(UUID.randomUUID().toString())
            .sinopse(UUID.randomUUID().toString());
    }
}
