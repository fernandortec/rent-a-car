package localit.rentacar.model;

import java.time.Instant;
import java.util.UUID;

public record UserDTO(UUID id, String email, Instant createdAt) {}
