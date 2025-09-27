package org.example.gamerscove;

import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Log
@SpringBootApplication
public class GamersCoveApplication implements CommandLineRunner {

    private final DataSource dataSource;

    public GamersCoveApplication(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static void main(String[] args) {
        SpringApplication.run(GamersCoveApplication.class, args);
    }

    @Override
    public void run(final String... args) {
        log.info("Datasource: " + dataSource.toString());
        final JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("select 1");
    }
}
