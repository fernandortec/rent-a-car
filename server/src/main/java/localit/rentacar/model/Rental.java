package localit.rentacar.model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "rentals")
public class Rental {

  public enum Status {
    PENDING,
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "client_id")
  private Client client;

  @ManyToOne(optional = false)
  @JoinColumn(name = "car_id")
  private Car car;

  private LocalDate startDate;
  private LocalDate endDate;

  @Enumerated(EnumType.STRING)
  private Status status;

  private Instant createdAt;

  protected Rental() {}

  public Rental(Client client, Car car, LocalDate start, LocalDate end) {
    this.client = client;
    this.car = car;
    startDate = start;
    endDate = end;
    status = Status.PENDING;
    createdAt = Instant.now();
  }

  public Long getId() {
    return id;
  }

  public Car getCar() {
    return car;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public LocalDate getEndDate() {
    return endDate;
  }

  public Status getStatus() {
    return status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
