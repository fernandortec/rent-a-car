package localit.rentacar;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.UUID;
import localit.rentacar.model.*;
import localit.rentacar.repository.CarRepository;
import localit.rentacar.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@ActiveProfiles("test")
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:minimal;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.sql.init.mode=never",
    "VITE_SUPABASE_URL=http://localhost:9999",
    "VITE_SUPABASE_PUBLISHABLE_KEY=test-key"
})
@Transactional
class RentacarApplicationTests {
    @Autowired ClientService clients;
    @Autowired RentalService rentals;
    @Autowired CarRepository cars;

    @Test
    void customerCrudAndRentalOwnership() {
        UUID owner = UUID.randomUUID();
        UUID other = UUID.randomUUID();
        clients.create(owner, new ClientInput("Ana", "12345678901", "Rua A"));
        assertEquals("Ana", clients.read(owner).name());
        clients.update(owner, new ClientInput("Ana Silva", "12345678901", "Rua B"));
        assertEquals("Rua B", clients.read(owner).address());
        assertThrows(ResponseStatusException.class, () -> clients.read(other));

        Car car = cars.save(new Car("TEST-001", 2024, "Fiat", "Argo", "ABC1D23"));
        LocalDate start = LocalDate.now().plusDays(1);
        RentalDTO order = rentals.create(owner, new RentalInput(car.getId(), start, start.plusDays(2)));
        assertEquals(Rental.Status.PENDING, order.status());
        assertEquals(1, rentals.list(owner).size());
        assertTrue(rentals.list(other).isEmpty());

        clients.delete(owner);
        assertTrue(rentals.list(owner).isEmpty());
        assertThrows(ResponseStatusException.class, () -> clients.read(owner));
    }

    @Test
    void rentalRequiresProfileAndValidPeriod() {
        UUID owner = UUID.randomUUID();
        LocalDate start = LocalDate.now().plusDays(1);
        RentalInput input = new RentalInput(1L, start, start.plusDays(1));
        assertEquals(409, assertThrows(ResponseStatusException.class,
            () -> rentals.create(owner, input)).getStatusCode().value());
        clients.create(owner, new ClientInput("Bruno", "98765432100", "Rua C"));
        assertEquals(400, assertThrows(ResponseStatusException.class,
            () -> rentals.create(owner, new RentalInput(1L, start, start))).getStatusCode().value());
    }
}
