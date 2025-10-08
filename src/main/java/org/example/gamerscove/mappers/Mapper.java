package org.example.gamerscove.mappers;

public interface Mapper<A,B>{

    B mapTo(A a);

    A mapFrom(B b);
}
