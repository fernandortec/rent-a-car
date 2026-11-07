package localit.rentacar.repository;

import java.util.*;
import localit.rentacar.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepository extends JpaRepository<Rental, Long> {
  List<Rental> findByClientIdOrderByCreatedAtDescIdDesc(UUID clientId);
  void deleteByClientId(UUID clientId);
}
