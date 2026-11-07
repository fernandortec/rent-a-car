package localit.rentacar.controller;

import jakarta.validation.Valid;
import java.util.UUID;
import localit.rentacar.model.*;
import localit.rentacar.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients/me")
public class ClientController {

  private final ClientService clients;

  public ClientController(ClientService clients) {
    this.clients = clients;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ClientDTO create(
    @AuthenticationPrincipal OAuth2AuthenticatedPrincipal p,
    @Valid @RequestBody ClientInput input
  ) {
    return clients.create(UUID.fromString(p.getName()), input);
  }

  @GetMapping
  public ClientDTO read(
    @AuthenticationPrincipal OAuth2AuthenticatedPrincipal p
  ) {
    return clients.read(UUID.fromString(p.getName()));
  }

  @PutMapping
  public ClientDTO update(
    @AuthenticationPrincipal OAuth2AuthenticatedPrincipal p,
    @Valid @RequestBody ClientInput input
  ) {
    return clients.update(UUID.fromString(p.getName()), input);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal p) {
    clients.delete(UUID.fromString(p.getName()));
  }
}
