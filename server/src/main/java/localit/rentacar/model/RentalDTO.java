package localit.rentacar.model;

import java.time.*;

public record RentalDTO(
  Long id,
  CarDTO car,
  LocalDate startDate,
  LocalDate endDate,
  Rental.Status status,
  Instant createdAt
) {
  public static RentalDTO from(Rental r) {
    return new RentalDTO(
      r.getId(),
      CarDTO.from(r.getCar()),
      r.getStartDate(),
      r.getEndDate(),
      r.getStatus(),
      r.getCreatedAt()
    );
  }
}
