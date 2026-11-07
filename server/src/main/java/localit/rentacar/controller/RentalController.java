package localit.rentacar.controller;

import jakarta.validation.Valid;
import java.util.*;
import localit.rentacar.model.*;
import localit.rentacar.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

  private final RentalService rentals;

  public RentalController(RentalService rentals) {
    this.rentals = rentals;
  }

  @GetMapping
  public List<RentalDTO> list(
    @AuthenticationPrincipal OAuth2AuthenticatedPrincipal p
  ) {
    return rentals.list(UUID.fromString(p.getName()));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public RentalDTO create(
    @AuthenticationPrincipal OAuth2AuthenticatedPrincipal p,
    @Valid @RequestBody RentalInput input
  ) {
    return rentals.create(UUID.fromString(p.getName()), input);
  }
}
