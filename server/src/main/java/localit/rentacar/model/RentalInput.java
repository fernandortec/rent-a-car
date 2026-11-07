package localit.rentacar.model;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record RentalInput(
  @NotNull @Positive Long carId,
  @NotNull @FutureOrPresent LocalDate startDate,
  @NotNull LocalDate endDate
) {}
