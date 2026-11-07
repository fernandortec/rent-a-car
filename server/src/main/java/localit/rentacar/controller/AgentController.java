package localit.rentacar.controller;

import java.util.UUID;
import localit.rentacar.model.Agent;
import localit.rentacar.service.AgentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

  private final AgentService agents;

  public AgentController(AgentService agents) {
    this.agents = agents;
  }

  @GetMapping("/me")
  public Agent me(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal p) {
    return agents.require(UUID.fromString(p.getName()));
  }
}
