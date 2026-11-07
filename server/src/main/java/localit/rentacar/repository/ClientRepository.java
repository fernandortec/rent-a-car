package localit.rentacar.repository;

import jakarta.persistence.LockModeType;
import java.util.*;
import localit.rentacar.model.Client;
import org.springframework.data.jpa.repository.*;

public interface ClientRepository extends JpaRepository<Client, UUID> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select c from Client c where c.id = :id")
  Optional<Client> findLockedById(UUID id);
}
