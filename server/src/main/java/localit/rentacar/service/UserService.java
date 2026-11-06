package localit.rentacar.service;

import java.util.UUID;
import localit.rentacar.model.User;
import localit.rentacar.model.UserDTO;
import localit.rentacar.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository users;

    public UserService(UserRepository users) {
        this.users = users;
    }

    @Transactional
    public UserDTO provision(UUID id, String email) {
        User user = users.findById(id).orElseGet(() -> users.save(new User(id, email)));
        return new UserDTO(user.getId(), user.getEmail(), user.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public UserDTO read(UUID id) {
        User user = users.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile has not been created"));
        return new UserDTO(user.getId(), user.getEmail(), user.getCreatedAt());
    }
}
