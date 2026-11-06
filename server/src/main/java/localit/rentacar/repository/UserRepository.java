package localit.rentacar.repository;

import java.util.UUID;
import localit.rentacar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, UUID> {
    @Modifying
    @Query(value = """
            INSERT INTO app_users (id, email, created_at)
            VALUES (:id, :email, CURRENT_TIMESTAMP)
            ON CONFLICT DO NOTHING
            """, nativeQuery = true)
    void createIfAbsent(@Param("id") UUID id, @Param("email") String email);
}
