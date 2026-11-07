package localit.rentacar.repository;

import java.util.UUID;
import localit.rentacar.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, UUID> {}
