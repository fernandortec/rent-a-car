package localit.rentacar.config;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.BadOpaqueTokenException;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfiguration {

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
      .cors(Customizer.withDefaults())
      // Bearer tokens are sent explicitly; the API does not use cookie authentication.
      .csrf(csrf -> csrf.disable())
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth ->
        auth
          .requestMatchers(HttpMethod.OPTIONS, "/**")
          .permitAll()
          .anyRequest()
          .authenticated()
      )
      .oauth2ResourceServer(server ->
        server.opaqueToken(Customizer.withDefaults())
      )
      .build();
  }

  @Bean
  OpaqueTokenIntrospector supabaseTokenIntrospector(
    @Value("${VITE_SUPABASE_URL}") String url,
    @Value("${VITE_SUPABASE_PUBLISHABLE_KEY}") String key
  ) {
    var factory = new JdkClientHttpRequestFactory(
      HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build()
    );
    factory.setReadTimeout(Duration.ofSeconds(10));
    RestClient client = RestClient.builder()
      .baseUrl(url + "/auth/v1")
      .defaultHeader("apikey", key)
      .requestFactory(factory)
      .build();
    return token -> {
      try {
        SupabaseUser user = client
          .get()
          .uri("/user")
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
          .retrieve()
          .body(SupabaseUser.class);
        if (
          user == null ||
          user.id() == null ||
          user.email() == null ||
          user.email().isBlank()
        ) {
          throw new BadOpaqueTokenException(
            "An authenticated email account is required"
          );
        }
        return new DefaultOAuth2AuthenticatedPrincipal(
          user.id().toString(),
          Map.of("sub", user.id().toString(), "email", user.email()),
          List.of()
        );
      } catch (RestClientException error) {
        throw new BadOpaqueTokenException(
          "Unable to validate the Supabase session"
        );
      }
    };
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource(
    @Value("${APP_FRONTEND_ORIGIN:http://localhost:3000}") String origin
  ) {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(origin));
    configuration.setAllowedMethods(
      List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
    );
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    UrlBasedCorsConfigurationSource source =
      new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
  }

  private record SupabaseUser(UUID id, String email) {}
}
