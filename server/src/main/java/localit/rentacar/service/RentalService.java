package localit.rentacar.service;

import java.util.*;
import localit.rentacar.model.*;
import localit.rentacar.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class RentalService {

  private final RentalRepository rentals;
  private final ClientRepository clients;
  private final CarRepository cars;

  public RentalService(
    RentalRepository rentals,
    ClientRepository clients,
    CarRepository cars
  ) {
    this.rentals = rentals;
    this.clients = clients;
    this.cars = cars;
  }

  @Transactional(readOnly = true)
  public List<RentalDTO> list(UUID owner) {
    return rentals
      .findByClientIdOrderByCreatedAtDescIdDesc(owner)
      .stream()
      .map(RentalDTO::from)
      .toList();
  }

  public RentalDTO create(UUID owner, RentalInput input) {
    Client client = clients
      .findLockedById(owner)
      .orElseThrow(() ->
        new ResponseStatusException(
          HttpStatus.CONFLICT,
          "Complete seu cadastro antes de solicitar um aluguel."
        )
      );
    if (
      !input.endDate().isAfter(input.startDate())
    ) throw new ResponseStatusException(
      HttpStatus.BAD_REQUEST,
      "A devolução deve ser posterior à retirada."
    );
    Car car = cars
      .findById(input.carId())
      .orElseThrow(() ->
        new ResponseStatusException(
          HttpStatus.NOT_FOUND,
          "Carro não encontrado."
        )
      );
    return RentalDTO.from(
      rentals.save(new Rental(client, car, input.startDate(), input.endDate()))
    );
  }
}
