package localit.rentacar.model;

import java.util.UUID;

public record ClientDTO(UUID id, String name, String cpf, String address) {
  public static ClientDTO from(Client c) {
    return new ClientDTO(c.getId(), c.getName(), c.getCpf(), c.getAddress());
  }
}
