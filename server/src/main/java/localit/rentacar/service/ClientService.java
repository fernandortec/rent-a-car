package localit.rentacar.service;

import java.util.UUID;
import localit.rentacar.model.*;
import localit.rentacar.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ClientService {

  private final ClientRepository clients;
  private final RentalRepository rentals;

  public ClientService(ClientRepository clients, RentalRepository rentals) {
    this.clients = clients;
    this.rentals = rentals;
  }

  public ClientDTO create(UUID id, ClientInput input) {
    if (clients.existsById(id)) throw new ResponseStatusException(
      HttpStatus.CONFLICT,
      "Cadastro já existe. Use editar."
    );
    Client client = new Client(id);
    client.update(input);
    return ClientDTO.from(clients.saveAndFlush(client));
  }

  @Transactional(readOnly = true)
  public ClientDTO read(UUID id) {
    return ClientDTO.from(
      clients
        .findById(id)
        .orElseThrow(() ->
          new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Cadastro não encontrado."
          )
        )
    );
  }

  public ClientDTO update(UUID id, ClientInput input) {
    Client client = find(id);
    client.update(input);
    clients.flush();
    return ClientDTO.from(client);
  }

  public void delete(UUID id) {
    Client client = find(id);
    rentals.deleteByClientId(id);
    rentals.flush();
    clients.delete(client);
  }

  private Client find(UUID id) {
    return clients
      .findLockedById(id)
      .orElseThrow(() ->
        new ResponseStatusException(
          HttpStatus.NOT_FOUND,
          "Cadastro não encontrado."
        )
      );
  }
}
