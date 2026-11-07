package localit.rentacar.service;

import java.util.*;
import localit.rentacar.model.Agent;
import localit.rentacar.repository.AgentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AgentService {

  private final AgentRepository agents;

  public AgentService(AgentRepository agents) {
    this.agents = agents;
  }

  public Agent require(UUID id) {
    return agents
      .findById(id)
      .filter(Agent::isActive)
      .orElseThrow(() ->
        new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          "Acesso exclusivo para agentes cadastrados."
        )
      );
  }
}
