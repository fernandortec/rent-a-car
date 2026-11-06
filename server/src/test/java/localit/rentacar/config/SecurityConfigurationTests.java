package localit.rentacar.config;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.server.resource.introspection.BadOpaqueTokenException;
import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigurationTests {
    @Test
    void validatesBearerWithSupabaseAndRejectsInvalidOrIncompleteAccounts() throws Exception {
        UUID id = UUID.randomUUID();
        var response = new AtomicReference<>("{\"id\":\"" + id
                + "\",\"email\":\"verified@example.com\",\"role\":\"authenticated\"}");
        var status = new AtomicInteger(200);
        var authorization = new AtomicReference<String>();
        var apiKey = new AtomicReference<String>();
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/auth/v1/user", exchange -> {
            authorization.set(exchange.getRequestHeaders().getFirst("Authorization"));
            apiKey.set(exchange.getRequestHeaders().getFirst("apikey"));
            byte[] body = response.get().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(status.get(), body.length);
            try (var output = exchange.getResponseBody()) { output.write(body); }
        });
        server.start();
        try {
            var introspector = new SecurityConfiguration().supabaseTokenIntrospector(
                    "http://127.0.0.1:" + server.getAddress().getPort(), "publishable-key");
            var principal = introspector.introspect("access-token");
            assertEquals(id.toString(), principal.getName());
            assertEquals("verified@example.com", principal.getAttribute("email"));
            assertEquals("Bearer access-token", authorization.get());
            assertEquals("publishable-key", apiKey.get());
            response.set("{\"id\":\"" + id + "\"}");
            assertThrows(BadOpaqueTokenException.class, () -> introspector.introspect("missing-email"));
            status.set(401);
            response.set("{\"message\":\"Expired token\"}");
            assertThrows(BadOpaqueTokenException.class, () -> introspector.introspect("expired"));
        } finally {
            server.stop(0);
        }
    }
}
