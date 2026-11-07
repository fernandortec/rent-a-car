package localit.rentacar.model;

import jakarta.validation.constraints.*;

public record ClientInput(
  @NotBlank @Size(max = 160) String name,
  @NotNull @Pattern(regexp = "[0-9]{11}") String cpf,
  @NotBlank @Size(max = 255) String address
) {}
