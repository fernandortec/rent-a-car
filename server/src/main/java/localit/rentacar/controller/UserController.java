package localit.rentacar.controller;

import java.util.UUID;
import localit.rentacar.model.UserDTO;
import localit.rentacar.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {
    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    @PostMapping
    public UserDTO provision(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        return users.provision(UUID.fromString(principal.getName()), principal.getAttribute("email"));
    }

    @GetMapping
    public UserDTO read(@AuthenticationPrincipal OAuth2AuthenticatedPrincipal principal) {
        return users.read(UUID.fromString(principal.getName()));
    }
}
