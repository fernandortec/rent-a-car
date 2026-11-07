package localit.rentacar.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!test")
public class DatabaseConfiguration {

  @Bean
  DataSource dataSource(@Value("${DATABASE_URL}") String databaseUrl) {
    URI uri = URI.create(databaseUrl);
    String[] credentials = uri.getRawUserInfo().split(":", 2);
    String host = uri.getHost().contains(":")
      ? "[" + uri.getHost() + "]"
      : uri.getHost();
    String url =
      "jdbc:postgresql://" +
      host +
      (uri.getPort() == -1 ? "" : ":" + uri.getPort()) +
      uri.getRawPath() +
      (uri.getRawQuery() == null
        ? "?sslmode=require"
        : "?" + uri.getRawQuery());
    return DataSourceBuilder.create()
      .url(url)
      .username(decode(credentials[0]))
      .password(decode(credentials[1]))
      .build();
  }

  private String decode(String value) {
    return URLDecoder.decode(value.replace("+", "%2B"), StandardCharsets.UTF_8);
  }
}
